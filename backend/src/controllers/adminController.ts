import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types/express.types';
import { CourseCreateRequest, CourseUpdateRequest } from '../types/course.types';
import { BadRequestError, NotFoundError, ConflictError } from '../middleware/errorHandler';
import { deleteCached, CACHE_KEYS } from '../config/redis';
import { Prisma, EnrollmentStatus, GradeStatus, StudentStatus, CourseStatus } from '@prisma/client';

/**
 * ===================
 * COURSE MANAGEMENT
 * ===================
 */

/**
 * Create a new course
 * POST /api/admin/courses
 */
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      course_code,
      course_name,
      description,
      credits,
      instructor_id,
      department,
      semester,
      year,
      max_enrollment,
      prerequisites,
      time_slots,
    }: CourseCreateRequest = req.body;

    // Check if course code already exists for this semester/year
    const existing = await prisma.courses.findFirst({
      where: {
        courseCode: course_code,
        semester,
        year,
      },
    });

    if (existing) {
      throw new ConflictError('Course with this code already exists for the specified semester and year');
    }

    // Create course with time slots
    const course = await prisma.courses.create({
      data: {
        courseCode: course_code,
        courseName: course_name,
        description,
        credits,
        instructorId: instructor_id,
        department,
        semester,
        year,
        maxCapacity: max_enrollment,
        currentEnrollment: 0,
        prerequisites: prerequisites ? JSON.stringify(prerequisites) : null,
        status: CourseStatus.ACTIVE,
        timeSlots: {
          create: time_slots.map((slot) => ({
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            location: slot.location,
            type: (slot.type || 'LECTURE').toUpperCase(),
          })),
        },
      },
      include: {
        timeSlots: true,
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update course
 * PUT /api/admin/courses/:id
 */
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: CourseUpdateRequest = req.body;

    const updateData: Prisma.CourseUpdateInput = {};

    if (updates.course_name) updateData.courseName = updates.course_name;
    if (updates.description) updateData.description = updates.description;
    if (updates.max_enrollment !== undefined) updateData.maxCapacity = updates.max_enrollment;
    if (updates.status) updateData.status = updates.status as CourseStatus;
    if (updates.prerequisites) updateData.prerequisites = JSON.stringify(updates.prerequisites);

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError('No fields to update');
    }

    const course = await prisma.courses.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        timeSlots: true,
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Invalidate cache
    await deleteCached(`${CACHE_KEYS.COURSE}${id}`);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete course (soft delete)
 * DELETE /api/admin/courses/:id
 */
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if course has active enrollments
    const enrollmentCount = await prisma.enrollments.count({
      where: {
        courseId: parseInt(id),
        status: EnrollmentStatus.CONFIRMED,
      },
    });

    if (enrollmentCount > 0) {
      throw new BadRequestError('Cannot delete course with active enrollments');
    }

    // Soft delete by updating status
      await prisma.courses.update({
      where: { id: parseInt(id) },
      data: { status: CourseStatus.INACTIVE },
    });

    // Invalidate cache
    await deleteCached(`${CACHE_KEYS.COURSE}${id}`);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get course enrollments
 * GET /api/admin/courses/:id/enrollments
 */
export const getCourseEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const enrollments = await prisma.enrollments.findMany({
      where: {
        courseId: parseInt(id),
        status: {
          in: [EnrollmentStatus.CONFIRMED, EnrollmentStatus.WAITLISTED],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            userIdentifier: true,
            major: true,
            yearLevel: true,
            student: {
              select: {
                studentId: true,
              },
            },
          },
        },
        grade: true,
      },
      orderBy: [
        { status: 'asc' },
        { enrolledAt: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Course enrollments retrieved successfully',
      data: enrollments,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * STUDENT MANAGEMENT
 * ===================
 */

/**
 * Get all students with filters
 * GET /api/admin/students
 */
export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      perPage = 50,
      search,
      major,
      year,
      status,
      sortBy = 'studentId',
      sortOrder = 'asc',
    } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);
    const take = Number(perPage);

    const where: Prisma.StudentWhereInput = {};

    if (status) {
      where.status = status as StudentStatus;
    }

    if (year) {
      where.year = Number(year);
    }

    if (major) {
      where.major = {
        name: {
          contains: major as string,
          mode: 'insensitive',
        },
      };
    }

    if (search) {
      where.OR = [
        {
          studentId: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
        {
          user: {
            fullName: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.students.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              userIdentifier: true,
              email: true,
              fullName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          major: true,
          advisor: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc',
        },
      }),
      prisma.students.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: students,
      metadata: {
        page: Number(page),
        perPage: Number(perPage),
        total,
        totalPages: Math.ceil(total / Number(perPage)),
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get student by ID
 * GET /api/admin/students/:id
 */
export const getStudentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          include: {
            personalInfo: true,
            enrollments: {
              include: {
                course: true,
                grade: true,
              },
            },
          },
        },
        major: {
          include: {
            requirements: true,
          },
        },
        advisor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Calculate GPA
    const grades = await prisma.grades.findMany({
      where: {
        enrollment: {
          userId: student.userId,
        },
        status: GradeStatus.PUBLISHED,
        gradePoints: {
          not: null,
        },
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
      },
    });

    let totalPoints = 0;
    let totalCredits = 0;
    let majorPoints = 0;
    let majorCredits = 0;

    grades.forEach((grade) => {
      const credits = grade.enrollment.course.credits;
      const points = grade.gradePoints || 0;

      totalPoints += points * credits;
      totalCredits += credits;

      // Check if it's a major course
      if (grade.enrollment.course.department === student.major?.department) {
        majorPoints += points * credits;
        majorCredits += credits;
      }
    });

    const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const majorGPA = majorCredits > 0 ? majorPoints / majorCredits : 0;

    res.status(200).json({
      success: true,
      data: {
        ...student,
        gpa: {
          cumulative: parseFloat(cumulativeGPA.toFixed(3)),
          major: parseFloat(majorGPA.toFixed(3)),
        },
        creditsEarned: totalCredits,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Create new student
 * POST /api/admin/students
 */
export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      full_name,
      student_id,
      major_id,
      minor_id,
      advisor_id,
      year,
      admission_date,
      expected_graduation,
      personal_info,
    } = req.body;

    // Check if email or student ID already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { userIdentifier: student_id },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictError('User with this email or student ID already exists');
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and student in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          userIdentifier: student_id,
          email,
          passwordHash,
          fullName: full_name,
          role: 'STUDENT',
          student: {
            create: {
              studentId: student_id,
              majorId: major_id,
              minorId: minor_id,
              advisorId: advisor_id,
              year,
              admissionDate: new Date(admission_date),
              expectedGrad: expected_graduation ? new Date(expected_graduation) : null,
              status: StudentStatus.ACTIVE,
            },
          },
        },
        include: {
          student: {
            include: {
              major: true,
              advisor: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // Create personal info if provided
      if (personal_info) {
        await tx.personalInfo.create({
          data: {
            userId: user.id,
            ...personal_info,
          },
        });
      }

      return user;
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'STUDENT',
        entityId: result.id,
        changes: { created: result },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update student
 * PUT /api/admin/students/:id
 */
export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const updateData: Prisma.StudentUpdateInput = {};
    const userUpdateData: Prisma.UserUpdateInput = {};

    if (updates.major_id !== undefined) updateData.majorId = updates.major_id;
    if (updates.minor_id !== undefined) updateData.minorId = updates.minor_id;
    if (updates.advisor_id !== undefined) updateData.advisorId = updates.advisor_id;
    if (updates.year !== undefined) updateData.year = updates.year;
    if (updates.expected_graduation) updateData.expectedGrad = new Date(updates.expected_graduation);
    if (updates.status) updateData.status = updates.status as StudentStatus;
    if (updates.full_name) userUpdateData.fullName = updates.full_name;
    if (updates.email) userUpdateData.email = updates.email;

    const updatedStudent = await prisma.students.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        user: userUpdateData && Object.keys(userUpdateData).length > 0 ? {
          update: userUpdateData,
        } : undefined,
      },
      include: {
        user: true,
        major: true,
        advisor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'STUDENT',
        entityId: student.id,
        changes: { before: student, after: updatedStudent },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Change student status
 * PUT /api/admin/students/:id/status
 */
export const updateStudentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reason, effective_date } = req.body;

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // If status is WITHDRAWN, drop all active enrollments
    if (status === StudentStatus.WITHDRAWN) {
      await prisma.enrollments.updateMany({
        where: {
          userId: student.userId,
          status: EnrollmentStatus.CONFIRMED,
        },
        data: {
          status: EnrollmentStatus.DROPPED,
        },
      });
    }

    const updatedStudent = await prisma.students.update({
      where: { id: parseInt(id) },
      data: {
        status: status as StudentStatus,
      },
      include: {
        user: true,
        major: true,
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'STATUS_CHANGE',
        entityType: 'STUDENT',
        entityId: student.id,
        changes: {
          oldStatus: student.status,
          newStatus: status,
          reason,
          effectiveDate: effective_date,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Student status updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete student (soft delete)
 * DELETE /api/admin/students/:id
 */
export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Update status to withdrawn instead of deleting
    await prisma.students.update({
      where: { id: parseInt(id) },
      data: {
        status: StudentStatus.WITHDRAWN,
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'STUDENT',
        entityId: student.id,
        changes: { deleted: student },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * ENROLLMENT MANAGEMENT
 * ===================
 */

/**
 * Get all enrollments with filters
 * GET /api/admin/enrollments
 */
export const getEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      perPage = 50,
      status,
      course_id,
      student_id,
      semester,
      year,
    } = req.query;

    const skip = (Number(page) - 1) * Number(perPage);
    const take = Number(perPage);

    const where: Prisma.EnrollmentWhereInput = {};

    if (status) where.status = status as EnrollmentStatus;
    if (course_id) where.courseId = parseInt(course_id as string);
    if (student_id) where.userId = parseInt(student_id as string);
    if (semester || year) {
      where.course = {};
      if (semester) where.course.semester = semester as any;
      if (year) where.course.year = parseInt(year as string);
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollments.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              userIdentifier: true,
              student: {
                select: {
                  studentId: true,
                  year: true,
                  major: true,
                },
              },
            },
          },
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
              timeSlots: true,
            },
          },
          grade: true,
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      }),
      prisma.enrollments.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: enrollments,
      metadata: {
        page: Number(page),
        perPage: Number(perPage),
        total,
        totalPages: Math.ceil(total / Number(perPage)),
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get pending enrollment approvals
 * GET /api/admin/enrollments/pending
 */
export const getPendingEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollments = await prisma.enrollments.findMany({
      where: {
        status: EnrollmentStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            student: {
              select: {
                studentId: true,
                year: true,
                major: true,
              },
            },
          },
        },
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                fullName: true,
              },
            },
            timeSlots: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Approve enrollment
 * POST /api/admin/enrollments/:id/approve
 */
export const approveEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const enrollment = await prisma.enrollments.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.PENDING) {
      throw new BadRequestError('Enrollment is not in pending status');
    }

    // Check if course is full
    if (enrollment.course.currentEnrollment >= enrollment.course.maxCapacity) {
      throw new BadRequestError('Course is full');
    }

    // Update enrollment status and increment course enrollment
    const updatedEnrollment = await prisma.$transaction(async (tx) => {
      await tx.course.update({
        where: { id: enrollment.courseId },
        data: {
          currentEnrollment: {
            increment: 1,
          },
        },
      });

      return tx.enrollment.update({
        where: { id: parseInt(id) },
        data: {
          status: EnrollmentStatus.CONFIRMED,
        },
        include: {
          user: true,
          course: true,
        },
      });
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'APPROVE',
        entityType: 'ENROLLMENT',
        entityId: enrollment.id,
        changes: {
          oldStatus: enrollment.status,
          newStatus: EnrollmentStatus.CONFIRMED,
          notes,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment approved successfully',
      data: updatedEnrollment,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Reject enrollment
 * POST /api/admin/enrollments/:id/reject
 */
export const rejectEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new BadRequestError('Rejection reason is required');
    }

    const enrollment = await prisma.enrollments.findUnique({
      where: { id: parseInt(id) },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.PENDING) {
      throw new BadRequestError('Enrollment is not in pending status');
    }

    const updatedEnrollment = await prisma.enrollments.update({
      where: { id: parseInt(id) },
      data: {
        status: EnrollmentStatus.REJECTED,
      },
      include: {
        user: true,
        course: true,
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'REJECT',
        entityType: 'ENROLLMENT',
        entityId: enrollment.id,
        changes: {
          oldStatus: enrollment.status,
          newStatus: EnrollmentStatus.REJECTED,
          reason,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment rejected successfully',
      data: updatedEnrollment,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk approve enrollments
 * POST /api/admin/enrollments/bulk-approve
 */
export const bulkApproveEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { enrollment_ids } = req.body;

    if (!Array.isArray(enrollment_ids) || enrollment_ids.length === 0) {
      throw new BadRequestError('enrollment_ids must be a non-empty array');
    }

    const results = {
      approved: [] as number[],
      failed: [] as { id: number; reason: string }[],
    };

    for (const enrollmentId of enrollment_ids) {
      try {
        const enrollment = await prisma.enrollments.findUnique({
          where: { id: enrollmentId },
          include: { course: true },
        });

        if (!enrollment) {
          results.failed.push({ id: enrollmentId, reason: 'Enrollment not found' });
          continue;
        }

        if (enrollment.status !== EnrollmentStatus.PENDING) {
          results.failed.push({ id: enrollmentId, reason: 'Not in pending status' });
          continue;
        }

        if (enrollment.course.currentEnrollment >= enrollment.course.maxCapacity) {
          results.failed.push({ id: enrollmentId, reason: 'Course is full' });
          continue;
        }

        await prisma.$transaction(async (tx) => {
          await tx.course.update({
            where: { id: enrollment.courseId },
            data: { currentEnrollment: { increment: 1 } },
          });

          await tx.enrollment.update({
            where: { id: enrollmentId },
            data: { status: EnrollmentStatus.CONFIRMED },
          });
        });

        results.approved.push(enrollmentId);
      } catch (error) {
        results.failed.push({ id: enrollmentId, reason: 'Internal error' });
      }
    }

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'BULK_APPROVE',
        entityType: 'ENROLLMENT',
        entityId: 0,
        changes: { results },
      },
    });

    res.status(200).json({
      success: true,
      message: `Approved ${results.approved.length} enrollments, ${results.failed.length} failed`,
      data: results,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Drop student from course
 * DELETE /api/admin/enrollments/:id
 */
export const dropEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const enrollment = await prisma.enrollments.findUnique({
      where: { id: parseInt(id) },
      include: { course: true },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.CONFIRMED) {
      throw new BadRequestError('Can only drop confirmed enrollments');
    }

    await prisma.$transaction(async (tx) => {
      await tx.enrollment.update({
        where: { id: parseInt(id) },
        data: { status: EnrollmentStatus.DROPPED },
      });

      await tx.course.update({
        where: { id: enrollment.courseId },
        data: { currentEnrollment: { decrement: 1 } },
      });
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'DROP',
        entityType: 'ENROLLMENT',
        entityId: enrollment.id,
        changes: { reason },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Enrollment dropped successfully',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Manual enrollment (admin-initiated)
 * POST /api/admin/enrollments
 */
export const createEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { user_id, course_id, force = false } = req.body;

    // Check if enrollment already exists
    const existing = await prisma.enrollments.findUnique({
      where: {
        userId_courseId: {
          userId: user_id,
          courseId: course_id,
        },
      },
    });

    if (existing) {
      throw new ConflictError('Student is already enrolled in this course');
    }

    const course = await prisma.courses.findUnique({
      where: { id: course_id },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check capacity unless force is true
    if (!force && course.currentEnrollment >= course.maxCapacity) {
      throw new BadRequestError('Course is full. Use force=true to override.');
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      const newEnrollment = await tx.enrollment.create({
        data: {
          userId: user_id,
          courseId: course_id,
          status: EnrollmentStatus.CONFIRMED,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          course: true,
        },
      });

      await tx.course.update({
        where: { id: course_id },
        data: { currentEnrollment: { increment: 1 } },
      });

      return newEnrollment;
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'ENROLLMENT',
        entityId: enrollment.id,
        changes: { created: enrollment, force },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * GRADE MANAGEMENT
 * ===================
 */

/**
 * Get pending grade approvals
 * GET /api/admin/grades/pending
 */
export const getPendingGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grades = await prisma.grades.findMany({
      where: {
        status: GradeStatus.SUBMITTED,
      },
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                student: {
                  select: {
                    studentId: true,
                  },
                },
              },
            },
            course: {
              include: {
                instructor: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            },
          },
        },
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: grades,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Approve grade
 * POST /api/admin/grades/:id/approve
 */
export const approveGrade = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const grade = await prisma.grades.findUnique({
      where: { id: parseInt(id) },
    });

    if (!grade) {
      throw new NotFoundError('Grade not found');
    }

    if (grade.status !== GradeStatus.SUBMITTED) {
      throw new BadRequestError('Grade is not in submitted status');
    }

    const updatedGrade = await prisma.grades.update({
      where: { id: parseInt(id) },
      data: {
        status: GradeStatus.APPROVED,
        approvedBy: req.user!.id,
        approvedAt: new Date(),
        comments: comments || grade.comments,
      },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'APPROVE',
        entityType: 'GRADE',
        entityId: grade.id,
        changes: {
          oldStatus: grade.status,
          newStatus: GradeStatus.APPROVED,
          comments,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Grade approved successfully',
      data: updatedGrade,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk approve grades
 * POST /api/admin/grades/bulk-approve
 */
export const bulkApproveGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { grade_ids } = req.body;

    if (!Array.isArray(grade_ids) || grade_ids.length === 0) {
      throw new BadRequestError('grade_ids must be a non-empty array');
    }

    const updated = await prisma.grades.updateMany({
      where: {
        id: { in: grade_ids },
        status: GradeStatus.SUBMITTED,
      },
      data: {
        status: GradeStatus.APPROVED,
        approvedBy: req.user!.id,
        approvedAt: new Date(),
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'BULK_APPROVE',
        entityType: 'GRADE',
        entityId: 0,
        changes: { gradeIds: grade_ids, count: updated.count },
      },
    });

    res.status(200).json({
      success: true,
      message: `Approved ${updated.count} grades`,
      data: { count: updated.count },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Publish grades
 * POST /api/admin/grades/publish
 */
export const publishGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { grade_ids, course_id } = req.body;

    let where: Prisma.GradeWhereInput = {
      status: GradeStatus.APPROVED,
    };

    if (grade_ids && Array.isArray(grade_ids)) {
      where.id = { in: grade_ids };
    } else if (course_id) {
      where.enrollment = {
        courseId: course_id,
      };
    } else {
      throw new BadRequestError('Either grade_ids or course_id must be provided');
    }

    const updated = await prisma.grades.updateMany({
      where,
      data: {
        status: GradeStatus.PUBLISHED,
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'PUBLISH',
        entityType: 'GRADE',
        entityId: 0,
        changes: { gradeIds: grade_ids, courseId: course_id, count: updated.count },
      },
    });

    res.status(200).json({
      success: true,
      message: `Published ${updated.count} grades`,
      data: { count: updated.count },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * USER MANAGEMENT
 * ===================
 */

/**
 * Get all users
 * GET /api/admin/users
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, page = 1, limit = 50, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role as any;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { userIdentifier: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          userIdentifier: true,
          email: true,
          fullName: true,
          role: true,
          major: true,
          yearLevel: true,
          department: true,
          createdAt: true,
          updatedAt: true,
          students_students_user_idTousers: {
            select: {
              studentId: true,
              status: true,
            },
          },
          faculty: {
            select: {
              employeeId: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.users.count({ where }),
    ]);

    // Transform to match frontend expectations
    const transformedUsers = users.map((user) => ({
      ...user,
      student: user.students_students_user_idTousers
        ? {
            studentId: user.students_students_user_idTousers.studentId,
            status: user.students_students_user_idTousers.status,
          }
        : null,
    }));

    res.status(200).json({
      success: true,
      data: transformedUsers.map(({ students_students_user_idTousers, ...rest }) => rest),
      metadata: {
        page: Number(page),
        perPage: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error in getAllUsers:', error);
    // If it's a Prisma error, provide more details
    if (error.code) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error message:', error.message);
    }
    throw error;
  }
};

/**
 * ===================
 * SYSTEM STATISTICS
 * ===================
 */

/**
 * Get system statistics
 * GET /api/admin/statistics
 */
export const getSystemStatistics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalCourses,
      activeCourses,
      totalEnrollments,
      confirmedEnrollments,
      waitlistedEnrollments,
      pendingEnrollments,
      pendingGrades,
    ] = await Promise.all([
      prisma.users.count({ where: { role: 'STUDENT' } }),
      prisma.users.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.users.count({ where: { role: 'ADMINISTRATOR' } }),
      prisma.courses.count(),
      prisma.courses.count({ where: { status: CourseStatus.ACTIVE } }),
      prisma.enrollments.count(),
      prisma.enrollments.count({ where: { status: EnrollmentStatus.CONFIRMED } }),
      prisma.enrollments.count({ where: { status: EnrollmentStatus.WAITLISTED } }),
      prisma.enrollments.count({ where: { status: EnrollmentStatus.PENDING } }),
      prisma.grades.count({ where: { status: GradeStatus.SUBMITTED } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total_students: totalStudents,
          total_instructors: totalInstructors,
          total_admins: totalAdmins,
        },
        courses: {
          total: totalCourses,
          active: activeCourses,
        },
        enrollments: {
          total: totalEnrollments,
          confirmed: confirmedEnrollments,
          waitlisted: waitlistedEnrollments,
          pending: pendingEnrollments,
        },
        grades: {
          pending_approval: pendingGrades,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get enrollment statistics by semester
 * GET /api/admin/statistics/enrollments
 */
export const getEnrollmentStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { semester, year } = req.query;

    const where: Prisma.EnrollmentWhereInput = {
      status: EnrollmentStatus.CONFIRMED,
    };

    if (semester || year) {
      where.course = {};
      if (semester) where.course.semester = semester as any;
      if (year) where.course.year = parseInt(year as string);
    }

    const enrollments = await prisma.enrollments.groupBy({
      by: ['courseId'],
      where,
      _count: true,
    });

    const courseIds = enrollments.map((e) => e.courseId);
    const courses = await prisma.courses.findMany({
      where: { id: { in: courseIds } },
      select: {
        id: true,
        courseCode: true,
        courseName: true,
        department: true,
        maxCapacity: true,
        currentEnrollment: true,
      },
    });

    const statistics = enrollments.map((enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId);
      return {
        course_id: enrollment.courseId,
        course_code: course?.courseCode,
        course_name: course?.courseName,
        department: course?.department,
        enrolled: enrollment._count,
        capacity: course?.maxCapacity,
        fill_rate: course ? (enrollment._count / course.maxCapacity) * 100 : 0,
      };
    });

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get grade distribution statistics
 * GET /api/admin/statistics/grades
 */
export const getGradeStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { course_id, semester, year } = req.query;

    const where: Prisma.GradeWhereInput = {
      status: GradeStatus.PUBLISHED,
    };

    if (course_id) {
      where.enrollment = {
        courseId: parseInt(course_id as string),
      };
    } else if (semester || year) {
      where.enrollment = {
        course: {},
      };
      if (semester) where.enrollment.course.semester = semester as any;
      if (year) where.enrollment.course.year = parseInt(year as string);
    }

    const grades = await prisma.grades.groupBy({
      by: ['letterGrade'],
      where,
      _count: true,
      _avg: {
        gradePoints: true,
      },
    });

    const distribution = grades.map((g) => ({
      grade: g.letterGrade,
      count: g._count,
      avg_gpa: g._avg.gradePoints,
    }));

    res.status(200).json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * WAITLIST MANAGEMENT
 * ===================
 */

/**
 * Get waitlist for a course
 * GET /api/admin/courses/:id/waitlist
 */
export const getCourseWaitlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const waitlist = await prisma.enrollments.findMany({
      where: {
        courseId: parseInt(id),
        status: EnrollmentStatus.WAITLISTED,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            userIdentifier: true,
            student: {
              select: {
                studentId: true,
                year: true,
                major: true,
              },
            },
          },
        },
      },
      orderBy: {
        waitlistPosition: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: waitlist,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Promote student from waitlist
 * POST /api/admin/enrollments/:id/promote
 */
export const promoteFromWaitlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollments.findUnique({
      where: { id: parseInt(id) },
      include: { course: true },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.WAITLISTED) {
      throw new BadRequestError('Enrollment is not in waitlisted status');
    }

    // Check if course has space
    if (enrollment.course.currentEnrollment >= enrollment.course.maxCapacity) {
      throw new BadRequestError('Course is full');
    }

    // Promote to confirmed
    const updated = await prisma.$transaction(async (tx) => {
      await tx.course.update({
        where: { id: enrollment.courseId },
        data: { currentEnrollment: { increment: 1 } },
      });

      return tx.enrollment.update({
        where: { id: parseInt(id) },
        data: {
          status: EnrollmentStatus.CONFIRMED,
          waitlistPosition: null,
        },
        include: {
          user: true,
          course: true,
        },
      });
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'PROMOTE',
        entityType: 'ENROLLMENT',
        entityId: enrollment.id,
        changes: {
          oldStatus: enrollment.status,
          newStatus: EnrollmentStatus.CONFIRMED,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Student promoted from waitlist',
      data: updated,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * CONFLICT DETECTION
 * ===================
 */

/**
 * Check for schedule conflicts
 * POST /api/admin/conflicts/check
 */
export const checkConflicts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { user_id, course_ids } = req.body;

    if (!user_id || !course_ids || !Array.isArray(course_ids)) {
      throw new BadRequestError('user_id and course_ids array are required');
    }

    // Get all courses with time slots
    const courses = await prisma.courses.findMany({
      where: {
        id: { in: course_ids },
      },
      include: {
        timeSlots: true,
      },
    });

    // Get user's existing enrollments
    const existingEnrollments = await prisma.enrollments.findMany({
      where: {
        userId: user_id,
        status: EnrollmentStatus.CONFIRMED,
      },
      include: {
        course: {
          include: {
            timeSlots: true,
          },
        },
      },
    });

    const conflicts: any[] = [];

    // Check time conflicts
    for (const newCourse of courses) {
      for (const existingEnrollment of existingEnrollments) {
        for (const newSlot of newCourse.timeSlots) {
          for (const existingSlot of existingEnrollment.course.timeSlots) {
            // Check if same day and overlapping times
            if (newSlot.dayOfWeek === existingSlot.dayOfWeek) {
              const newStart = newSlot.startTime;
              const newEnd = newSlot.endTime;
              const existingStart = existingSlot.startTime;
              const existingEnd = existingSlot.endTime;

              if (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd) ||
                (newStart <= existingStart && newEnd >= existingEnd)
              ) {
                conflicts.push({
                  type: 'TIME_CONFLICT',
                  severity: 'HIGH',
                  newCourse: {
                    id: newCourse.id,
                    code: newCourse.courseCode,
                    name: newCourse.courseName,
                    timeSlot: `${newSlot.dayOfWeek} ${newSlot.startTime}-${newSlot.endTime}`,
                  },
                  conflictingCourse: {
                    id: existingEnrollment.course.id,
                    code: existingEnrollment.course.courseCode,
                    name: existingEnrollment.course.courseName,
                    timeSlot: `${existingSlot.dayOfWeek} ${existingSlot.startTime}-${existingSlot.endTime}`,
                  },
                  message: 'Schedule conflict detected',
                });
              }
            }
          }
        }
      }
    }

    // Check for duplicate enrollment
    for (const newCourse of courses) {
      for (const existingEnrollment of existingEnrollments) {
        if (newCourse.id === existingEnrollment.course.id) {
          conflicts.push({
            type: 'DUPLICATE_ENROLLMENT',
            severity: 'HIGH',
            courseId: newCourse.id,
            courseCode: newCourse.courseCode,
            message: 'Already enrolled in this course',
          });
        }
      }
    }

    // Check credit overload
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const existingCredits = existingEnrollments.reduce(
      (sum, e) => sum + e.course.credits,
      0
    );
    const newTotalCredits = totalCredits + existingCredits;

    if (newTotalCredits > 18) {
      conflicts.push({
        type: 'CREDIT_OVERLOAD',
        severity: 'MEDIUM',
        currentCredits: existingCredits,
        newCredits: totalCredits,
        totalCredits: newTotalCredits,
        limit: 18,
        message: `Total credits (${newTotalCredits}) exceeds limit of 18`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hasConflicts: conflicts.length > 0,
        conflicts,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * DEGREE AUDIT
 * ===================
 */

/**
 * Get degree audit for student
 * GET /api/admin/students/:id/degree-audit
 */
export const getDegreeAudit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
      include: {
        major: {
          include: {
            requirements: true,
          },
        },
        user: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.CONFIRMED,
              },
              include: {
                course: true,
                grade: {
                  where: {
                    status: GradeStatus.PUBLISHED,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    if (!student.major) {
      return res.status(200).json({
        success: true,
        data: {
          message: 'Student has no declared major',
          totalCreditsRequired: 120,
          totalCreditsEarned: 0,
          requirements: [],
        },
      });
    }

    // Calculate completed requirements
    const completedCourses = student.user.enrollments
      .filter((e) => e.grade && e.grade.letterGrade !== 'F' && e.grade.letterGrade !== 'W')
      .map((e) => ({
        courseCode: e.course.courseCode,
        courseName: e.course.courseName,
        credits: e.course.credits,
        grade: e.grade?.letterGrade,
        department: e.course.department,
      }));

    const totalCreditsEarned = completedCourses.reduce((sum, c) => sum + c.credits, 0);

    // Check each requirement
    const requirementStatus = student.major.requirements.map((req) => {
      const requiredCourses = (req.courses as any).courses || [];

      const completed = completedCourses.filter((course) =>
        requiredCourses.includes(course.courseCode)
      );

      const completedCredits = completed.reduce((sum, c) => sum + c.credits, 0);
      const isComplete = completedCredits >= req.credits;

      return {
        id: req.id,
        category: req.category,
        name: req.name,
        creditsRequired: req.credits,
        creditsCompleted: completedCredits,
        status: isComplete ? 'COMPLETE' : completedCredits > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
        completedCourses: completed,
        remainingCredits: Math.max(0, req.credits - completedCredits),
      };
    });

    // Calculate GPA
    const gradesWithPoints = completedCourses.filter((c) => c.grade && c.grade !== 'PA');
    let totalPoints = 0;
    let totalCreditHours = 0;

    gradesWithPoints.forEach((course) => {
      const grade = course.grade;
      let gradePoint = 0;

      // Convert letter grade to GPA
      switch (grade) {
        case 'A': gradePoint = 4.0; break;
        case 'A-': gradePoint = 3.7; break;
        case 'B+': gradePoint = 3.3; break;
        case 'B': gradePoint = 3.0; break;
        case 'B-': gradePoint = 2.7; break;
        case 'C+': gradePoint = 2.3; break;
        case 'C': gradePoint = 2.0; break;
        case 'C-': gradePoint = 1.7; break;
        case 'D+': gradePoint = 1.3; break;
        case 'D': gradePoint = 1.0; break;
        case 'D-': gradePoint = 0.7; break;
        case 'F': gradePoint = 0.0; break;
      }

      totalPoints += gradePoint * course.credits;
      totalCreditHours += course.credits;
    });

    const gpa = totalCreditHours > 0 ? totalPoints / totalCreditHours : 0;

    const meetsGPARequirement = gpa >= 2.0;
    const meetsCreditsRequirement = totalCreditsEarned >= student.major.totalCredits;
    const allRequirementsMet = requirementStatus.every((r) => r.status === 'COMPLETE');

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.user.fullName,
          studentId: student.studentId,
          major: student.major.name,
          expectedGraduation: student.expectedGrad,
        },
        summary: {
          totalCreditsRequired: student.major.totalCredits,
          totalCreditsEarned,
          creditsRemaining: Math.max(0, student.major.totalCredits - totalCreditsEarned),
          gpa: parseFloat(gpa.toFixed(3)),
          meetsGPARequirement,
          meetsCreditsRequirement,
          graduationEligible: meetsGPARequirement && meetsCreditsRequirement && allRequirementsMet,
        },
        requirements: requirementStatus,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * PROGRAM MANAGEMENT
 * ===================
 */

/**
 * Get all programs/majors
 * GET /api/admin/programs
 */
export const getPrograms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { department, degree } = req.query;

    const where: any = {};
    if (department) where.department = department as string;
    if (degree) where.degree = degree as any;

    const programs = await prisma.majors.findMany({
      where,
      include: {
        requirements: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform to match frontend expectations (camelCase)
    const transformedPrograms = programs.map((program: any) => ({
      id: program.id,
      code: program.code,
      name: program.name,
      department: program.department,
      degree: program.degree,
      totalCredits: program.totalCredits || program.total_credits,
      description: program.description,
      requirements: program.requirements?.map((req: any) => ({
        id: req.id,
        category: req.category,
        name: req.name,
        credits: req.credits,
        description: req.description,
      })),
      studentCount: program._count?.students || 0,
    }));

    res.status(200).json({
      success: true,
      data: transformedPrograms,
    });
  } catch (error: any) {
    console.error('Error in getPrograms:', error);
    // If it's a Prisma error, provide more details
    if (error.code) {
      console.error('Prisma error code:', error.code);
      console.error('Prisma error message:', error.message);
    }
    throw error;
  }
};

/**
 * Get program by ID
 * GET /api/admin/programs/:id
 */
export const getProgramById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const program = await prisma.majors.findUnique({
      where: { id: parseInt(id) },
      include: {
        requirements: true,
        students: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Create new program
 * POST /api/admin/programs
 */
export const createProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, name, department, degree, total_credits, description, requirements } = req.body;

    const existing = await prisma.majors.findUnique({
      where: { code },
    });

    if (existing) {
      throw new ConflictError('Program with this code already exists');
    }

    const program = await prisma.majors.create({
      data: {
        code,
        name,
        department,
        degree,
        totalCredits: total_credits,
        description,
        requirements: {
          create: requirements?.map((req: any) => ({
            category: req.category,
            name: req.name,
            credits: req.credits,
            courses: req.courses,
            description: req.description,
          })) || [],
        },
      },
      include: {
        requirements: true,
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'PROGRAM',
        entityId: program.id,
        changes: { created: program },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Program created successfully',
      data: program,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update program
 * PUT /api/admin/programs/:id
 */
export const updateProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, total_credits } = req.body;

    const program = await prisma.majors.findUnique({
      where: { id: parseInt(id) },
    });

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    const updateData: Prisma.MajorUpdateInput = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (total_credits !== undefined) updateData.totalCredits = total_credits;

    const updated = await prisma.majors.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        requirements: true,
      },
    });

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'PROGRAM',
        entityId: program.id,
        changes: { before: program, after: updated },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Program updated successfully',
      data: updated,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * BULK OPERATIONS
 * ===================
 */

/**
 * Bulk import students from CSV
 * POST /api/admin/students/import
 */
export const bulkImportStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      throw new BadRequestError('students array is required');
    }

    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    const bcrypt = require('bcryptjs');

    for (const studentData of students) {
      try {
        const {
          student_id,
          email,
          full_name,
          password,
          major_id,
          year,
          admission_date,
        } = studentData;

        // Check if exists
        const existing = await prisma.users.findFirst({
          where: {
            OR: [{ email }, { userIdentifier: student_id }],
          },
        });

        if (existing) {
          results.failed.push({
            studentId: student_id,
            email,
            reason: 'User already exists',
          });
          continue;
        }

        const passwordHash = await bcrypt.hash(password || 'Welcome123!', 10);

        const user = await prisma.users.create({
          data: {
            userIdentifier: student_id,
            email,
            passwordHash,
            fullName: full_name,
            role: 'STUDENT',
            student: {
              create: {
                studentId: student_id,
                majorId: major_id,
                year: year || 1,
                admissionDate: new Date(admission_date),
                status: StudentStatus.ACTIVE,
              },
            },
          },
          include: {
            student: true,
          },
        });

        results.success.push({
          id: user.id,
          studentId: student_id,
          email,
          fullName: full_name,
        });
      } catch (error: any) {
        results.failed.push({
          studentId: studentData.student_id,
          email: studentData.email,
          reason: error.message || 'Import failed',
        });
      }
    }

    // Log audit
    await prisma.audit_logs.create({
      data: {
        userId: req.user!.id,
        action: 'BULK_IMPORT',
        entityType: 'STUDENT',
        entityId: 0,
        changes: {
          total: students.length,
          success: results.success.length,
          failed: results.failed.length,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Imported ${results.success.length} students, ${results.failed.length} failed`,
      data: results,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Export students to CSV format
 * GET /api/admin/students/export
 */
export const exportStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, major, year } = req.query;

    const where: Prisma.StudentWhereInput = {};
    if (status) where.status = status as StudentStatus;
    if (year) where.year = parseInt(year as string);
    if (major) {
      where.major = {
        name: { contains: major as string, mode: 'insensitive' },
      };
    }

    const students = await prisma.students.findMany({
      where,
      include: {
        user: {
          select: {
            userIdentifier: true,
            email: true,
            fullName: true,
            createdAt: true,
          },
        },
        major: true,
      },
    });

    const csvData = students.map((s) => ({
      student_id: s.studentId,
      user_identifier: s.user.userIdentifier,
      full_name: s.user.fullName,
      email: s.user.email,
      major: s.major?.name || '',
      major_code: s.major?.code || '',
      year: s.year,
      status: s.status,
      admission_date: s.admissionDate.toISOString().split('T')[0],
      expected_graduation: s.expectedGrad?.toISOString().split('T')[0] || '',
      created_at: s.user.createdAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: csvData,
      metadata: {
        total: csvData.length,
        exportedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * EMAIL NOTIFICATIONS
 * ===================
 */

/**
 * Send email to students
 * POST /api/admin/emails/send
 */
export const sendEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipient_ids, subject, message, template } = req.body;

    if (!recipient_ids || !Array.isArray(recipient_ids) || recipient_ids.length === 0) {
      throw new BadRequestError('recipient_ids array is required');
    }

    if (!subject || !message) {
      throw new BadRequestError('subject and message are required');
    }

    // Get recipients
    const recipients = await prisma.user.findMany({
      where: {
        id: { in: recipient_ids },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll log the emails and store in database
    const emailLogs = await Promise.all(
      recipients.map(async (recipient) => {
        // TODO: Actual email sending logic here
        // await emailService.send({
        //   to: recipient.email,
        //   subject,
        //   body: message,
        // });

        return {
          recipientId: recipient.id,
          recipientEmail: recipient.email,
          recipientName: recipient.fullName,
          subject,
          message,
          template,
          status: 'QUEUED', // Would be SENT in production
          sentAt: new Date(),
        };
      })
    );

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'SEND_EMAIL',
        entityType: 'USER',
        entityId: 0,
        changes: {
          recipientCount: recipients.length,
          subject,
          template,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Email queued for ${recipients.length} recipients`,
      data: {
        sent: emailLogs.length,
        recipients: emailLogs,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Send bulk email to students by filter
 * POST /api/admin/emails/bulk
 */
export const sendBulkEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, major, year, subject, message, template } = req.body;

    if (!subject || !message) {
      throw new BadRequestError('subject and message are required');
    }

    // Build filter
    const where: Prisma.UserWhereInput = {};

    if (role) where.role = role as any;

    if (major || year) {
      where.student = {};
      if (year) where.student.year = parseInt(year);
      if (major) {
        where.student.major = {
          name: { contains: major, mode: 'insensitive' },
        };
      }
    }

    // Get recipients
    const recipients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (recipients.length === 0) {
      throw new BadRequestError('No recipients match the specified criteria');
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'SEND_BULK_EMAIL',
        entityType: 'USER',
        entityId: 0,
        changes: {
          recipientCount: recipients.length,
          subject,
          filters: { role, major, year },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Bulk email queued for ${recipients.length} recipients`,
      data: {
        recipientCount: recipients.length,
        filters: { role, major, year },
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * TRANSCRIPT GENERATION
 * ===================
 */

/**
 * Generate transcript for student
 * GET /api/admin/transcripts/:studentId/generate
 */
export const generateTranscript = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { format = 'json' } = req.query;

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id: parseInt(studentId) },
          { studentId: studentId },
        ],
      },
      include: {
        user: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.CONFIRMED,
              },
              include: {
                course: true,
                grade: {
                  where: {
                    status: GradeStatus.PUBLISHED,
                  },
                },
              },
              orderBy: [
                { course: { year: 'asc' } },
                { course: { semester: 'asc' } },
              ],
            },
            personalInfo: true,
          },
        },
        major: true,
        minor: true,
      },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Group courses by semester/year
    const transcriptData: any = {};

    student.user.enrollments.forEach((enrollment) => {
      const key = `${enrollment.course.year}-${enrollment.course.semester}`;

      if (!transcriptData[key]) {
        transcriptData[key] = {
          year: enrollment.course.year,
          semester: enrollment.course.semester,
          courses: [],
          semesterCredits: 0,
          semesterGPA: 0,
        };
      }

      const grade = enrollment.grade;
      transcriptData[key].courses.push({
        courseCode: enrollment.course.courseCode,
        courseName: enrollment.course.courseName,
        credits: enrollment.course.credits,
        grade: grade?.letterGrade || 'IP',
        gradePoints: grade?.gradePoints || 0,
      });

      if (grade) {
        transcriptData[key].semesterCredits += enrollment.course.credits;
      }
    });

    // Calculate semester GPAs
    Object.values(transcriptData).forEach((semester: any) => {
      if (semester.semesterCredits > 0) {
        const totalPoints = semester.courses.reduce(
          (sum: number, course: any) => sum + course.gradePoints * course.credits,
          0
        );
        semester.semesterGPA = parseFloat((totalPoints / semester.semesterCredits).toFixed(3));
      }
    });

    // Calculate cumulative GPA
    const allGrades = student.user.enrollments
      .filter((e) => e.grade && e.grade.status === GradeStatus.PUBLISHED)
      .map((e) => ({
        credits: e.course.credits,
        gradePoints: e.grade!.gradePoints || 0,
      }));

    const totalCredits = allGrades.reduce((sum, g) => sum + g.credits, 0);
    const totalPoints = allGrades.reduce((sum, g) => sum + g.gradePoints * g.credits, 0);
    const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    const transcript = {
      studentInfo: {
        studentId: student.studentId,
        fullName: student.user.fullName,
        email: student.user.email,
        major: student.major?.name,
        minor: student.minor?.name,
        admissionDate: student.admissionDate,
        expectedGraduation: student.expectedGrad,
        status: student.status,
      },
      academicRecord: Object.values(transcriptData),
      summary: {
        totalCreditsAttempted: student.user.enrollments.length * 3, // Estimate
        totalCreditsEarned: totalCredits,
        cumulativeGPA: parseFloat(cumulativeGPA.toFixed(3)),
      },
      generatedAt: new Date().toISOString(),
      generatedBy: req.user!.fullName,
      isOfficial: true,
    };

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'GENERATE_TRANSCRIPT',
        entityType: 'STUDENT',
        entityId: student.id,
        changes: { format, generatedAt: new Date() },
      },
    });

    // In production, generate PDF using a library like pdfmake
    if (format === 'pdf') {
      // TODO: Generate PDF
      // const pdfBuffer = await generatePDF(transcript);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', `attachment; filename="transcript-${student.studentId}.pdf"`);
      // return res.send(pdfBuffer);

      res.status(501).json({
        success: false,
        message: 'PDF generation not yet implemented. Use format=json instead.',
        data: transcript,
      });
    } else {
      res.status(200).json({
        success: true,
        data: transcript,
      });
    }
  } catch (error) {
    throw error;
  }
};

/**
 * ===================
 * ACADEMIC CALENDAR
 * ===================
 */

/**
 * Get all academic terms
 * GET /api/admin/calendar/terms
 */
export const getAcademicTerms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { year, active } = req.query;

    const where: any = {};
    if (year) where.year = parseInt(year as string);
    if (active === 'true') {
      const now = new Date();
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    // Since we don't have a Term model in the schema, return mock data
    // In production, add Term model to Prisma schema
    const mockTerms = [
      {
        id: 1,
        name: 'Fall 2024',
        semester: 'FALL',
        year: 2024,
        startDate: '2024-09-01',
        endDate: '2024-12-20',
        registrationStart: '2024-08-01',
        registrationEnd: '2024-08-31',
        addDropDeadline: '2024-09-15',
        withdrawalDeadline: '2024-11-15',
        isActive: false,
      },
      {
        id: 2,
        name: 'Spring 2025',
        semester: 'SPRING',
        year: 2025,
        startDate: '2025-01-15',
        endDate: '2025-05-30',
        registrationStart: '2024-12-01',
        registrationEnd: '2025-01-10',
        addDropDeadline: '2025-02-01',
        withdrawalDeadline: '2025-04-15',
        isActive: true,
      },
      {
        id: 3,
        name: 'Fall 2025',
        semester: 'FALL',
        year: 2025,
        startDate: '2025-09-01',
        endDate: '2025-12-20',
        registrationStart: '2025-08-01',
        registrationEnd: '2025-08-31',
        addDropDeadline: '2025-09-15',
        withdrawalDeadline: '2025-11-15',
        isActive: false,
      },
    ];

    let filteredTerms = mockTerms;

    if (year) {
      filteredTerms = filteredTerms.filter((t) => t.year === parseInt(year as string));
    }

    if (active === 'true') {
      filteredTerms = filteredTerms.filter((t) => t.isActive);
    }

    res.status(200).json({
      success: true,
      data: filteredTerms,
      message: 'Using mock data. Add Term model to Prisma schema for full functionality.',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Create academic term
 * POST /api/admin/calendar/terms
 */
export const createAcademicTerm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      semester,
      year,
      start_date,
      end_date,
      registration_start,
      registration_end,
      add_drop_deadline,
      withdrawal_deadline,
    } = req.body;

    // Mock response - in production, save to database
    const newTerm = {
      id: Math.floor(Math.random() * 1000),
      name,
      semester,
      year,
      startDate: start_date,
      endDate: end_date,
      registrationStart: registration_start,
      registrationEnd: registration_end,
      addDropDeadline: add_drop_deadline,
      withdrawalDeadline: withdrawal_deadline,
      isActive: false,
      createdAt: new Date(),
    };

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'TERM',
        entityId: newTerm.id,
        changes: { created: newTerm },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Academic term created (mock). Add Term model to Prisma schema for persistence.',
      data: newTerm,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update academic term
 * PUT /api/admin/calendar/terms/:id
 */
export const updateAcademicTerm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Mock response
    res.status(200).json({
      success: true,
      message: 'Academic term updated (mock). Add Term model to Prisma schema for persistence.',
      data: {
        id: parseInt(id),
        ...updates,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw error;
  }
};
