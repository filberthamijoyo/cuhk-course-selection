import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { EnrollmentStatus } from '@prisma/client';

type GraduationStatus = {
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'ON_TRACK' | 'AT_RISK';
};

/**
 * Get degree audit for the authenticated user
 */
export async function getDegreeAudit(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      include: {
        majors: {
          include: {
            requirements: true,
          },
        },
        users_students_user_idTousers: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.CONFIRMED,
              },
              include: {
                courses: true,
                grades: true,
              },
            },
          },
        },
      },
    });

    if (!student || !student.majors) {
      return res.json({
        success: true,
        data: {
          message: 'No major assigned',
          requirements: [],
          progress: {},
        },
      });
    }

    // Filter enrollments to only include those with published grades
    const enrollmentsWithPublishedGrades = student.users_students_user_idTousers.enrollments.filter(
      e => e.grades?.status === 'PUBLISHED'
    );

    // Calculate completed courses
    const completedCourses = enrollmentsWithPublishedGrades.map(e => e.courses.course_code);
    const totalCreditsEarned = enrollmentsWithPublishedGrades.reduce((sum, e) => sum + e.courses.credits, 0);

    // Check each requirement
    const requirementProgress = student.majors.requirements.map(req => {
      const reqCourses = req.courses as string[];
      const completed = completedCourses.filter(code => reqCourses.includes(code));

      return {
        category: req.category,
        name: req.name,
        requiredCredits: req.credits,
        completedCredits: completed.length * 3, // Assuming 3 credits per course
        courses: reqCourses,
        completedCourses: completed,
        percentage: (completed.length * 3 / req.credits) * 100,
      };
    });

    res.json({
      success: true,
      data: {
        major: {
          code: student.majors?.code,
          name: student.majors?.name,
          degree: student.majors?.degree,
          totalCredits: student.majors?.total_credits,
        },
        progress: {
          totalCreditsRequired: student.majors?.total_credits || 120,
          totalCreditsEarned,
          percentageComplete: (totalCreditsEarned / (student.majors?.total_credits || 120)) * 100,
        },
        requirements: requirementProgress,
      },
    });
    return;
  } catch (error) {
    console.error('Get degree audit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch degree audit',
    });
    return;
  }
}

/**
 * Get major requirements
 */
export async function getRequirements(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      include: {
        majors: {
          include: {
            requirements: true,
          },
        },
      },
    });

    if (!student || !student.majors) {
      return res.json({
        success: true,
        data: [],
        message: 'No major assigned',
      });
    }

    res.json({
      success: true,
      data: student.majors.requirements,
    });
    return;
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requirements',
    });
    return;
  }
}

/**
 * Get degree progress summary
 */
export async function getProgress(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      include: {
        majors: true,
        users_students_user_idTousers: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.CONFIRMED,
              },
              include: {
                courses: true,
                grades: true,
              },
            },
            transcripts: {
              orderBy: {
                generated_at: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Student record not found', 404);
    }

    // Filter enrollments to only include those with published grades
    const enrollmentsWithPublishedGrades = student.users_students_user_idTousers.enrollments.filter(
      e => e.grades?.status === 'PUBLISHED'
    );

    const totalCreditsEarned = enrollmentsWithPublishedGrades.reduce((sum, e) => sum + e.courses.credits, 0);

    // Calculate GPA from actual grades
    let totalQualityPoints = 0;
    let totalCreditsForGPA = 0;

    enrollmentsWithPublishedGrades.forEach(enrollment => {
      if (enrollment.grades?.grade_points !== null && enrollment.grades?.grade_points !== undefined) {
        const credits = enrollment.courses.credits || 0;
        totalQualityPoints += enrollment.grades.grade_points * credits;
        totalCreditsForGPA += credits;
      }
    });

    const currentGPA = totalCreditsForGPA > 0 ? totalQualityPoints / totalCreditsForGPA : 0;

    // Determine academic standing
    let academicStanding = 'N/A';
    if (currentGPA >= 3.5) academicStanding = 'Dean\'s List';
    else if (currentGPA >= 3.0) academicStanding = 'Good Standing';
    else if (currentGPA >= 2.0) academicStanding = 'Satisfactory';
    else if (currentGPA > 0) academicStanding = 'Academic Warning';

    const totalCreditsRequired = student.majors?.total_credits || 120;
    const majorName = student.majors?.name || 'Undeclared';

    res.json({
      success: true,
      data: {
        major: majorName,
        majorName: majorName,
        year: student.year,
        expectedGraduation: student.expected_grad,
        totalCreditsRequired: totalCreditsRequired,
        totalCreditsEarned,
        creditsRemaining: totalCreditsRequired - totalCreditsEarned,
        percentageComplete: (totalCreditsEarned / totalCreditsRequired) * 100,
        currentGPA: Math.round(currentGPA * 100) / 100,
        academicStanding: academicStanding,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Get progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch progress',
      });
    }
  }
}

/**
 * Evaluate graduation eligibility for the authenticated user
 */
export async function getGraduationEligibility(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      include: {
        majors: {
          include: {
            requirements: true,
          },
        },
        users_students_user_idTousers: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.CONFIRMED,
              },
              include: {
                courses: true,
                grades: true,
              },
            },
          },
        },
      },
    });

    if (!student || !student.majors) {
      return res.json({
        success: true,
        data: {
          eligible: false,
          status: 'NOT_ELIGIBLE',
          checklist: {
            coreComplete: false,
            majorRequiredComplete: false,
            majorElectiveComplete: false,
            freeElectiveComplete: false,
            totalCreditsComplete: false,
            gpaRequirement: false,
          },
          missing: {
            coreCredits: 0,
            majorRequiredCredits: 0,
            majorElectiveCredits: 0,
            freeElectiveCredits: 0,
            totalCredits: 120,
            gpaDeficit: 2,
          },
          summary: {
            totalRequired: 120,
            totalEarned: 0,
            currentGPA: 0,
            minimumGPA: 2,
          },
          estimatedGraduation: student?.expected_grad ?? 'TBD',
          actionItems: ['Declare a major to receive a full graduation audit'],
        },
      });
    }

    const enrollmentsWithPublishedGrades = student.users_students_user_idTousers.enrollments.filter(
      e => e.grades?.status === 'PUBLISHED'
    );

    const completedCourseCodes = new Set(
      enrollmentsWithPublishedGrades.map(e => e.courses.course_code)
    );
    const totalCreditsEarned = enrollmentsWithPublishedGrades.reduce((sum, e) => sum + (e.courses.credits || 0), 0);

    let totalQualityPoints = 0;
    let totalCreditsForGPA = 0;
    enrollmentsWithPublishedGrades.forEach(enrollment => {
      const credits = enrollment.courses.credits || 0;
      if (enrollment.grades?.grade_points !== null && enrollment.grades?.grade_points !== undefined) {
        totalQualityPoints += enrollment.grades.grade_points * credits;
        totalCreditsForGPA += credits;
      }
    });
    const currentGPA = totalCreditsForGPA > 0 ? totalQualityPoints / totalCreditsForGPA : 0;
    const minimumGPA = student.majors.minimum_gpa || 2.0;

    const bucketTemplate = { required: 0, earned: 0 };
    const buckets = {
      core: { ...bucketTemplate },
      majorRequired: { ...bucketTemplate },
      majorElective: { ...bucketTemplate },
      freeElective: { ...bucketTemplate },
    };

    student.majors.requirements.forEach(req => {
      const category = (req.category || '').toLowerCase();
      let bucketKey: keyof typeof buckets = 'majorRequired';
      if (category.includes('core')) bucketKey = 'core';
      else if (category.includes('elective') && category.includes('major')) bucketKey = 'majorElective';
      else if (category.includes('elective')) bucketKey = 'freeElective';

      const requiredCredits = req.credits || 0;
      buckets[bucketKey].required += requiredCredits;

      const reqCourses = (req.courses as string[]) || [];
      const completedForRequirement = reqCourses.filter(code => completedCourseCodes.has(code));
      const earnedCredits = Math.min(completedForRequirement.length * 3, requiredCredits);
      buckets[bucketKey].earned += earnedCredits;
    });

    const checklist = {
      coreComplete: buckets.core.earned >= buckets.core.required && buckets.core.required > 0,
      majorRequiredComplete:
        buckets.majorRequired.earned >= buckets.majorRequired.required && buckets.majorRequired.required > 0,
      majorElectiveComplete:
        buckets.majorElective.earned >= buckets.majorElective.required && buckets.majorElective.required > 0,
      freeElectiveComplete:
        buckets.freeElective.earned >= buckets.freeElective.required && buckets.freeElective.required > 0,
      totalCreditsComplete: totalCreditsEarned >= (student.majors.total_credits || 120),
      gpaRequirement: currentGPA >= minimumGPA,
    };

    const missing = {
      coreCredits: Math.max(buckets.core.required - buckets.core.earned, 0),
      majorRequiredCredits: Math.max(buckets.majorRequired.required - buckets.majorRequired.earned, 0),
      majorElectiveCredits: Math.max(buckets.majorElective.required - buckets.majorElective.earned, 0),
      freeElectiveCredits: Math.max(buckets.freeElective.required - buckets.freeElective.earned, 0),
      totalCredits: Math.max((student.majors.total_credits || 120) - totalCreditsEarned, 0),
      gpaDeficit: Math.max(minimumGPA - currentGPA, 0),
    };

    const eligible = Object.values(checklist).every(Boolean);
    let status: GraduationStatus['status'] = 'NOT_ELIGIBLE';
    if (eligible) status = 'ELIGIBLE';
    else if (checklist.totalCreditsComplete && checklist.gpaRequirement) status = 'ON_TRACK';
    else if (totalCreditsEarned / (student.majors.total_credits || 120) >= 0.75) status = 'AT_RISK';

    const actionItems: string[] = [];
    if (!checklist.coreComplete && missing.coreCredits > 0) {
      actionItems.push(`Complete ${missing.coreCredits} additional core credits`);
    }
    if (!checklist.majorRequiredComplete && missing.majorRequiredCredits > 0) {
      actionItems.push(`Complete ${missing.majorRequiredCredits} remaining major-required credits`);
    }
    if (!checklist.majorElectiveComplete && missing.majorElectiveCredits > 0) {
      actionItems.push(`Add ${missing.majorElectiveCredits} major elective credits to your plan`);
    }
    if (!checklist.freeElectiveComplete && missing.freeElectiveCredits > 0) {
      actionItems.push(`Fulfill ${missing.freeElectiveCredits} free elective credits`);
    }
    if (!checklist.totalCreditsComplete && missing.totalCredits > 0) {
      actionItems.push(`Earn ${missing.totalCredits} more total credits`);
    }
    if (!checklist.gpaRequirement && missing.gpaDeficit > 0) {
      actionItems.push(`Improve GPA by ${missing.gpaDeficit.toFixed(2)} to reach ${minimumGPA.toFixed(2)}`);
    }

    res.json({
      success: true,
      data: {
        eligible,
        status,
        checklist,
        missing,
        summary: {
          totalRequired: student.majors.total_credits || 120,
          totalEarned: totalCreditsEarned,
          currentGPA: Math.round(currentGPA * 100) / 100,
          minimumGPA,
        },
        estimatedGraduation: student.expected_grad || 'TBD',
        actionItems,
      },
    });
  } catch (error) {
    console.error('Get graduation eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate graduation eligibility',
    });
  }
}

/**
 * Get advisor information
 */
export async function getAdvisor(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const student = await prisma.students.findUnique({
      where: { user_id: userId },
      include: {
        users_students_advisor_idTousers: {
          select: {
            id: true,
            full_name: true,
            email: true,
            faculty: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Student record not found', 404);
    }

    if (!student.users_students_advisor_idTousers) {
      return res.json({
        success: true,
        data: null,
        message: 'No advisor assigned',
      });
    }

    res.json({
      success: true,
      data: {
        name: student.users_students_advisor_idTousers.full_name,
        email: student.users_students_advisor_idTousers.email,
        department: student.users_students_advisor_idTousers.faculty?.department,
        office: student.users_students_advisor_idTousers.faculty?.office,
        officeHours: student.users_students_advisor_idTousers.faculty?.office_hours,
        title: student.users_students_advisor_idTousers.faculty?.title,
      },
    });
    return;
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    } else {
      console.error('Get advisor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch advisor information',
      });
      return;
    }
  }
}

/**
 * Get course plan (placeholder for future implementation)
 */
export async function getCoursePlan(_req: AuthRequest, res: Response) {
  try {
    // This would retrieve a saved course plan
    // For now, return empty
    res.json({
      success: true,
      data: {
        message: 'Course planning feature coming soon',
        savedPlans: [],
      },
    });
  } catch (error) {
    console.error('Get course plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course plan',
    });
  }
}

/**
 * Save course plan (placeholder for future implementation)
 */
export async function saveCoursePlan(_req: AuthRequest, res: Response) {
  try {
    // This would save a course plan
    // For now, just acknowledge
    res.json({
      success: true,
      message: 'Course plan saved (feature coming soon)',
    });
  } catch (error) {
    console.error('Save course plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save course plan',
    });
  }
}
