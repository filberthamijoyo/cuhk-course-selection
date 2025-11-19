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
    const existing = await prisma.course.findFirst({
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
    const course = await prisma.course.create({
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

    const course = await prisma.course.update({
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
    const enrollmentCount = await prisma.enrollment.count({
      where: {
        courseId: parseInt(id),
        status: EnrollmentStatus.CONFIRMED,
      },
    });

    if (enrollmentCount > 0) {
      throw new BadRequestError('Cannot delete course with active enrollments');
    }

    // Soft delete by updating status
    await prisma.course.update({
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

    const enrollments = await prisma.enrollment.findMany({
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
      prisma.student.findMany({
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
      prisma.student.count({ where }),
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

    const student = await prisma.student.findUnique({
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
    const grades = await prisma.grade.findMany({
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
    const existingUser = await prisma.user.findFirst({
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
    await prisma.auditLog.create({
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

    const student = await prisma.student.findUnique({
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

    const updatedStudent = await prisma.student.update({
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
    await prisma.auditLog.create({
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

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // If status is WITHDRAWN, drop all active enrollments
    if (status === StudentStatus.WITHDRAWN) {
      await prisma.enrollment.updateMany({
        where: {
          userId: student.userId,
          status: EnrollmentStatus.CONFIRMED,
        },
        data: {
          status: EnrollmentStatus.DROPPED,
        },
      });
    }

    const updatedStudent = await prisma.student.update({
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
    await prisma.auditLog.create({
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

    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Update status to withdrawn instead of deleting
    await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        status: StudentStatus.WITHDRAWN,
      },
    });

    // Log audit
    await prisma.auditLog.create({
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
      prisma.enrollment.findMany({
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
      prisma.enrollment.count({ where }),
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
    const enrollments = await prisma.enrollment.findMany({
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

    const enrollment = await prisma.enrollment.findUnique({
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
    await prisma.auditLog.create({
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

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.PENDING) {
      throw new BadRequestError('Enrollment is not in pending status');
    }

    const updatedEnrollment = await prisma.enrollment.update({
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
    await prisma.auditLog.create({
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
        const enrollment = await prisma.enrollment.findUnique({
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
    await prisma.auditLog.create({
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

    const enrollment = await prisma.enrollment.findUnique({
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
    await prisma.auditLog.create({
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
    const existing = await prisma.enrollment.findUnique({
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

    const course = await prisma.course.findUnique({
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
    await prisma.auditLog.create({
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
    const grades = await prisma.grade.findMany({
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

    const grade = await prisma.grade.findUnique({
      where: { id: parseInt(id) },
    });

    if (!grade) {
      throw new NotFoundError('Grade not found');
    }

    if (grade.status !== GradeStatus.SUBMITTED) {
      throw new BadRequestError('Grade is not in submitted status');
    }

    const updatedGrade = await prisma.grade.update({
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
    await prisma.auditLog.create({
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

    const updated = await prisma.grade.updateMany({
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
    await prisma.auditLog.create({
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

    const updated = await prisma.grade.updateMany({
      where,
      data: {
        status: GradeStatus.PUBLISHED,
      },
    });

    // Log audit
    await prisma.auditLog.create({
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
      prisma.user.findMany({
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
          student: {
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
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      metadata: {
        page: Number(page),
        perPage: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
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
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.user.count({ where: { role: 'ADMINISTRATOR' } }),
      prisma.course.count(),
      prisma.course.count({ where: { status: CourseStatus.ACTIVE } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: EnrollmentStatus.CONFIRMED } }),
      prisma.enrollment.count({ where: { status: EnrollmentStatus.WAITLISTED } }),
      prisma.enrollment.count({ where: { status: EnrollmentStatus.PENDING } }),
      prisma.grade.count({ where: { status: GradeStatus.SUBMITTED } }),
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

    const enrollments = await prisma.enrollment.groupBy({
      by: ['courseId'],
      where,
      _count: true,
    });

    const courseIds = enrollments.map((e) => e.courseId);
    const courses = await prisma.course.findMany({
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

    const grades = await prisma.grade.groupBy({
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
