# Student Information System (SIS)

A comprehensive, full-stack Student Information System designed for managing all aspects of university academic operations, including course enrollment, grade management, student applications, academic calendars, and administrative workflows.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Frontend Routes](#frontend-routes)
- [User Roles & Permissions](#user-roles--permissions)
- [Configuration](#configuration)
- [Scripts & Utilities](#scripts--utilities)
- [Contributing](#contributing)

---

## Overview

The Student Information System (SIS) is a production-ready web application that provides a complete solution for university management. It handles course selection, enrollment processing with queue management, grade submission and approval workflows, student applications (major/minor declarations, withdrawals, suspensions), academic calendar management, financial tracking, and comprehensive reporting.

**Key Highlights:**
- **Role-Based Access Control**: Three user roles (Student, Instructor, Administrator) with tailored dashboards and permissions
- **Real-Time Enrollment Queue**: Uses Redis and Bull for handling concurrent course enrollment requests
- **Comprehensive Academic Management**: Grades, transcripts, GPA calculations, course evaluations
- **Application Workflows**: Support for 9+ types of student applications with approval processes
- **Responsive UI**: Modern React interface with dark mode support and mobile-responsive design
- **Docker Support**: Containerized architecture for easy deployment

---

## Features

### For Students
- **Course Management**
  - Browse and search courses by code, name, department, or instructor
  - View detailed course information (syllabus, schedule, capacity, prerequisites)
  - Add/drop courses with real-time availability checking
  - Shopping cart functionality for planning course schedules
  - Visual class schedule with conflict detection

- **Enrollment**
  - Normal add/drop during enrollment periods
  - Late add/drop request submission with approval workflow
  - Waitlist management with automatic promotion
  - Real-time enrollment status tracking
  - Term information and important dates

- **Academic Records**
  - View grades with letter grades and GPA
  - Grade analytics and trends visualization
  - Official transcript generation (PDF)
  - Semester and cumulative GPA tracking
  - Academic standing monitoring

- **Applications**
  - Declare Major/Minor/Second Major
  - Change major with supporting documentation
  - Exchange and visiting student programs
  - Leave of absence, suspension, withdrawal requests
  - Application status tracking and history

- **Personal Management**
  - Update contact and emergency information
  - View and manage academic calendar
  - Exam schedules with locations
  - Course evaluations and feedback
  - Campus events and announcements

### For Instructors
- **Course Teaching**
  - View assigned courses and enrolled students
  - Access class rosters with student details
  - Monitor course capacity and waitlist

- **Grade Management**
  - Submit grades for enrolled students
  - Edit and update grades before approval
  - View grade submission history
  - Export grade reports

- **Student Interaction**
  - View student academic records
  - Manage attendance tracking
  - Upload course materials and resources

### For Administrators
- **User Management**
  - Create, edit, and delete user accounts (students, instructors, admins)
  - Manage student records and personal information
  - Assign roles and permissions
  - Bulk import/export users

- **Course Management**
  - Create and configure courses
  - Assign instructors to courses
  - Set enrollment capacities and prerequisites
  - Manage course schedules and time slots
  - Import courses from JSON data

- **Program Management**
  - Configure academic programs and majors
  - Define degree requirements
  - Manage program catalogs

- **Approval Workflows**
  - Review and approve enrollment requests
  - Grade approval and publishing
  - Application review (major changes, withdrawals, etc.)
  - Late add/drop approvals

- **Reporting & Analytics**
  - Enrollment statistics and trends
  - Grade distribution reports
  - Student performance analytics
  - Application processing metrics
  - Audit logs and activity tracking

- **System Configuration**
  - Academic calendar management
  - Term and semester setup
  - Financial rules and charges
  - Announcements and alerts

---

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma
- **Cache & Queue**: Redis + Bull
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Rate Limiting**: express-rate-limit
- **PDF Generation**: PDFKit

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Headless UI
- **HTTP Client**: Axios
- **Icons**: Lucide React

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Hosting**: Supabase (PostgreSQL)
- **Cache**: Redis (containerized)
- **Deployment**: Docker-based multi-service architecture

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm
- **Version Control**: Git

---

## Project Structure

```
Student-Information-System/
├── backend/                      # Backend API server
│   ├── database/                 # Database migration files
│   ├── prisma/
│   │   └── schema.prisma         # Prisma database schema
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── database.ts       # PostgreSQL connection config
│   │   │   ├── prisma.ts         # Prisma client setup
│   │   │   ├── queue.ts          # Bull queue configuration
│   │   │   └── redis.ts          # Redis connection config
│   │   ├── controllers/          # Request handlers (14 controllers)
│   │   │   ├── academicCalendarController.ts
│   │   │   ├── academicController.ts
│   │   │   ├── addDropController.ts
│   │   │   ├── adminController.ts
│   │   │   ├── applicationController.ts
│   │   │   ├── authController.ts
│   │   │   ├── campusController.ts
│   │   │   ├── courseController.ts
│   │   │   ├── courseEvaluationController.ts
│   │   │   ├── enrollmentController.ts
│   │   │   ├── facultyController.ts
│   │   │   ├── instructorController.ts
│   │   │   ├── majorChangeController.ts
│   │   │   └── personalController.ts
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts           # JWT authentication
│   │   │   ├── errorHandler.ts   # Global error handling
│   │   │   └── rateLimiter.ts    # API rate limiting
│   │   ├── routes/               # API route definitions (14 route files)
│   │   │   ├── academicCalendarRoutes.ts
│   │   │   ├── academicRoutes.ts
│   │   │   ├── addDropRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   ├── applicationRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── campusRoutes.ts
│   │   │   ├── courseEvaluationRoutes.ts
│   │   │   ├── courseRoutes.ts
│   │   │   ├── enrollmentRoutes.ts
│   │   │   ├── facultyRoutes.ts
│   │   │   ├── instructorRoutes.ts
│   │   │   └── majorChangeRoutes.ts
│   │   ├── scripts/              # Utility scripts
│   │   │   ├── clearEnrollments.ts
│   │   │   ├── clearStuckJobs.ts
│   │   │   ├── fixExamLocation.ts
│   │   │   ├── populateCoursesFromJSON.ts
│   │   │   └── populateExamSchedules.ts
│   │   ├── services/             # Business logic services
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── api.types.ts
│   │   │   ├── course.types.ts
│   │   │   ├── enrollment.types.ts
│   │   │   ├── express.types.ts
│   │   │   └── user.types.ts
│   │   ├── utils/                # Helper utilities
│   │   ├── workers/              # Background job processors
│   │   │   └── enrollmentWorker.ts  # Enrollment queue worker
│   │   └── server.ts             # Main application entry point
│   ├── Dockerfile                # Backend Docker configuration
│   └── package.json              # Backend dependencies
│
├── frontend/                     # React frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Images, icons, etc.
│   │   ├── components/           # React components
│   │   │   ├── admin/            # Admin-specific components
│   │   │   │   ├── ApplicationReviewQueue.tsx
│   │   │   │   ├── CreateStudentModal.tsx
│   │   │   │   ├── EditStudentModal.tsx
│   │   │   │   ├── EditStudentPersonalInfoModal.tsx
│   │   │   │   ├── EnrollmentApprovalQueue.tsx
│   │   │   │   └── GradeApprovalQueue.tsx
│   │   │   ├── layout/           # Layout components
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── Schedule/         # Schedule-related components
│   │   │   │   └── constants.ts
│   │   │   ├── ui/               # Reusable UI components
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── AcademicAlerts.tsx
│   │   │   ├── AcademicCalendar.tsx
│   │   │   ├── AddDropCourse.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseEvaluation.tsx
│   │   │   ├── CourseEvaluationList.tsx
│   │   │   ├── FileAttachment.tsx
│   │   │   └── MajorChangeRequest.tsx
│   │   ├── context/              # React context providers
│   │   │   └── AuthContext.tsx   # Authentication context
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx  # Dark mode theme context
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility libraries
│   │   │   └── utils.ts
│   │   ├── pages/                # Page components (45+ pages)
│   │   │   ├── admin/            # Admin pages
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ApplicationApprovals.tsx
│   │   │   │   ├── CourseManagement.tsx
│   │   │   │   ├── EnrollmentApprovals.tsx
│   │   │   │   ├── EnrollmentManagement.tsx
│   │   │   │   ├── GradeApprovals.tsx
│   │   │   │   ├── ProgramManagement.tsx
│   │   │   │   ├── Reports.tsx
│   │   │   │   └── UserManagement.tsx
│   │   │   ├── AcademicCalendarPage.tsx
│   │   │   ├── AddDropPage.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── Applications.tsx
│   │   │   ├── ApplicationsLanding.tsx
│   │   │   ├── CampusInfo.tsx
│   │   │   ├── ClassSchedule.tsx
│   │   │   ├── CourseDetails.tsx
│   │   │   ├── CourseList.tsx
│   │   │   ├── CourseSearch.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DeclareMajor.tsx
│   │   │   ├── DeclareMinor.tsx
│   │   │   ├── DeclareSecondMajor.tsx
│   │   │   ├── EnrollmentsLanding.tsx
│   │   │   ├── EvaluationsPage.tsx
│   │   │   ├── ExamSchedules.tsx
│   │   │   ├── ExchangeVisiting.tsx
│   │   │   ├── FacultyDashboard.tsx
│   │   │   ├── GradeAnalytics.tsx
│   │   │   ├── GradeSubmission.tsx
│   │   │   ├── LateCourseAddDrop.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MajorChangePage.tsx
│   │   │   ├── MyCourses.tsx
│   │   │   ├── MyEnrollments.tsx
│   │   │   ├── MyGrades.tsx
│   │   │   ├── NormalAddition.tsx
│   │   │   ├── PersonalInfo.tsx
│   │   │   ├── ResumptionOfStudy.tsx
│   │   │   ├── ShoppingCart.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── Suspension.tsx
│   │   │   ├── TermInformation.tsx
│   │   │   ├── Transcript.tsx
│   │   │   └── Withdrawal.tsx
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript types
│   │   │   ├── academic.ts
│   │   │   └── index.ts
│   │   ├── utils/                # Helper functions
│   │   ├── App.css               # Global styles
│   │   ├── App.tsx               # Root component
│   │   └── index.css             # Tailwind imports
│   ├── eslint.config.js          # ESLint configuration
│   ├── package.json              # Frontend dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── vite.config.ts            # Vite build configuration
│
├── prisma/                       # Database seeding
│   └── seed.ts                   # Database seed script
│
├── .dockerignore                 # Docker ignore rules
├── .gitignore                    # Git ignore rules
├── docker-compose.yml            # Docker Compose orchestration
├── package.json                  # Root package.json
└── README.md                     # This file
```

---

## Database Schema

The system uses **PostgreSQL** with **Prisma ORM** for type-safe database access. The schema includes 30+ tables organized into the following domains:

### Core Tables

#### Users & Authentication
- **users**: Main user table with authentication credentials
- **students**: Student-specific data (student ID, major, advisor, status)
- **faculty**: Faculty-specific data (employee ID, department, office hours)
- **personal_info**: Contact information, emergency contacts, demographics

#### Academic Management
- **courses**: Course catalog with codes, names, credits, capacity
- **time_slots**: Class schedules (day, time, location)
- **exam_schedules**: Exam dates, times, and locations
- **enrollments**: Student course enrollments with status tracking
- **grades**: Grade records with approval workflow
- **transcripts**: Semester and cumulative academic records
- **majors**: Academic programs and degree requirements
- **requirements**: Major/minor course requirements

#### Applications & Workflows
- **applications**: Student applications (9 types supported)
- **course_add_drop_requests**: Late add/drop requests with approvals
- **major_change_requests**: Major change applications with GPA tracking

#### Campus Information
- **academic_events**: Academic calendar events
- **announcements**: System-wide announcements with targeting
- **events**: Campus events (academic, cultural, sports, etc.)
- **course_evaluations**: Student feedback and course ratings
- **attendance**: Class attendance tracking

#### Financial
- **financial_accounts**: Student account balances
- **charges**: Tuition, fees, and other charges
- **payments**: Payment processing and history

#### System
- **audit_logs**: Comprehensive activity logging
- **enrollment_rules**: System-wide enrollment constraints
- **Term**: Academic term configuration

### Key Enums
- **Role**: STUDENT, INSTRUCTOR, ADMINISTRATOR
- **Semester**: FALL, SPRING, SUMMER
- **EnrollmentStatus**: PENDING, CONFIRMED, WAITLISTED, DROPPED, REJECTED
- **GradeStatus**: IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED
- **StudentStatus**: ACTIVE, LEAVE_OF_ABSENCE, WITHDRAWN, SUSPENDED, GRADUATED
- **ApplicationType**: LEAVE_OF_ABSENCE, WITHDRAWAL, MAJOR_CHANGE, MINOR_DECLARATION, etc.

### Database Features
- Foreign key constraints for referential integrity
- Indexes on frequently queried columns
- Unique constraints for business rules
- Cascading deletes where appropriate
- Default values and timestamps
- Check constraints for data validation

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm v9+
- **Docker** and Docker Compose (recommended)
- **PostgreSQL** database (or use Supabase)
- **Redis** server

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/filberthamijoyo/Student-Information-System.git
cd Student-Information-System
```

#### 2. Install Dependencies

**Root dependencies:**
```bash
npm install
```

**Backend dependencies:**
```bash
cd backend
npm install
```

**Frontend dependencies:**
```bash
cd frontend
npm install
```

#### 3. Environment Configuration

**Backend (.env in /backend):**
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=course_selection
DB_USER=postgres
DB_PASSWORD=your_password
DB_MAX_CONNECTIONS=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h

# Server
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Business Rules
MAX_CREDITS_PER_SEMESTER=18
MAX_COURSES_PER_SEMESTER=7
```

**Frontend (.env in /frontend):**
```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Database Setup

**Using Prisma:**
```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

#### 5. Running the Application

**Option A: Using Docker Compose (Recommended)**
```bash
# From root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Services will be available at:
# - Backend API: http://localhost:5000
# - Frontend: http://localhost:5173
# - Redis: localhost:6379
```

**Option B: Manual Startup**

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 3 - Enrollment Worker:**
```bash
cd backend
npm run worker
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

#### 6. Access the Application

Navigate to `http://localhost:5173` in your browser.

**Default Login Credentials** (from seed data):
- **Admin**: admin@cuhk.edu.hk / password123
- **Instructor**: instructor@cuhk.edu.hk / password123
- **Student**: student@cuhk.edu.hk / password123

---

## API Endpoints

The backend API is organized into the following route groups:

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile

### Courses (`/api/courses`)
- `GET /` - List all courses (with filters)
- `GET /:id` - Get course details
- `POST /` - Create course (admin)
- `PUT /:id` - Update course (admin)
- `DELETE /:id` - Delete course (admin)
- `GET /:id/enrollments` - Get course enrollments
- `GET /:id/time-slots` - Get course schedule

### Enrollments (`/api/enrollments`)
- `GET /` - List user enrollments
- `POST /` - Enroll in course
- `DELETE /:id` - Drop course
- `GET /status/:courseId` - Check enrollment status
- `POST /waitlist/:courseId` - Join waitlist
- `GET /queue/status` - Get queue status

### Academic (`/api/academic`)
- `GET /grades` - Get student grades
- `GET /transcript` - Get transcript
- `GET /transcript/pdf` - Download transcript PDF
- `GET /gpa` - Get GPA summary
- `GET /analytics` - Get grade analytics

### Applications (`/api/applications`)
- `GET /` - List user applications
- `POST /` - Submit application
- `GET /:id` - Get application details
- `PUT /:id` - Update application
- `DELETE /:id` - Cancel application

### Add/Drop (`/api/add-drop`)
- `GET /requests` - List add/drop requests
- `POST /requests` - Submit add/drop request
- `PUT /requests/:id` - Update request status

### Academic Calendar (`/api/academic-calendar`)
- `GET /events` - List calendar events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (admin)

### Campus (`/api/campus`)
- `GET /announcements` - Get announcements
- `GET /events` - Get campus events
- `POST /announcements` - Create announcement (admin)

### Course Evaluation (`/api/course-evaluation`)
- `GET /` - List evaluations
- `POST /` - Submit course evaluation
- `GET /course/:courseId` - Get course evaluations

### Faculty (`/api/faculty`)
- `GET /` - List faculty members
- `GET /:id` - Get faculty profile
- `PUT /:id` - Update faculty profile

### Personal (`/api/personal`)
- `GET /` - Get personal information
- `PUT /` - Update personal information

### Major Change (`/api/major-change`)
- `GET /requests` - List major change requests
- `POST /requests` - Submit major change request
- `PUT /requests/:id` - Update request status

### Admin (`/api/admin`)
- **User Management**
  - `GET /users` - List all users
  - `POST /users` - Create user
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user

- **Course Management**
  - `GET /courses` - Manage all courses
  - `POST /courses/import` - Bulk import courses

- **Enrollment Management**
  - `GET /enrollments` - View all enrollments
  - `PUT /enrollments/:id/approve` - Approve enrollment
  - `PUT /enrollments/:id/reject` - Reject enrollment

- **Grade Management**
  - `GET /grades/pending` - Pending grade approvals
  - `PUT /grades/:id/approve` - Approve grade
  - `PUT /grades/:id/reject` - Reject grade

- **Application Management**
  - `GET /applications/pending` - Pending applications
  - `PUT /applications/:id/approve` - Approve application
  - `PUT /applications/:id/reject` - Reject application

- **Reports**
  - `GET /reports/enrollment` - Enrollment statistics
  - `GET /reports/grades` - Grade distribution
  - `GET /reports/applications` - Application metrics

### Instructor (`/api/instructor`)
- `GET /courses` - List assigned courses
- `GET /courses/:id/students` - Get course roster
- `POST /grades` - Submit grades
- `PUT /grades/:id` - Update grade
- `GET /attendance/:courseId` - Get attendance records
- `POST /attendance` - Mark attendance

---

## Frontend Routes

The frontend uses React Router with protected routes based on user roles:

### Public Routes
- `/login` - Login page

### Student Routes
- `/` - Student dashboard (default)
- `/course-search` - Search and browse courses
- `/my-courses` - Enrolled courses
- `/courses/:courseId` - Course details
- `/cart` - Shopping cart
- `/enrollments` - Enrollment management hub
- `/enrollments/add` - Add courses
- `/enrollments/drop` - Drop courses
- `/enrollments/term-information` - Term details
- `/enrollments/exam-schedules` - Exam schedule
- `/enrollments/class-schedule` - Visual weekly schedule
- `/academic/grades` - View grades
- `/academic/transcript` - View transcript
- `/academic/analytics` - Grade analytics
- `/personal` - Personal information
- `/applications` - Applications hub
- `/applications/my-applications` - Application history
- `/applications/students-record/declare-major` - Declare major
- `/applications/students-record/declare-minor` - Declare minor
- `/applications/students-record/declare-second-major` - Second major
- `/applications/students-record/change-major` - Change major
- `/applications/students-record/exchange-visiting` - Exchange program
- `/applications/students-record/resumption-of-study` - Resumption
- `/applications/students-record/suspension` - Suspension
- `/applications/students-record/withdrawal` - Withdrawal
- `/applications/normal-addition` - Normal course addition
- `/applications/late-course-add-drop` - Late add/drop
- `/campus` - Campus information
- `/academic-calendar` - Academic calendar
- `/evaluations` - Course evaluations

### Instructor Routes
- `/faculty` - Faculty dashboard (default)
- `/faculty/courses` - Teaching courses
- `/faculty/courses/:courseId/grades` - Grade submission

### Administrator Routes
- `/admin` - Admin dashboard (default)
- `/admin/users` - User management
- `/admin/courses` - Course management
- `/admin/programs` - Program management
- `/admin/enrollments` - Enrollment management
- `/admin/enrollments/approvals` - Enrollment approvals
- `/admin/grades/approvals` - Grade approvals
- `/admin/applications` - Application approvals
- `/admin/reports` - Reports and analytics

---

## User Roles & Permissions

### Student
**Can:**
- Browse and search courses
- Enroll in courses (subject to prerequisites and capacity)
- Drop enrolled courses
- View grades and transcript
- Submit applications (major change, withdrawal, etc.)
- View personal information
- Submit course evaluations
- View academic calendar and exam schedules

**Cannot:**
- Access admin functions
- Submit grades
- Approve requests
- Manage other users

### Instructor
**Can:**
- View assigned courses
- Access course rosters
- Submit and update grades
- Mark attendance
- Upload course materials
- View student academic records (for enrolled students)

**Cannot:**
- Approve grades (requires admin)
- Manage courses (create/delete)
- Access admin functions
- Enroll in courses

### Administrator
**Can:**
- All student and instructor permissions
- Create, edit, delete users
- Manage courses and programs
- Approve/reject enrollments
- Approve/reject grades
- Review and approve applications
- Generate system reports
- Manage academic calendar
- Configure system settings
- View audit logs

**Full System Access**

---

## Configuration

### Backend Configuration

**Docker Compose Variables** (`docker-compose.yml`):
- Database connection settings
- Redis configuration
- JWT secret and expiry
- CORS origins
- Rate limiting parameters
- Business rules (max credits, max courses)

**Prisma Configuration** (`backend/prisma/schema.prisma`):
- Database provider and connection
- Schema models and relationships
- Indexes and constraints

### Frontend Configuration

**Vite Configuration** (`frontend/vite.config.ts`):
- Dev server settings
- Build optimizations
- Plugin configuration

**Tailwind Configuration** (`frontend/tailwind.config.js`):
- Color scheme (including CUHK maroon primary color)
- Custom animations
- Typography settings
- Dark mode support

---

## Scripts & Utilities

### Backend Scripts

**Database Management:**
```bash
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run db:push            # Push schema changes
npm run db:seed            # Seed database
npm run prisma:studio      # Open Prisma Studio GUI
```

**Development:**
```bash
npm run dev                # Start dev server with hot reload
npm run worker             # Start enrollment queue worker
npm run build              # Build for production
npm start                  # Run production server
```

**Utility Scripts:**
```bash
npm run queue:clear        # Clear stuck queue jobs
npm run fix:exam-location  # Fix exam location data
```

### Frontend Scripts

```bash
npm run dev                # Start Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run ESLint
```

### Docker Commands

```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose ps              # List running services
docker-compose restart backend # Restart backend service
```

---

## Key Features Explained

### Enrollment Queue System

The system uses **Bull** (backed by Redis) to handle concurrent enrollment requests fairly:

1. Student submits enrollment request
2. Request is added to Redis queue
3. Background worker processes requests FIFO
4. Checks prerequisites, capacity, conflicts
5. Updates enrollment status
6. Notifies student of result

This prevents race conditions and ensures fair processing during high-traffic enrollment periods.

### Grade Approval Workflow

Grades go through a multi-stage approval process:

1. **IN_PROGRESS**: Instructor can edit
2. **SUBMITTED**: Instructor submits, awaiting approval
3. **APPROVED**: Admin approves, ready to publish
4. **PUBLISHED**: Visible to students

This ensures quality control and prevents accidental grade publication.

### Application Processing

Students can submit 9 types of applications:
- Leave of Absence
- Withdrawal
- Major Change
- Minor Declaration
- Credit Transfer
- Overload Request (>18 credits)
- Grade Appeal
- Readmission
- Graduation Application

Each application:
- Supports file attachments
- Tracks review history
- Includes approval workflow
- Logs all status changes

### Audit Logging

Every important action is logged to `audit_logs`:
- User ID and IP address
- Action type (CREATE, UPDATE, DELETE)
- Entity type and ID
- Before/after changes (JSON)
- Timestamp

This provides complete accountability and troubleshooting capability.

---

## Security Features

- **JWT Authentication**: Secure token-based auth with configurable expiry
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse (configurable per endpoint)
- **CORS Protection**: Whitelist-based origin validation
- **Input Validation**: Joi schemas for all API inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: React's built-in escaping
- **Role-Based Access Control**: Middleware-enforced permissions

---

## Performance Optimizations

- **Redis Caching**: Frequently accessed data cached in Redis
- **Database Indexing**: Strategic indexes on query patterns
- **Connection Pooling**: PostgreSQL connection pool (max 20)
- **React Query**: Client-side caching with 5-minute stale time
- **Lazy Loading**: Code splitting for routes
- **Optimistic Updates**: UI updates before server confirmation
- **Debounced Search**: Reduces API calls during typing

---

## Contributing

This project was developed as a comprehensive database management system for academic institutions. Contributions, issues, and feature requests are welcome.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Built for CUHK (Chinese University of Hong Kong) course management
- Inspired by modern SIS platforms like Banner, PeopleSoft, and Workday
- Uses open-source technologies and best practices from the web development community

---

## Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub.

**Project Repository**: https://github.com/filberthamijoyo/Student-Information-System

---

**Last Updated**: November 2025
**Version**: 2.0.0
