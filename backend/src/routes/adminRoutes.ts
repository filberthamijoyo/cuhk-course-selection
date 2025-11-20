import { Router } from 'express';
import {
  // Course Management
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseEnrollments,
  // Student Management
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  // Enrollment Management
  getEnrollments,
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment,
  bulkApproveEnrollments,
  dropEnrollment,
  createEnrollment,
  // Grade Management
  getPendingGrades,
  approveGrade,
  bulkApproveGrades,
  publishGrades,
  // User Management
  getAllUsers,
  // Statistics
  getSystemStatistics,
  getEnrollmentStatistics,
  getGradeStatistics,
  getAdminReports,
  // Waitlist Management
  getCourseWaitlist,
  promoteFromWaitlist,
  // Conflict Detection
  checkConflicts,
  // Degree Audit
  getDegreeAudit,
  // Program Management
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  // Bulk Operations
  bulkImportStudents,
  exportStudents,
  // Email Notifications
  sendEmail,
  sendBulkEmail,
  // Transcript Generation
  generateTranscript,
  // Academic Calendar
  getAcademicTerms,
  createAcademicTerm,
  updateAcademicTerm,
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);
router.use(adminLimiter);

/**
 * ================
 * COURSE MANAGEMENT
 * ================
 */

/**
 * @route   POST /api/admin/courses
 * @desc    Create a new course
 * @access  Private (Admin)
 */
router.post('/courses', asyncHandler(createCourse));

/**
 * @route   PUT /api/admin/courses/:id
 * @desc    Update course
 * @access  Private (Admin)
 */
router.put('/courses/:id', asyncHandler(updateCourse));

/**
 * @route   DELETE /api/admin/courses/:id
 * @desc    Delete course
 * @access  Private (Admin)
 */
router.delete('/courses/:id', asyncHandler(deleteCourse));

/**
 * @route   GET /api/admin/courses/:id/enrollments
 * @desc    Get all enrollments for a specific course
 * @access  Private (Admin)
 */
router.get('/courses/:id/enrollments', asyncHandler(getCourseEnrollments));

/**
 * ================
 * STUDENT MANAGEMENT
 * ================
 */

/**
 * @route   GET /api/admin/students
 * @desc    Get all students with filters
 * @access  Private (Admin)
 */
router.get('/students', asyncHandler(getStudents));

/**
 * @route   GET /api/admin/students/:id
 * @desc    Get student by ID with full details
 * @access  Private (Admin)
 */
router.get('/students/:id', asyncHandler(getStudentById));

/**
 * @route   POST /api/admin/students
 * @desc    Create a new student
 * @access  Private (Admin)
 */
router.post('/students', asyncHandler(createStudent));

/**
 * @route   PUT /api/admin/students/:id
 * @desc    Update student information
 * @access  Private (Admin)
 */
router.put('/students/:id', asyncHandler(updateStudent));

/**
 * @route   PUT /api/admin/students/:id/status
 * @desc    Update student status
 * @access  Private (Admin)
 */
router.put('/students/:id/status', asyncHandler(updateStudentStatus));

/**
 * @route   DELETE /api/admin/students/:id
 * @desc    Delete (soft delete) student
 * @access  Private (Admin)
 */
router.delete('/students/:id', asyncHandler(deleteStudent));

/**
 * ================
 * ENROLLMENT MANAGEMENT
 * ================
 */

/**
 * @route   GET /api/admin/enrollments
 * @desc    Get all enrollments with filters
 * @access  Private (Admin)
 */
router.get('/enrollments', asyncHandler(getEnrollments));

/**
 * @route   GET /api/admin/enrollments/pending
 * @desc    Get pending enrollment approvals
 * @access  Private (Admin)
 */
router.get('/enrollments/pending', asyncHandler(getPendingEnrollments));

/**
 * @route   POST /api/admin/enrollments
 * @desc    Create manual enrollment
 * @access  Private (Admin)
 */
router.post('/enrollments', asyncHandler(createEnrollment));

/**
 * @route   POST /api/admin/enrollments/:id/approve
 * @desc    Approve enrollment
 * @access  Private (Admin)
 */
router.post('/enrollments/:id/approve', asyncHandler(approveEnrollment));

/**
 * @route   POST /api/admin/enrollments/:id/reject
 * @desc    Reject enrollment
 * @access  Private (Admin)
 */
router.post('/enrollments/:id/reject', asyncHandler(rejectEnrollment));

/**
 * @route   POST /api/admin/enrollments/bulk-approve
 * @desc    Bulk approve enrollments
 * @access  Private (Admin)
 */
router.post('/enrollments/bulk-approve', asyncHandler(bulkApproveEnrollments));

/**
 * @route   DELETE /api/admin/enrollments/:id
 * @desc    Drop student from course
 * @access  Private (Admin)
 */
router.delete('/enrollments/:id', asyncHandler(dropEnrollment));

/**
 * ================
 * GRADE MANAGEMENT
 * ================
 */

/**
 * @route   GET /api/admin/grades/pending
 * @desc    Get pending grade approvals
 * @access  Private (Admin)
 */
router.get('/grades/pending', asyncHandler(getPendingGrades));

/**
 * @route   POST /api/admin/grades/:id/approve
 * @desc    Approve grade
 * @access  Private (Admin)
 */
router.post('/grades/:id/approve', asyncHandler(approveGrade));

/**
 * @route   POST /api/admin/grades/bulk-approve
 * @desc    Bulk approve grades
 * @access  Private (Admin)
 */
router.post('/grades/bulk-approve', asyncHandler(bulkApproveGrades));

/**
 * @route   POST /api/admin/grades/publish
 * @desc    Publish grades
 * @access  Private (Admin)
 */
router.post('/grades/publish', asyncHandler(publishGrades));

/**
 * ================
 * USER MANAGEMENT
 * ================
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with optional role filter
 * @access  Private (Admin)
 */
router.get('/users', asyncHandler(getAllUsers));

/**
 * ================
 * STATISTICS & ANALYTICS
 * ================
 */

/**
 * @route   GET /api/admin/statistics
 * @desc    Get system statistics
 * @access  Private (Admin)
 */
router.get('/statistics', asyncHandler(getSystemStatistics));

/**
 * @route   GET /api/admin/statistics/enrollments
 * @desc    Get enrollment statistics
 * @access  Private (Admin)
 */
router.get('/statistics/enrollments', asyncHandler(getEnrollmentStatistics));

/**
 * @route   GET /api/admin/statistics/grades
 * @desc    Get grade distribution statistics
 * @access  Private (Admin)
 */
router.get('/statistics/grades', asyncHandler(getGradeStatistics));

/**
 * @route   GET /api/admin/reports
 * @desc    Get aggregated analytics reports
 * @access  Private (Admin)
 */
router.get('/reports', asyncHandler(getAdminReports));

/**
 * ================
 * WAITLIST MANAGEMENT
 * ================
 */

/**
 * @route   GET /api/admin/courses/:id/waitlist
 * @desc    Get course waitlist
 * @access  Private (Admin)
 */
router.get('/courses/:id/waitlist', asyncHandler(getCourseWaitlist));

/**
 * @route   POST /api/admin/enrollments/:id/promote
 * @desc    Promote student from waitlist
 * @access  Private (Admin)
 */
router.post('/enrollments/:id/promote', asyncHandler(promoteFromWaitlist));

/**
 * ================
 * CONFLICT DETECTION
 * ================
 */

/**
 * @route   POST /api/admin/conflicts/check
 * @desc    Check for schedule and enrollment conflicts
 * @access  Private (Admin)
 */
router.post('/conflicts/check', asyncHandler(checkConflicts));

/**
 * ================
 * DEGREE AUDIT
 * ================
 */

/**
 * @route   GET /api/admin/students/:id/degree-audit
 * @desc    Get degree audit for student
 * @access  Private (Admin)
 */
router.get('/students/:id/degree-audit', asyncHandler(getDegreeAudit));

/**
 * ================
 * PROGRAM MANAGEMENT
 * ================
 */

/**
 * @route   GET /api/admin/programs
 * @desc    Get all programs/majors
 * @access  Private (Admin)
 */
router.get('/programs', asyncHandler(getPrograms));

/**
 * @route   GET /api/admin/programs/:id
 * @desc    Get program by ID
 * @access  Private (Admin)
 */
router.get('/programs/:id', asyncHandler(getProgramById));

/**
 * @route   POST /api/admin/programs
 * @desc    Create new program
 * @access  Private (Admin)
 */
router.post('/programs', asyncHandler(createProgram));

/**
 * @route   PUT /api/admin/programs/:id
 * @desc    Update program
 * @access  Private (Admin)
 */
router.put('/programs/:id', asyncHandler(updateProgram));

/**
 * ================
 * BULK OPERATIONS
 * ================
 */

/**
 * @route   POST /api/admin/students/import
 * @desc    Bulk import students from CSV
 * @access  Private (Admin)
 */
router.post('/students/import', asyncHandler(bulkImportStudents));

/**
 * @route   GET /api/admin/students/export
 * @desc    Export students to CSV
 * @access  Private (Admin)
 */
router.get('/students/export', asyncHandler(exportStudents));

/**
 * ================
 * EMAIL NOTIFICATIONS
 * ================
 */

/**
 * @route   POST /api/admin/emails/send
 * @desc    Send email to specific students
 * @access  Private (Admin)
 */
router.post('/emails/send', asyncHandler(sendEmail));

/**
 * @route   POST /api/admin/emails/bulk
 * @desc    Send bulk email to students by filter
 * @access  Private (Admin)
 */
router.post('/emails/bulk', asyncHandler(sendBulkEmail));

/**
 * ================
 * TRANSCRIPT GENERATION
 * ================
 */

/**
 * @route   GET /api/admin/transcripts/:studentId/generate
 * @desc    Generate transcript for student
 * @access  Private (Admin)
 */
router.get('/transcripts/:studentId/generate', asyncHandler(generateTranscript));

/**
 * ================
 * ACADEMIC CALENDAR
 * ================
 */

/**
 * @route   GET /api/admin/calendar/terms
 * @desc    Get all academic terms
 * @access  Private (Admin)
 */
router.get('/calendar/terms', asyncHandler(getAcademicTerms));

/**
 * @route   POST /api/admin/calendar/terms
 * @desc    Create academic term
 * @access  Private (Admin)
 */
router.post('/calendar/terms', asyncHandler(createAcademicTerm));

/**
 * @route   PUT /api/admin/calendar/terms/:id
 * @desc    Update academic term
 * @access  Private (Admin)
 */
router.put('/calendar/terms/:id', asyncHandler(updateAcademicTerm));

export default router;
