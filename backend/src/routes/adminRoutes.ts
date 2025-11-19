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

export default router;
