import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';

/**
 * Get all grades for the authenticated user
 */
export async function getMyGrades(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const enrollments = await prisma.enrollments.findMany({
      where: { user_id: userId },
      include: {
        courses: {
          select: {
            course_code: true,
            course_name: true,
            credits: true,
            semester: true,
            year: true,
          }
        },
        grades: true,
      },
      orderBy: [
        { enrolled_at: 'desc' },
      ],
    });

    const gradesData = enrollments.map(e => ({
      enrollmentId: e.id,
      semester: e.courses.semester || null,
      year: e.courses.year || null,
      courseCode: e.courses.course_code,
      courseName: e.courses.course_name,
      credits: e.courses.credits,
      letterGrade: e.grades?.letter_grade || 'IP',
      numericGrade: e.grades?.numeric_grade,
      gradePoints: e.grades?.grade_points,
      status: e.grades?.status || 'IN_PROGRESS',
    }));

    res.json({
      success: true,
      data: gradesData,
    });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
    });
  }
}

/**
 * Get grades for a specific term
 */
export async function getGradesByTerm(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { semester, year } = req.query;

    if (!semester || !year) {
      throw new AppError('Semester and year are required', 400);
    }

    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        courses: {
          semester: semester as any,
          year: parseInt(year as string),
        }
      },
      include: {
        courses: {
          select: {
            course_code: true,
            course_name: true,
            credits: true,
          }
        },
        grades: true,
      },
    });

    const gradesData = enrollments.map(e => ({
      courseCode: e.courses.course_code,
      courseName: e.courses.course_name,
      credits: e.courses.credits,
      letterGrade: e.grades?.letter_grade || 'IP',
      numericGrade: e.grades?.numeric_grade,
      gradePoints: e.grades?.grade_points,
    }));

    res.json({
      success: true,
      data: gradesData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Get grades by term error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch grades',
      });
    }
  }
}

/**
 * Get grade for a specific course
 */
export async function getCourseGrade(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { courseId } = req.params;

    const enrollment = await prisma.enrollments.findFirst({
      where: {
        user_id: userId,
        course_id: parseInt(courseId),
      },
      include: {
        courses: {
          select: {
            course_code: true,
            course_name: true,
            credits: true,
            semester: true,
            year: true,
          }
        },
        grades: true,
      },
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    res.json({
      success: true,
      data: {
        courseCode: enrollment.courses.course_code,
        courseName: enrollment.courses.course_name,
        credits: enrollment.courses.credits,
        semester: enrollment.courses.semester || null,
        year: enrollment.courses.year || null,
        letterGrade: enrollment.grades?.letter_grade || 'IP',
        numericGrade: enrollment.grades?.numeric_grade,
        gradePoints: enrollment.grades?.grade_points,
        status: enrollment.grades?.status || 'IN_PROGRESS',
        comments: enrollment.grades?.comments,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Get course grade error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch grade',
      });
    }
  }
}

/**
 * Get complete transcript for the authenticated user
 */
export async function getTranscript(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    // Get all transcripts
    const transcripts = await prisma.transcripts.findMany({
      where: { user_id: userId },
      orderBy: [
        { year: 'asc' },
        { semester: 'asc' },
      ],
    });

    // Get all graded enrollments
    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        grades: {
          status: 'PUBLISHED'
        },
      },
      include: {
        courses: true,
        grades: true,
      },
      orderBy: [
        { courses: { year: 'asc' } },
        { courses: { semester: 'asc' } },
      ],
    });

    // Group enrollments by term
    const enrollmentsByTerm = enrollments.reduce((acc, e) => {
      const year = e.courses.year || new Date().getFullYear();
      const semester = e.courses.semester || 'UNKNOWN';
      const key = `${year}-${semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        courseCode: e.courses.course_code,
        courseName: e.courses.course_name,
        credits: e.courses.credits,
        grade: e.grades?.letter_grade,
        gradePoints: e.grades?.grade_points,
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate cumulative GPA
    const latestTranscript = transcripts.length > 0
      ? transcripts[transcripts.length - 1]
      : null;

    const totalCredits = enrollments.reduce((sum, e) => sum + e.courses.credits, 0);

    res.json({
      success: true,
      data: {
        transcripts: transcripts.map(t => ({
          semester: t.semester || null,
          year: t.year || null,
          termGPA: t.term_gpa,
          cumulativeGPA: t.gpa,
          totalCredits: t.total_credits,
          earnedCredits: t.earned_credits,
          academicStanding: t.academic_standing,
        })),
        enrollmentsByTerm,
        summary: {
          cumulativeGPA: latestTranscript?.gpa || 0,
          totalCredits,
          earnedCredits: totalCredits,
          academicStanding: latestTranscript?.academicStanding || 'N/A',
        },
      },
    });
  } catch (error) {
    console.error('Get transcript error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transcript',
    });
  }
}

/**
 * Get unofficial transcript (same as transcript but marked as unofficial)
 */
export async function getUnofficialTranscript(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    // Get user info
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        students_students_user_idTousers: {
          include: {
            majors: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const student = user.students_students_user_idTousers;

    // Get transcripts
    const transcripts = await prisma.transcripts.findMany({
      where: { user_id: userId },
      orderBy: [
        { year: 'asc' },
        { semester: 'asc' },
      ],
    });

    // Get all enrollments with grades
    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        grades: {
          isNot: null,
        },
      },
      include: {
        courses: true,
        grades: true,
      },
      orderBy: [
        { courses: { year: 'asc' } },
        { courses: { semester: 'asc' } },
      ],
    });

    res.json({
      success: true,
      data: {
        isOfficial: false,
        student: {
          fullName: user.full_name,
          studentId: student?.student_id,
          email: user.email,
          major: student?.majors?.name,
          expectedGraduation: student?.expected_grad,
        },
        transcripts,
        courses: enrollments.map(e => ({
          semester: e.courses.semester || null,
          year: e.courses.year || null,
          courseCode: e.courses.course_code,
          courseName: e.courses.course_name,
          credits: e.courses.credits,
          letterGrade: e.grades?.letter_grade,
          numericGrade: e.grades?.numeric_grade,
          gradePoints: e.grades?.grade_points,
        })),
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error('Get unofficial transcript error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transcript',
      });
    }
  }
}

/**
 * Generate PDF transcript
 */
export async function generateTranscriptPDF(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const PDFDocument = require('pdfkit');

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        students_students_user_idTousers: {
          include: {
            majors: true,
          },
        },
      },
    });

    if (!user || !user.students_students_user_idTousers) {
      throw new AppError('Student record not found', 404);
    }

    const student = user.students_students_user_idTousers;

    // Get all grades grouped by term
    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        grades: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      include: {
        courses: true,
        grades: {
          where: {
            status: 'PUBLISHED',
          },
        },
      },
      orderBy: [
        { courses: { year: 'asc' } },
        { courses: { semester: 'asc' } },
      ],
    });

    // Calculate GPA
    let totalCredits = 0;
    let totalQualityPoints = 0;

    enrollments.forEach((enrollment) => {
      if (enrollment.grades && enrollment.grades.length > 0) {
        const grade = enrollment.grades[0];
        totalCredits += enrollment.courses.credits;
        totalQualityPoints += grade.grade_points * enrollment.courses.credits;
      }
    });

    const cumulativeGPA = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '0.00';

    // Create PDF document
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transcript_${user.user_identifier}_${new Date().toISOString().split('T')[0]}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('OFFICIAL ACADEMIC TRANSCRIPT', { align: 'center' });
    doc.fontSize(16).text('The Chinese University of Hong Kong, Shenzhen', { align: 'center' });
    doc.moveDown();

    // Student Information
    doc.fontSize(12).text('STUDENT INFORMATION', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Name: ${user.full_name}`);
    doc.text(`Student ID: ${user.user_identifier}`);
    doc.text(`Email: ${user.email}`);
    if (student.majors) {
      doc.text(`Major: ${student.majors.major_name}`);
    }
    doc.text(`Year Level: ${student.year_level || 'N/A'}`);
    doc.moveDown();

    // Academic Summary
    doc.fontSize(12).text('ACADEMIC SUMMARY', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Cumulative GPA: ${cumulativeGPA}`);
    doc.text(`Total Credits Earned: ${totalCredits}`);
    doc.moveDown();

    // Group courses by term
    const coursesByTerm: Record<string, any[]> = {};
    enrollments.forEach((enrollment) => {
      const termKey = `${enrollment.courses.semester} ${enrollment.courses.year}`;
      if (!coursesByTerm[termKey]) {
        coursesByTerm[termKey] = [];
      }
      coursesByTerm[termKey].push(enrollment);
    });

    // Course History
    doc.fontSize(12).text('COURSE HISTORY', { underline: true });
    doc.moveDown(0.5);

    Object.entries(coursesByTerm).forEach(([term, courses]) => {
      doc.fontSize(11).text(term, { underline: true });
      doc.moveDown(0.3);

      // Table header
      doc.fontSize(9);
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 140;
      const col3 = 370;
      const col4 = 430;
      const col5 = 490;

      doc.text('Course Code', col1, tableTop);
      doc.text('Course Name', col2, tableTop);
      doc.text('Credits', col3, tableTop);
      doc.text('Grade', col4, tableTop);
      doc.text('Points', col5, tableTop);

      doc.moveDown(0.5);

      // Draw line under header
      doc.moveTo(col1, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.3);

      let termCredits = 0;
      let termPoints = 0;

      courses.forEach((enrollment) => {
        const course = enrollment.courses;
        const grade = enrollment.grades[0];
        const currentY = doc.y;

        doc.text(course.course_code, col1, currentY);
        doc.text(course.course_name.substring(0, 30), col2, currentY);
        doc.text(course.credits.toString(), col3, currentY);
        doc.text(grade.letter_grade, col4, currentY);
        doc.text(grade.grade_points.toFixed(2), col5, currentY);

        termCredits += course.credits;
        termPoints += grade.grade_points * course.credits;

        doc.moveDown(0.8);
      });

      // Term summary
      const termGPA = termCredits > 0 ? (termPoints / termCredits).toFixed(2) : '0.00';
      doc.moveDown(0.3);
      doc.fontSize(10);
      doc.text(`Term Credits: ${termCredits} | Term GPA: ${termGPA}`, { align: 'right' });
      doc.moveDown();
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.text('This is an official transcript', { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Generate transcript PDF error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate PDF',
      });
    }
  }
}

/**
 * Get GPA information
 */
export async function getGPA(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    // Calculate GPA directly from grades
    const enrollmentsWithGrades = await prisma.enrollments.findMany({
      where: {
        user_id: userId,
        grades: {
          status: 'PUBLISHED',
          grade_points: {
            not: null
          }
        }
      },
      include: {
        grades: true,
        courses: {
          select: {
            credits: true,
          }
        }
      },
    });

    let totalQualityPoints = 0;
    let totalCredits = 0;

    enrollmentsWithGrades.forEach(enrollment => {
      if (enrollment.grades?.grade_points !== null && enrollment.grades?.grade_points !== undefined) {
        const credits = enrollment.courses.credits || 0;
        totalQualityPoints += enrollment.grades.grade_points * credits;
        totalCredits += credits;
      }
    });

    const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    // Determine academic standing
    let academicStanding = 'N/A';
    if (cumulativeGPA >= 3.5) academicStanding = 'Dean\'s List';
    else if (cumulativeGPA >= 3.0) academicStanding = 'Good Standing';
    else if (cumulativeGPA >= 2.0) academicStanding = 'Satisfactory';
    else if (cumulativeGPA > 0) academicStanding = 'Academic Warning';

    res.json({
      success: true,
      data: {
        cumulativeGPA: Math.round(cumulativeGPA * 100) / 100,
        totalCredits: totalCredits,
        earnedCredits: totalCredits,
        academicStanding: academicStanding,
        qualityPoints: Math.round(totalQualityPoints * 100) / 100,
      },
    });
  } catch (error: any) {
    console.error('Get GPA error:', error);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      meta: error.meta,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GPA',
      error: error.message || 'Unknown error',
    });
  }
}

/**
 * Get GPA history over multiple terms
 */
export async function getGPAHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const transcripts = await prisma.transcripts.findMany({
      where: { user_id: userId },
      orderBy: [
        { year: 'asc' },
        { semester: 'asc' },
      ],
      select: {
        term_gpa: true,
        gpa: true,
        total_credits: true,
        academic_standing: true,
        semester: true,
        year: true,
      },
    });

    res.json({
      success: true,
      data: transcripts.map(t => {
        const semester = t.semester || null;
        const year = t.year || null;
        return {
          term: semester && year ? `${semester} ${year}` : 'Unknown',
          semester,
          year,
          termGPA: t.term_gpa,
          cumulativeGPA: t.gpa,
          totalCredits: t.total_credits,
          academicStanding: t.academic_standing,
        };
      }),
    });
  } catch (error) {
    console.error('Get GPA history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GPA history',
    });
  }
}
