# 📋 Product Requirements Document (PRD)

## Admin Portal - Student Information System

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [System Modules](#5-system-modules)
6. [API Specifications](#6-api-specifications)
7. [Data Models](#7-data-models)
8. [User Workflows](#8-user-workflows)
9. [Security & Permissions](#9-security--permissions)
10. [Reporting & Analytics](#10-reporting--analytics)
11. [Integration Requirements](#11-integration-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Success Metrics](#13-success-metrics)

---

# 1. Executive Summary

## 1.1 Purpose
The Admin Portal is a comprehensive management system that enables administrators to oversee, control, and manage all aspects of the CUHK-SZ Student Information System. It provides centralized control over students, courses, enrollments, grades, schedules, and academic operations.

## 1.2 Goals
- **Efficiency**: Reduce administrative overhead by 60% through automation
- **Accuracy**: Eliminate manual errors through validation and conflict detection
- **Transparency**: Provide complete audit trails and real-time monitoring
- **Scalability**: Support 10,000+ students and 2,000+ courses per semester
- **Compliance**: Ensure data integrity and regulatory compliance

## 1.3 Key Features
- Comprehensive student lifecycle management
- Course catalog and schedule management
- Enrollment workflow automation
- Grade entry, approval, and publishing
- Real-time analytics and reporting
- Bulk operations and batch processing
- Multi-level permission system
- Complete audit logging

---

# 2. Product Overview

## 2.1 Product Vision
A unified, intelligent administrative platform that empowers academic administrators to manage the entire student lifecycle efficiently while maintaining data integrity, academic standards, and institutional policies.

## 2.2 Target Users
- **Super Administrators**: Full system access
- **Academic Affairs Officers**: Student records, enrollment, grades
- **Registrar Staff**: Transcript management, graduation audits
- **Department Administrators**: Department-specific course and student management
- **Faculty Coordinators**: Course management, grade entry oversight
- **IT Administrators**: System configuration, user management

## 2.3 System Scope

### In Scope
- Student information management (CRUD)
- Course catalog and offerings management
- Enrollment processing and approval workflows
- Grade management and approval
- Schedule building and conflict resolution
- Academic calendar management
- Waitlist management
- Transcript generation
- Graduation audit
- Reporting and analytics
- Bulk operations
- Audit logging
- Permission management
- Data import/export

### Out of Scope (Phase 1)
- Financial aid management
- Housing management
- Library system integration
- Learning Management System (LMS)
- Student portal features
- Parent portal
- Alumni management

---

# 3. User Personas

## 3.1 Super Administrator (Dr. Chen Wei)
**Role**: Director of Academic Affairs  
**Responsibilities**: 
- Overall system oversight
- Policy implementation
- User management
- System configuration
- Crisis management

**Pain Points**:
- Need real-time visibility into all operations
- Manual processes take too much time
- Difficulty tracking changes and accountability
- Limited reporting capabilities

**Needs**:
- Dashboard with key metrics
- Quick access to critical alerts
- Comprehensive audit trails
- Flexible reporting tools

---

## 3.2 Academic Affairs Officer (Ms. Liu Ming)
**Role**: Student Records Manager  
**Responsibilities**:
- Student enrollment management
- Grade approval and publishing
- Transcript generation
- Academic standing monitoring

**Pain Points**:
- Manual enrollment approvals are time-consuming
- Difficulty detecting schedule conflicts
- No automated alerts for issues
- Repetitive data entry tasks

**Needs**:
- Bulk approval capabilities
- Automated conflict detection
- Real-time notifications
- Efficient data entry tools

---

## 3.3 Registrar (Mr. Zhang Hua)
**Role**: University Registrar  
**Responsibilities**:
- Graduation audits
- Official transcript issuance
- Academic policy enforcement
- Data integrity oversight

**Pain Points**:
- Manual graduation checks are error-prone
- Transcript generation is slow
- Difficulty tracking degree requirements
- Limited historical data access

**Needs**:
- Automated graduation audit tools
- Fast transcript generation
- Degree requirement tracking
- Comprehensive historical records

---

## 3.4 Department Administrator (Prof. Wang Jing)
**Role**: Computer Science Department Head  
**Responsibilities**:
- Department course scheduling
- Faculty workload management
- Student performance monitoring
- Curriculum oversight

**Pain Points**:
- No visibility into department-wide metrics
- Manual schedule coordination
- Difficulty tracking student progress
- Limited faculty performance data

**Needs**:
- Department-specific dashboards
- Schedule builder with constraints
- Student cohort analytics
- Faculty workload reports

---

# 4. Functional Requirements

## 4.1 Student Management

### 4.1.1 Student Record Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SM-001**: Create new student records with all required information
- **FR-SM-002**: Update existing student information (personal, academic, contact)
- **FR-SM-003**: View complete student profiles with academic history
- **FR-SM-004**: Delete or archive student records (with confirmation)
- **FR-SM-005**: Search students by multiple criteria (ID, name, email, major, year, status)
- **FR-SM-006**: Filter students by major, year level, status, college, admission year
- **FR-SM-007**: Sort student lists by any column
- **FR-SM-008**: Bulk import students from CSV/Excel files
- **FR-SM-009**: Export student lists to CSV/Excel/PDF
- **FR-SM-010**: View student change history (audit log)

**User Stories**:
```
As an admin, I want to search for students by partial name match
So that I can quickly find student records even with incomplete information

As an admin, I want to import 500+ new students from a CSV file
So that I can efficiently process bulk admissions

As an admin, I want to see who modified a student record and when
So that I can maintain accountability and track changes
```

**Acceptance Criteria**:
- Search returns results within 2 seconds for 10,000+ students
- CSV import processes 1,000 records in under 60 seconds
- All changes are logged with timestamp, user, and old/new values
- Bulk operations show progress indicator

---

### 4.1.2 Student Status Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SM-011**: Change student status (Active, On Leave, Withdrawn, Suspended, Graduated)
- **FR-SM-012**: Set effective dates for status changes
- **FR-SM-013**: Require reason/notes for status changes
- **FR-SM-014**: Automatically trigger related actions (e.g., drop courses on withdrawal)
- **FR-SM-015**: Send notifications to student on status change
- **FR-SM-016**: View status change history
- **FR-SM-017**: Bulk status updates with validation

**Business Rules**:
- Students on leave cannot enroll in courses
- Withdrawn students are automatically dropped from all courses
- Suspended students cannot access any services
- Status changes require admin approval based on type

---

### 4.1.3 Academic Information Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SM-018**: Assign/change student major
- **FR-SM-019**: Assign/change student minor
- **FR-SM-020**: Update year level (automatic and manual)
- **FR-SM-021**: Assign college/residential college
- **FR-SM-022**: Set expected graduation date
- **FR-SM-023**: Track academic standing (Good Standing, Probation, Dismissal)
- **FR-SM-024**: Calculate and display GPA (cumulative, major, term)
- **FR-SM-025**: Track total credits earned
- **FR-SM-026**: View degree audit/requirement checklist
- **FR-SM-027**: Generate graduation eligibility report

**Calculations**:
- Cumulative GPA: All graded courses
- Major GPA: Major required + major elective courses only
- Term GPA: Courses in specific term
- Credits earned: Sum of passed courses (exclude W, F, IP)

---

### 4.1.4 Student Communications
**Priority**: P1 (High)

**Requirements**:
- **FR-SM-028**: Send email to individual student
- **FR-SM-029**: Send bulk emails to filtered student groups
- **FR-SM-030**: Email templates for common scenarios
- **FR-SM-031**: Schedule emails for future delivery
- **FR-SM-032**: Track email delivery status
- **FR-SM-033**: SMS notifications for urgent matters
- **FR-SM-034**: In-system notifications/announcements

**Use Cases**:
- Registration reminders
- Grade publication notices
- Academic warning notifications
- Policy updates
- Emergency alerts

---

## 4.2 Course Management

### 4.2.1 Course Catalog Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-CM-001**: Create new course entries in catalog
- **FR-CM-002**: Update course information (name, description, credits, category)
- **FR-CM-003**: Set course prerequisites and corequisites
- **FR-CM-004**: Define course learning outcomes
- **FR-CM-005**: Assign course to department
- **FR-CM-006**: Set course level (undergraduate, graduate)
- **FR-CM-007**: Mark courses as active/inactive
- **FR-CM-008**: Duplicate course definitions
- **FR-CM-009**: Version control for course modifications
- **FR-CM-010**: Search and filter course catalog

**Data Points**:
- Course code (unique identifier)
- Course name (English and Chinese)
- Department
- Credits (1-4)
- Category (Core Chinese, Core English, Core IT, Core GED, Core PHE, Major Required, Major Elective, Free Elective)
- Description (full text)
- Prerequisites (course codes with logic: AND/OR)
- Corequisites
- Learning outcomes
- Grading type (Letter, Pass/Fail, Audit)
- Enrollment restrictions

---

### 4.2.2 Course Offering Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-CM-011**: Create course offerings for specific term
- **FR-CM-012**: Set offering capacity (max enrollment)
- **FR-CM-013**: Enable/disable waitlist
- **FR-CM-014**: Set enrollment restrictions (major, year level)
- **FR-CM-015**: Assign instructor(s)
- **FR-CM-016**: Set offering status (Active, Full, Cancelled, Closed)
- **FR-CM-017**: Clone offerings from previous terms
- **FR-CM-018**: Bulk create multiple sections
- **FR-CM-019**: Merge course sections
- **FR-CM-020**: Cancel course offerings (with student notifications)

**Business Rules**:
- Minimum enrollment threshold (e.g., 15 students)
- Maximum capacity based on room size
- Auto-close when capacity reached (if waitlist disabled)
- Instructor cannot teach overlapping sessions

---

### 4.2.3 Schedule Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-CM-021**: Assign lecture days and times (multiple sessions per course)
- **FR-CM-022**: Assign tutorial/lab sessions separately
- **FR-CM-023**: Assign classroom locations
- **FR-CM-024**: Validate schedule conflicts (room, instructor, student)
- **FR-CM-025**: View schedule grid (weekly timetable view)
- **FR-CM-026**: Drag-and-drop schedule building interface
- **FR-CM-027**: Auto-suggest available time slots
- **FR-CM-028**: Check room capacity vs enrollment
- **FR-CM-029**: Generate room utilization reports
- **FR-CM-030**: Export schedules to various formats

**Scheduling Rules**:
- Standard time slots: 08:30, 10:30, 13:30, 15:30 (80 min lectures)
- Tutorial slots: 18:00, 19:00, 20:00 (50 min)
- Lab slots: 3-hour blocks (13:30-16:50, 15:30-18:50)
- 3-credit courses: 2 lectures + 1 tutorial (typically)
- 1-credit courses: 1 session per week
- 2-credit courses: 1 lab session per week

**Buildings and Rooms**:
- Teaching Buildings: TA, TB, TC, TD (floors 1-13)
- Teaching Complexes: TCA, TCB, TCC, TCD (floors 1-13)
- Daoyuan Building (DY)
- Zhixin Building (ZX)
- Admin Building E (AE) - 2 floors only
- PE Complex (PE) - no floor numbers

---

### 4.2.4 Course Materials Management
**Priority**: P2 (Medium)

**Requirements**:
- **FR-CM-031**: Upload syllabus PDF
- **FR-CM-032**: Upload course materials (readings, assignments)
- **FR-CM-033**: Set material visibility (students, TAs, instructors)
- **FR-CM-034**: Version control for materials
- **FR-CM-035**: Material access logs

---

## 4.3 Enrollment Management

### 4.3.1 Enrollment Processing
**Priority**: P0 (Critical)

**Requirements**:
- **FR-EM-001**: Manual student enrollment (admin-initiated)
- **FR-EM-002**: Process student enrollment requests
- **FR-EM-003**: Auto-approve enrollments meeting all criteria
- **FR-EM-004**: Flag enrollments requiring manual approval
- **FR-EM-005**: Approve/reject enrollment requests with reason
- **FR-EM-006**: Bulk approve multiple enrollments
- **FR-EM-007**: Drop students from courses
- **FR-EM-008**: Swap students between sections
- **FR-EM-009**: Force-add students (override capacity)
- **FR-EM-010**: View enrollment timeline/history

**Validation Rules**:
- Check prerequisites met
- Check corequisites
- Check time conflicts
- Check credit overload (>18 credits requires approval)
- Check major/year restrictions
- Check capacity available
- Check enrollment period active

**Approval Workflow**:
```
Student Submits → Auto-Validation → 
├─ Pass → Auto-Approve → Confirmed
└─ Fail → Pending Queue → Admin Review →
   ├─ Approve → Confirmed
   └─ Reject → Rejected (with reason)
```

---

### 4.3.2 Waitlist Management
**Priority**: P1 (High)

**Requirements**:
- **FR-EM-011**: View waitlist for each course
- **FR-EM-012**: Manually add students to waitlist
- **FR-EM-013**: Auto-promote from waitlist when spot opens
- **FR-EM-014**: Manually promote specific students
- **FR-EM-015**: Clear/close waitlist
- **FR-EM-016**: Set waitlist expiration (time limit for enrollment)
- **FR-EM-017**: Send notifications to waitlisted students
- **FR-EM-018**: Reorder waitlist priority

**Business Rules**:
- Waitlist position is FIFO by default
- Students notified within 1 hour of promotion
- 24-hour window to accept waitlist promotion
- Auto-drop from waitlist if not accepted in time

---

### 4.3.3 Enrollment Analytics
**Priority**: P1 (High)

**Requirements**:
- **FR-EM-019**: View real-time enrollment statistics
- **FR-EM-020**: Track enrollment trends over time
- **FR-EM-021**: Identify under-enrolled courses (cancellation risk)
- **FR-EM-022**: Identify over-enrolled courses
- **FR-EM-023**: Generate enrollment reports by department
- **FR-EM-024**: Calculate enrollment fill rates
- **FR-EM-025**: Predict enrollment based on historical data

**Key Metrics**:
- Total enrollments per term
- Average class size
- Enrollment rate (% of capacity filled)
- Waitlist to enrollment conversion rate
- Drop rate by course/department
- Enrollment by student year level
- Enrollment by major

---

### 4.3.4 Conflict Detection & Resolution
**Priority**: P0 (Critical)

**Requirements**:
- **FR-EM-026**: Detect time conflicts in student schedules
- **FR-EM-027**: Detect prerequisite violations
- **FR-EM-028**: Detect credit overload violations
- **FR-EM-029**: List all conflicts with details
- **FR-EM-030**: Suggest alternative sections to resolve conflicts
- **FR-EM-031**: Override conflicts with justification
- **FR-EM-032**: Auto-resolve minor conflicts
- **FR-EM-033**: Generate conflict resolution reports

**Conflict Types**:
- **Time Conflict**: Two courses scheduled at same time
- **Prerequisite Not Met**: Missing required prerequisite
- **Corequisite Not Met**: Not enrolled in required corequisite
- **Credit Overload**: Total credits > 18
- **Duplicate Enrollment**: Already enrolled in same course
- **Restriction Violation**: Major/year restriction not met

---

## 4.4 Grade Management

### 4.4.1 Grade Entry
**Priority**: P0 (Critical)

**Requirements**:
- **FR-GM-001**: Enter grades individually for students
- **FR-GM-002**: Bulk import grades from CSV/Excel
- **FR-GM-003**: Enter grades via spreadsheet interface
- **FR-GM-004**: Validate grade values (A, A-, B+, etc., or numeric)
- **FR-GM-005**: Auto-calculate grade points from letter grades
- **FR-GM-006**: Enter special grades (PA, W, F, IP, AU)
- **FR-GM-007**: Set grade entry deadlines
- **FR-GM-008**: Lock grade entry after deadline
- **FR-GM-009**: Track grade entry progress (% complete)
- **FR-GM-010**: Save drafts (not yet submitted)

**Grade Scale**:
```
A   = 4.0    B+  = 3.3    C+  = 2.3    D+  = 1.3    F   = 0.0
A-  = 3.7    B   = 3.0    C   = 2.0    D   = 1.0    
             B-  = 2.7    C-  = 1.7    D-  = 0.7

Special:
PA  = Pass (no GPA impact)
W   = Withdrawn (no GPA impact)
IP  = In Progress
AU  = Audit (no credit, no GPA)
```

---

### 4.4.2 Grade Approval Workflow
**Priority**: P0 (Critical)

**Requirements**:
- **FR-GM-011**: Submit grades for approval
- **FR-GM-012**: View pending grade submissions
- **FR-GM-013**: Review grade distributions before approval
- **FR-GM-014**: Approve grade submissions
- **FR-GM-015**: Reject grade submissions with reason
- **FR-GM-016**: Request corrections from instructors
- **FR-GM-017**: Bulk approve multiple submissions
- **FR-GM-018**: Set approval delegation rules
- **FR-GM-019**: Track approval timeline
- **FR-GM-020**: Notify instructors of approval status

**Approval Workflow**:
```
Instructor Enters → Instructor Submits → 
Department Review (optional) → 
Registrar Approval → 
Published to Students
```

**Approval Criteria**:
- No invalid grades
- Grade distribution within expected norms
- All students have grades
- No unexplained anomalies

---

### 4.4.3 Grade Publishing
**Priority**: P0 (Critical)

**Requirements**:
- **FR-GM-021**: Publish grades to student portal
- **FR-GM-022**: Schedule grade release date/time
- **FR-GM-023**: Publish grades by course
- **FR-GM-024**: Publish grades by term (all courses)
- **FR-GM-025**: Unpublish grades if needed
- **FR-GM-026**: Send notifications on grade publication
- **FR-GM-027**: View publication status
- **FR-GM-028**: Set grade viewing permissions

---

### 4.4.4 Grade Modifications
**Priority**: P1 (High)

**Requirements**:
- **FR-GM-029**: Modify published grades (with approval)
- **FR-GM-030**: Track grade change requests
- **FR-GM-031**: Require justification for changes
- **FR-GM-032**: Approve/reject grade change requests
- **FR-GM-033**: Log all grade modifications
- **FR-GM-034**: Notify students of grade changes
- **FR-GM-035**: Set deadlines for grade corrections
- **FR-GM-036**: Lock grades after final deadline

**Change Workflow**:
```
Instructor Requests Change (with reason) → 
Department Head Review → 
Registrar Approval → 
Grade Updated → 
Student Notified
```

---

### 4.4.5 Grade Analytics
**Priority**: P1 (High)

**Requirements**:
- **FR-GM-037**: View grade distribution by course
- **FR-GM-038**: Compare grade distributions across sections
- **FR-GM-039**: Track grade trends over time
- **FR-GM-040**: Identify outlier grade distributions
- **FR-GM-041**: Calculate department average GPAs
- **FR-GM-042**: Generate grade distribution reports
- **FR-GM-043**: Export grade data for analysis

**Analytics**:
- Grade distribution histogram
- Average GPA by course
- Pass/fail rates
- Grade inflation/deflation trends
- Instructor grading patterns
- Department comparisons

---

## 4.5 Academic Records & Transcripts

### 4.5.1 Transcript Generation
**Priority**: P0 (Critical)

**Requirements**:
- **FR-AR-001**: Generate official transcripts (PDF format)
- **FR-AR-002**: Generate unofficial transcripts
- **FR-AR-003**: Include all required elements (see format below)
- **FR-AR-004**: Multi-page transcripts with proper pagination
- **FR-AR-005**: Watermark for unofficial transcripts
- **FR-AR-006**: Digital signature for official transcripts
- **FR-AR-007**: Batch generate transcripts
- **FR-AR-008**: Email transcripts to students
- **FR-AR-009**: Print transcripts
- **FR-AR-010**: Track transcript requests

**Transcript Format** (as per CUHK-SZ standard):
```
Header:
- University name and logo
- "OFFICIAL ACADEMIC TRANSCRIPT" or "UNOFFICIAL COPY"
- Issue date
- Page number
- "Invalid unless impressed with the Seal of the University"
- "The maximum GPA attainable is 4.000"

Student Info:
- Name (UPPERCASE)
- Student ID
- ID/Passport Number
- Date of Birth
- Admitted in
- College
- School
- Major/Programme
- Mode of Study

Academic Record:
- Grouped by term (e.g., "2022-23 Term 1")
- For each course:
  * Course Code
  * Course Title
  * Units (credits)
  * Grade
  * % of A- and above (class ranking)
- Term summary:
  * Units Passed = X.X
  * Term GPA = X.XXX
  * Cumulative Units Passed = X.X
  * Cumulative GPA = X.XXX

Final Summary:
- Total Units Passed
- Cumulative GPA / 4.000
- Major GPA / 4.000

Remarks:
- Explanation of Major GPA calculation
- Any special notes

Footer:
- "End of Transcript"
- Signature line: "Director of Registry Services"
- Watermark: "Unofficial Copy. NOT to be used as certificate..."
```

---

### 4.5.2 Degree Audit
**Priority**: P0 (Critical)

**Requirements**:
- **FR-AR-011**: Calculate completion status for all degree requirements
- **FR-AR-012**: Display checklist format (✅ Complete, ⚠️ In Progress, ❌ Not Met)
- **FR-AR-013**: Track requirements by category
- **FR-AR-014**: Identify missing requirements
- **FR-AR-015**: Calculate remaining credits needed
- **FR-AR-016**: Estimate graduation term
- **FR-AR-017**: Generate "What-If" scenarios (major change impact)
- **FR-AR-018**: Export degree audit report
- **FR-AR-019**: Compare actual vs. required for each category

**Degree Requirements** (Computer Science example):
```
Core Requirements (36 credits):
├─ Chinese (6 credits): CLC1201, CLC1301
├─ English (12 credits): ENG1001, ENG1002, ENG2001, ENG2002S
├─ IT (1 credit): ITE1000
├─ GED (15 credits): 5 courses from GED list
└─ PHE (2 credits): PED1001, PED1002

Major Requirements (45 credits):
├─ School Package (25 credits): MAT1001, MAT1002, PHY1001, etc.
└─ Required Courses (20 credits): CSC3001, CSC3002, etc.

Major Electives (25 credits):
└─ Choose from approved major elective list

Free Electives (14 credits):
└─ Any courses from any department

Total Required: 120 credits
Minimum GPA: 2.0
Major GPA: 2.0
```

---

### 4.5.3 Graduation Processing
**Priority**: P0 (Critical)

**Requirements**:
- **FR-AR-020**: Run graduation eligibility checks
- **FR-AR-021**: Generate graduation candidate list
- **FR-AR-022**: Flag students not meeting requirements
- **FR-AR-023**: Generate missing requirement reports
- **FR-AR-024**: Process graduation applications
- **FR-AR-025**: Approve/deny graduation applications
- **FR-AR-026**: Set degree conferral date
- **FR-AR-027**: Generate diploma information
- **FR-AR-028**: Update student status to "Graduated"
- **FR-AR-029**: Generate graduation ceremony lists

**Graduation Criteria**:
- All degree requirements met (120+ credits)
- Cumulative GPA ≥ 2.0
- Major GPA ≥ 2.0
- All financial obligations cleared (external system)
- No academic integrity violations
- Graduation application submitted by deadline

---

### 4.5.4 Transfer Credit Management
**Priority**: P1 (High)

**Requirements**:
- **FR-AR-030**: Record transfer credits from other institutions
- **FR-AR-031**: Map transfer courses to CUHK-SZ equivalents
- **FR-AR-032**: Set transfer credit limits (max credits allowed)
- **FR-AR-033**: Mark transfer courses on transcript
- **FR-AR-034**: Exclude transfer credits from GPA calculation
- **FR-AR-035**: Count transfer credits toward degree requirements
- **FR-AR-036**: Approve/deny transfer credit requests

---

## 4.6 Academic Calendar Management

### 4.6.1 Calendar Setup
**Priority**: P1 (High)

**Requirements**:
- **FR-AC-001**: Create academic year/term structure
- **FR-AC-002**: Set term start/end dates
- **FR-AC-003**: Define enrollment periods (add/drop deadlines)
- **FR-AC-004**: Set grade submission deadlines
- **FR-AC-005**: Mark holidays and breaks
- **FR-AC-006**: Set final exam periods
- **FR-AC-007**: Define academic events (orientation, convocation)
- **FR-AC-008**: Publish calendar to public
- **FR-AC-009**: Send calendar reminders
- **FR-AC-010**: Import/export calendar events

**Key Dates** (per term):
- Term start date
- Add/drop deadline (typically week 2)
- Course withdrawal deadline (typically week 10)
- Grade submission deadline
- Grade publication date
- Term end date
- Final exam period

---

### 4.6.2 Calendar Enforcement
**Priority**: P1 (High)

**Requirements**:
- **FR-AC-011**: Auto-enforce enrollment deadlines
- **FR-AC-012**: Lock course changes after deadlines
- **FR-AC-013**: Send deadline reminders
- **FR-AC-014**: Allow administrative overrides
- **FR-AC-015**: Log all deadline overrides

---

## 4.7 Reporting & Analytics

### 4.7.1 Standard Reports
**Priority**: P1 (High)

**Requirements**:
- **FR-RA-001**: Enrollment summary report
- **FR-RA-002**: Grade distribution report
- **FR-RA-003**: Course roster report
- **FR-RA-004**: Student academic standing report
- **FR-RA-005**: Graduation audit report
- **FR-RA-006**: Department summary report
- **FR-RA-007**: Faculty workload report
- **FR-RA-008**: Room utilization report
- **FR-RA-009**: Credit hour analysis
- **FR-RA-010**: Retention/attrition report

**Report Formats**:
- PDF (formatted, printable)
- Excel (data manipulation)
- CSV (data export)
- Interactive dashboard (web view)

---

### 4.7.2 Custom Report Builder
**Priority**: P2 (Medium)

**Requirements**:
- **FR-RA-011**: Drag-and-drop report builder interface
- **FR-RA-012**: Select data sources (students, courses, grades, etc.)
- **FR-RA-013**: Choose fields to include
- **FR-RA-014**: Apply filters and conditions
- **FR-RA-015**: Group and aggregate data
- **FR-RA-016**: Create calculated fields
- **FR-RA-017**: Save report templates
- **FR-RA-018**: Schedule recurring reports
- **FR-RA-019**: Share reports with other admins

---

### 4.7.3 Analytics Dashboard
**Priority**: P1 (High)

**Requirements**:
- **FR-RA-020**: Real-time enrollment metrics
- **FR-RA-021**: GPA trend charts
- **FR-RA-022**: Course fill rate indicators
- **FR-RA-023**: Student retention metrics
- **FR-RA-024**: Comparative analytics (YoY, term-over-term)
- **FR-RA-025**: Predictive analytics (enrollment forecasting)
- **FR-RA-026**: Department performance scorecards
- **FR-RA-027**: Drill-down capabilities
- **FR-RA-028**: Export dashboard data

**Key Metrics**:
- Total active students
- Average GPA (institutional, by major, by year)
- Enrollment rate (%)
- Course completion rate
- Graduation rate (4-year, 5-year, 6-year)
- Retention rate (year-to-year)
- Faculty-student ratio
- Average class size

---

### 4.7.4 Data Visualization
**Priority**: P2 (Medium)

**Requirements**:
- **FR-RA-029**: Interactive charts and graphs
- **FR-RA-030**: Heat maps (enrollment by time slot, room usage)
- **FR-RA-031**: Trend lines and forecasts
- **FR-RA-032**: Pie charts (demographics, major distribution)
- **FR-RA-033**: Bar charts (comparative analysis)
- **FR-RA-034**: Line charts (historical trends)
- **FR-RA-035**: Export visualizations as images

---

## 4.8 Bulk Operations & Batch Processing

### 4.8.1 Bulk Data Import
**Priority**: P1 (High)

**Requirements**:
- **FR-BO-001**: Import students from CSV/Excel
- **FR-BO-002**: Import courses from CSV/Excel
- **FR-BO-003**: Import enrollments from CSV/Excel
- **FR-BO-004**: Import grades from CSV/Excel
- **FR-BO-005**: Validate data before import
- **FR-BO-006**: Show preview of import data
- **FR-BO-007**: Detect duplicates
- **FR-BO-008**: Handle errors gracefully (skip, retry, abort)
- **FR-BO-009**: Generate import error report
- **FR-BO-010**: Track import progress

**Import Templates**:
Provide standardized CSV templates for:
- Student data (required fields, optional fields)
- Course offerings
- Enrollments (student ID, course code, term)
- Grades (student ID, course code, grade)

---

### 4.8.2 Bulk Operations
**Priority**: P1 (High)

**Requirements**:
- **FR-BO-011**: Bulk enroll students in courses
- **FR-BO-012**: Bulk drop students from courses
- **FR-BO-013**: Bulk change student status
- **FR-BO-014**: Bulk change student major
- **FR-BO-015**: Bulk send emails
- **FR-BO-016**: Bulk approve enrollments
- **FR-BO-017**: Bulk approve grades
- **FR-BO-018**: Bulk update course information
- **FR-BO-019**: Preview bulk operations before execution
- **FR-BO-020**: Rollback bulk operations (undo)

**Bulk Operation Flow**:
```
Select Records → 
Choose Action → 
Preview Changes → 
Confirm → 
Execute → 
View Results/Errors → 
(Optional) Rollback
```

---

### 4.8.3 Scheduled Jobs
**Priority**: P2 (Medium)

**Requirements**:
- **FR-BO-021**: Schedule recurring tasks (daily, weekly, monthly)
- **FR-BO-022**: Auto-generate reports on schedule
- **FR-BO-023**: Auto-send reminders
- **FR-BO-024**: Auto-update student year levels (at term start)
- **FR-BO-025**: Auto-close enrollment after deadline
- **FR-BO-026**: Auto-promote waitlist students
- **FR-BO-027**: View scheduled job status
- **FR-BO-028**: Cancel scheduled jobs
- **FR-BO-029**: View job execution history

---

## 4.9 System Administration

### 4.9.1 User Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SA-001**: Create admin user accounts
- **FR-SA-002**: Assign roles (Super Admin, Academic Affairs, Registrar, Department Admin, Viewer)
- **FR-SA-003**: Set granular permissions
- **FR-SA-004**: Deactivate user accounts
- **FR-SA-005**: Reset user passwords
- **FR-SA-006**: Track user login history
- **FR-SA-007**: Set session timeout
- **FR-SA-008**: Enforce password policies
- **FR-SA-009**: Enable two-factor authentication (2FA)
- **FR-SA-010**: View active sessions

---

### 4.9.2 Permission Management
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SA-011**: Define resource-level permissions (Students, Courses, Grades, etc.)
- **FR-SA-012**: Set CRUD permissions (Create, Read, Update, Delete)
- **FR-SA-013**: Set department-specific access (restrict by department)
- **FR-SA-014**: Set term-specific access (restrict by semester/year)
- **FR-SA-015**: Create custom permission roles
- **FR-SA-016**: Inherit permissions from parent roles
- **FR-SA-017**: Override individual permissions
- **FR-SA-018**: Test permissions before applying

**Permission Matrix Example**:
```
Role: Department Admin (Computer Science)
- Students (CS only): Read, Update
- Courses (CS only): Read, Update, Create
- Enrollments (CS courses only): Read, Approve, Update
- Grades (CS courses only): Read, Approve
- Transcripts (CS students only): Read, Generate
- Reports (CS only): Read, Create
```

---

### 4.9.3 Audit Logging
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SA-019**: Log all admin actions (create, update, delete)
- **FR-SA-020**: Log user logins and logouts
- **FR-SA-021**: Log permission changes
- **FR-SA-022**: Log bulk operations
- **FR-SA-023**: Store old values and new values for updates
- **FR-SA-024**: Track IP addresses and user agents
- **FR-SA-025**: Search audit logs by user, action, resource, date
- **FR-SA-026**: Export audit logs
- **FR-SA-027**: Set audit log retention period
- **FR-SA-028**: Alert on suspicious activities

**Audit Log Entry**:
```
{
  "timestamp": "2025-11-19T10:30:45Z",
  "admin_id": 12345,
  "admin_name": "Liu Ming",
  "action": "UPDATE",
  "resource_type": "STUDENT",
  "resource_id": 67890,
  "resource_identifier": "122040012",
  "old_value": {"status": "ACTIVE", "major_id": 5},
  "new_value": {"status": "ACTIVE", "major_id": 7},
  "reason": "Student requested major change",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0..."
}
```

---

### 4.9.4 System Alerts & Notifications
**Priority**: P1 (High)

**Requirements**:
- **FR-SA-029**: Generate system alerts for critical issues
- **FR-SA-030**: Categorize alerts (Enrollment, Grades, System, Schedule, Data Integrity)
- **FR-SA-031**: Set alert severity levels (Low, Medium, High, Critical)
- **FR-SA-032**: Display unresolved alerts on dashboard
- **FR-SA-033**: Send email notifications for high/critical alerts
- **FR-SA-034**: Assign alerts to specific admins
- **FR-SA-035**: Mark alerts as resolved
- **FR-SA-036**: Add notes/comments to alerts
- **FR-SA-037**: View alert history

**Alert Examples**:
- ⚠️ HIGH: 15 students exceed 18-credit limit
- ⚠️ CRITICAL: Course CSC3001 has 3 schedule conflicts
- ⚠️ MEDIUM: 23 grade submissions pending approval for >7 days
- ⚠️ HIGH: BIO1008 has only 8 enrolled students (min 15 required)
- ⚠️ LOW: Add/drop deadline in 3 days

---

### 4.9.5 System Configuration
**Priority**: P1 (High)

**Requirements**:
- **FR-SA-038**: Set system-wide policies (credit limits, GPA thresholds)
- **FR-SA-039**: Configure email templates
- **FR-SA-040**: Set notification preferences
- **FR-SA-041**: Configure grade scale mappings
- **FR-SA-042**: Set academic calendar defaults
- **FR-SA-043**: Configure enrollment rules
- **FR-SA-044**: Set file upload limits
- **FR-SA-045**: Configure session timeout duration
- **FR-SA-046**: Set data retention policies

**Configurable Policies**:
```
Academic Policies:
- Maximum credits per term: 18 (overload requires approval)
- Minimum credits for full-time: 12
- Minimum GPA for good standing: 2.0
- Probation threshold: GPA < 2.0 for one term
- Dismissal threshold: GPA < 2.0 for two consecutive terms
- Maximum W grades allowed: 3
- Graduation minimum credits: 120

System Policies:
- Session timeout: 30 minutes
- Password expiration: 90 days
- Max login attempts: 5
- File upload size: 50MB
- Audit log retention: 7 years
```

---

### 4.9.6 Data Backup & Recovery
**Priority**: P0 (Critical)

**Requirements**:
- **FR-SA-047**: Manual database backup
- **FR-SA-048**: Scheduled automatic backups
- **FR-SA-049**: Restore from backup
- **FR-SA-050**: Export entire database
- **FR-SA-051**: Point-in-time recovery
- **FR-SA-052**: Test backup integrity
- **FR-SA-053**: Backup encryption
- **FR-SA-054**: Offsite backup storage
- **FR-SA-055**: Backup monitoring and alerts

---

## 4.10 Notifications & Communications

### 4.10.1 System Notifications
**Priority**: P1 (High)

**Requirements**:
- **FR-NC-001**: In-app notification center
- **FR-NC-002**: Push notifications (browser)
- **FR-NC-003**: Email notifications
- **FR-NC-004**: SMS notifications (critical only)
- **FR-NC-005**: Notification preferences (per admin)
- **FR-NC-006**: Mark notifications as read
- **FR-NC-007**: Notification history
- **FR-NC-008**: Notification templates

**Notification Types**:
- Enrollment request pending approval
- Grade submission pending approval
- System alert triggered
- Schedule conflict detected
- Bulk operation completed
- Report generation completed
- User login from new device
- System maintenance scheduled

---

### 4.10.2 Announcements
**Priority**: P2 (Medium)

**Requirements**:
- **FR-NC-009**: Create system-wide announcements
- **FR-NC-010**: Target announcements by user group (all students, specific major, year level)
- **FR-NC-011**: Schedule announcement publication
- **FR-NC-012**: Set announcement expiration
- **FR-NC-013**: Pin important announcements
- **FR-NC-014**: Announcement categories (Academic, Administrative, Emergency)
- **FR-NC-015**: Track announcement views
- **FR-NC-016**: Send announcement via email

---

# 5. System Modules

## 5.1 Dashboard Module

**Purpose**: Centralized overview of system status and key metrics

**Features**:
- Real-time statistics cards (total students, courses, pending approvals, alerts)
- Enrollment trend charts
- Grade distribution visualizations
- Quick access buttons to common tasks
- Recent activity feed
- Unresolved alerts panel
- Upcoming deadlines calendar
- System health indicators

**User Interactions**:
- Click on stats cards to drill down
- Filter data by term, department, date range
- Customize dashboard layout
- Export dashboard data

---

## 5.2 Student Management Module

**Purpose**: Complete student lifecycle management

**Sub-Modules**:
1. **Student Directory**: Search, filter, list all students
2. **Student Profile**: Detailed view of individual student
3. **Bulk Operations**: Mass updates and imports
4. **Student Communications**: Email and notifications

**Key Views**:
- Student list table (sortable, filterable, paginated)
- Student detail page (tabs: Personal, Academic, Enrollment, Grades, Transcript, Audit Log)
- Bulk import wizard
- Communication center

---

## 5.3 Course Management Module

**Purpose**: Manage course catalog and offerings

**Sub-Modules**:
1. **Course Catalog**: Define courses
2. **Course Offerings**: Term-specific offerings
3. **Schedule Builder**: Visual schedule creation
4. **Conflict Detector**: Identify scheduling issues

**Key Views**:
- Course catalog list
- Course detail editor
- Offering list (by term)
- Weekly schedule grid
- Room utilization chart
- Conflict resolution panel

---

## 5.4 Enrollment Management Module

**Purpose**: Process and manage student enrollments

**Sub-Modules**:
1. **Enrollment Queue**: Pending approvals
2. **Active Enrollments**: Current enrollments
3. **Waitlist Manager**: Waitlist processing
4. **Drop Manager**: Course drops and withdrawals

**Key Views**:
- Pending approval queue (sortable by priority)
- Enrollment detail modal (with conflict warnings)
- Waitlist panel (drag-and-drop priority)
- Bulk approval interface

---

## 5.5 Grade Management Module

**Purpose**: Grade entry, approval, and publishing

**Sub-Modules**:
1. **Grade Entry**: Spreadsheet-style entry
2. **Grade Approval**: Review and approve submissions
3. **Grade Publishing**: Release grades to students
4. **Grade Analytics**: Distribution analysis

**Key Views**:
- Grade entry spreadsheet
- Approval queue (by course)
- Grade distribution charts
- Historical grade trends

---

## 5.6 Academic Records Module

**Purpose**: Transcripts, degree audits, graduation processing

**Sub-Modules**:
1. **Transcript Generator**: Create transcripts
2. **Degree Audit**: Requirement tracking
3. **Graduation Processing**: Eligibility checks
4. **Transfer Credits**: External credit management

**Key Views**:
- Transcript preview (PDF)
- Degree audit checklist
- Graduation candidate list
- Transfer credit approval form

---

## 5.7 Reporting Module

**Purpose**: Generate and analyze reports

**Sub-Modules**:
1. **Standard Reports**: Pre-built reports
2. **Custom Report Builder**: Create custom reports
3. **Analytics Dashboard**: Visual analytics
4. **Export Center**: Download reports

**Key Views**:
- Report library
- Report builder interface
- Dashboard with charts
- Export queue

---

## 5.8 System Administration Module

**Purpose**: System configuration and management

**Sub-Modules**:
1. **User Management**: Admin accounts
2. **Permission Management**: Roles and permissions
3. **Audit Log Viewer**: Track changes
4. **System Configuration**: Settings
5. **Alert Manager**: System alerts

**Key Views**:
- User list and editor
- Permission matrix
- Audit log search
- Configuration panels
- Alert dashboard

---

# 6. API Specifications

## 6.1 API Architecture

**Base URL**: `https://api.cuhk.edu.cn/v1`

**Authentication**: 
- JWT-based authentication
- Token in Authorization header: `Bearer <token>`
- Refresh token for session extension

**Response Format**:
```json
{
  "success": true|false,
  "data": { ... },
  "error": "Error message if success=false",
  "metadata": {
    "timestamp": "2025-11-19T10:30:00Z",
    "pagination": {
      "page": 1,
      "perPage": 50,
      "total": 8542,
      "totalPages": 171
    }
  }
}
```

**Error Handling**:
```json
{
  "success": false,
  "error": "Invalid student ID",
  "errorCode": "VALIDATION_ERROR",
  "details": {
    "field": "student_id",
    "message": "Student ID must be 9 digits"
  }
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden (permission denied)
- 404: Not Found
- 409: Conflict (duplicate, constraint violation)
- 500: Internal Server Error

---

## 6.2 Student Management APIs

### 6.2.1 List Students
```
GET /api/admin/students

Query Parameters:
- page: integer (default: 1)
- perPage: integer (default: 50, max: 100)
- search: string (name, ID, email search)
- major: string (filter by major)
- year: integer (filter by year level)
- status: enum (ACTIVE, ON_LEAVE, WITHDRAWN, SUSPENDED, GRADUATED)
- college: string
- sortBy: string (student_id, name, gpa, credits)
- sortOrder: enum (asc, desc)

Response:
{
  "success": true,
  "data": {
    "students": [
      {
        "id": 12345,
        "student_id": "122040012",
        "user_id": 67890,
        "full_name": "Filbert Cahyadi Hamijoyo",
        "email": "filbert.hamijoyo@cuhk.edu.cn",
        "major": {
          "id": 5,
          "name": "Computer Science",
          "department": "SDS"
        },
        "year": 4,
        "status": "ACTIVE",
        "gpa": {
          "cumulative": 3.033,
          "major": 3.223
        },
        "credits_earned": 97,
        "admission_date": "2022-09-01",
        "expected_graduation": "2026-06-30"
      }
    ]
  },
  "metadata": {
    "pagination": { ... }
  }
}
```

---

### 6.2.2 Get Student Details
```
GET /api/admin/students/:id

Path Parameters:
- id: integer (student database ID) OR student_id string

Response:
{
  "success": true,
  "data": {
    "id": 12345,
    "student_id": "122040012",
    "user_id": 67890,
    "full_name": "Filbert Cahyadi Hamijoyo",
    "email": "filbert.hamijoyo@cuhk.edu.cn",
    "phone": "+86 138-1234-5678",
    "date_of_birth": "2004-05-20",
    "nationality": "Indonesian",
    "major": { ... },
    "minor": null,
    "year": 4,
    "status": "ACTIVE",
    "college": "Ling College",
    "admission_date": "2022-09-01",
    "expected_graduation": "2026-06-30",
    "gpa": {
      "cumulative": 3.033,
      "major": 3.223,
      "term": 3.320
    },
    "credits": {
      "earned": 97,
      "in_progress": 17,
      "required": 120
    },
    "academic_standing": "GOOD_STANDING",
    "enrollments_count": 41,
    "current_term_enrollments": 6
  }
}
```

---

### 6.2.3 Create Student
```
POST /api/admin/students

Request Body:
{
  "student_id": "122040999",
  "full_name": "John Doe",
  "email": "john.doe@cuhk.edu.cn",
  "phone": "+86 138-0000-0000",
  "date_of_birth": "2005-01-15",
  "nationality": "Chinese",
  "passport_number": "E12345678",
  "major_id": 5,
  "year": 1,
  "status": "ACTIVE",
  "college": "Diligentia College",
  "admission_date": "2025-09-01",
  "expected_graduation": "2029-06-30"
}

Response:
{
  "success": true,
  "data": {
    "id": 12346,
    "student_id": "122040999",
    ...
  }
}
```

---

### 6.2.4 Update Student
```
PUT /api/admin/students/:id

Request Body:
{
  "major_id": 7,
  "year": 2,
  "status": "ACTIVE",
  "college": "Harmonia College",
  "reason": "Student requested major change from CS to DS"
}

Response:
{
  "success": true,
  "data": {
    "id": 12345,
    "student_id": "122040012",
    "major": {
      "id": 7,
      "name": "Data Science"
    },
    ...
  }
}
```

---

### 6.2.5 Delete/Archive Student
```
DELETE /api/admin/students/:id

Query Parameters:
- archive: boolean (true = archive, false = hard delete)
- reason: string (required)

Response:
{
  "success": true,
  "message": "Student archived successfully"
}
```

---

### 6.2.6 Bulk Import Students
```
POST /api/admin/students/bulk-import

Content-Type: multipart/form-data

Request Body:
- file: CSV/Excel file
- validate_only: boolean (preview without importing)

Response:
{
  "success": true,
  "data": {
    "preview": [
      {
        "row": 1,
        "student_id": "122040999",
        "full_name": "John Doe",
        "status": "VALID",
        "errors": []
      },
      {
        "row": 2,
        "student_id": "122040998",
        "full_name": "Jane Smith",
        "status": "ERROR",
        "errors": ["Email already exists"]
      }
    ],
    "summary": {
      "total_rows": 500,
      "valid": 487,
      "errors": 13
    }
  }
}

After validation, if validate_only=false:
{
  "success": true,
  "data": {
    "batch_id": "batch_12345",
    "status": "PROCESSING",
    "total": 487,
    "processed": 0,
    "failed": 0
  }
}
```

---

### 6.2.7 Bulk Operations
```
POST /api/admin/students/bulk-action

Request Body:
{
  "action": "CHANGE_STATUS" | "CHANGE_MAJOR" | "ENROLL" | "DROP" | "SEND_EMAIL",
  "student_ids": [12345, 12346, 12347],
  "parameters": {
    "status": "ON_LEAVE",  // for CHANGE_STATUS
    "major_id": 5,         // for CHANGE_MAJOR
    "course_id": 789,      // for ENROLL/DROP
    "email_template": "...",  // for SEND_EMAIL
    "reason": "Bulk status update for medical leave"
  }
}

Response:
{
  "success": true,
  "data": {
    "batch_id": "batch_67890",
    "status": "COMPLETED",
    "total": 3,
    "succeeded": 3,
    "failed": 0,
    "errors": []
  }
}
```

---

### 6.2.8 Get Student Audit Log
```
GET /api/admin/students/:id/audit-log

Query Parameters:
- page: integer
- perPage: integer
- startDate: ISO date
- endDate: ISO date
- actionType: enum (CREATE, UPDATE, DELETE)

Response:
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 99999,
        "timestamp": "2025-11-18T14:30:00Z",
        "admin_id": 111,
        "admin_name": "Liu Ming",
        "action": "UPDATE",
        "changes": {
          "major_id": {
            "old": 5,
            "new": 7
          }
        },
        "reason": "Student requested major change",
        "ip_address": "192.168.1.100"
      }
    ]
  },
  "metadata": { ... }
}
```

---

## 6.3 Course Management APIs

### 6.3.1 List Courses
```
GET /api/admin/courses

Query Parameters:
- page, perPage
- semester: enum (FALL, SPRING, SUMMER)
- year: integer
- department: string (SDS, SSE, HSS, etc.)
- category: enum (CORE_CHINESE, MAJOR_REQUIRED, etc.)
- status: enum (ACTIVE, INACTIVE, FULL, CANCELLED)
- instructor_id: integer
- search: string (course code or name)
- sortBy: string
- sortOrder: enum

Response:
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 456,
        "course_code": "CSC3170",
        "course_name": "Database System",
        "department": "SDS",
        "credits": 3,
        "category": "MAJOR_ELECTIVE",
        "semester": "FALL",
        "year": 2025,
        "status": "ACTIVE",
        "instructor": {
          "id": 789,
          "name": "Prof. Wang"
        },
        "schedule": [
          {
            "session_type": "LECTURE",
            "day_of_week": "TUESDAY",
            "start_time": "15:30:00",
            "end_time": "16:50:00",
            "location": "TC-207"
          }
        ],
        "enrollment": {
          "current": 48,
          "max_capacity": 50,
          "waitlist": 5
        }
      }
    ]
  }
}
```

---

### 6.3.2 Get Course Details
```
GET /api/admin/courses/:id

Response:
{
  "success": true,
  "data": {
    "id": 456,
    "course_code": "CSC3170",
    "course_name": "Database System",
    "description": "Comprehensive introduction to database systems...",
    "department": "SDS",
    "credits": 3,
    "category": "MAJOR_ELECTIVE",
    "prerequisites": ["CSC3001", "CSC3002"],
    "corequisites": [],
    "semester": "FALL",
    "year": 2025,
    "status": "ACTIVE",
    "max_capacity": 50,
    "current_enrollment": 48,
    "waitlist_enabled": true,
    "waitlist_count": 5,
    "instructor": { ... },
    "sessions": [
      {
        "id": 1001,
        "session_type": "LECTURE",
        "day_of_week": "TUESDAY",
        "start_time": "15:30:00",
        "end_time": "16:50:00",
        "location": "TC-207"
      },
      {
        "id": 1002,
        "session_type": "LECTURE",
        "day_of_week": "THURSDAY",
        "start_time": "15:30:00",
        "end_time": "16:50:00",
        "location": "TC-207"
      },
      {
        "id": 1003,
        "session_type": "TUTORIAL",
        "day_of_week": "WEDNESDAY",
        "start_time": "19:00:00",
        "end_time": "19:50:00",
        "location": "TC-411"
      }
    ],
    "enrolled_students": [...],
    "grade_distribution": { ... }
  }
}
```

---

### 6.3.3 Create Course
```
POST /api/admin/courses

Request Body:
{
  "course_code": "CSC4999",
  "course_name": "Special Topics in AI",
  "description": "Advanced topics in artificial intelligence",
  "department": "SDS",
  "credits": 3,
  "category": "MAJOR_ELECTIVE",
  "semester": "SPRING",
  "year": 2026,
  "max_capacity": 40,
  "waitlist_enabled": true,
  "instructor_id": 789,
  "prerequisites": ["CSC3180", "DDA3020"],
  "sessions": [
    {
      "session_type": "LECTURE",
      "day_of_week": "MONDAY",
      "start_time": "10:30:00",
      "end_time": "11:50:00",
      "location": "AI-301"
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "id": 1234,
    "course_code": "CSC4999",
    ...
  }
}
```

---

### 6.3.4 Update Course
```
PUT /api/admin/courses/:id

Request Body:
{
  "max_capacity": 60,
  "instructor_id": 790,
  "reason": "Moved to larger room due to demand"
}

Response: { ... }
```

---

### 6.3.5 Delete/Cancel Course
```
DELETE /api/admin/courses/:id

Query Parameters:
- notify_students: boolean (send cancellation email)
- reason: string (required)

Response:
{
  "success": true,
  "message": "Course cancelled and 48 students notified"
}
```

---

### 6.3.6 Add/Update Course Session
```
POST /api/admin/courses/:id/sessions

Request Body:
{
  "session_type": "LAB",
  "day_of_week": "FRIDAY",
  "start_time": "13:30:00",
  "end_time": "16:50:00",
  "location": "TC-Lab01"
}

Response: { ... }

PUT /api/admin/courses/:id/sessions/:session_id
DELETE /api/admin/courses/:id/sessions/:session_id
```

---

### 6.3.7 Get Course Roster
```
GET /api/admin/courses/:id/roster

Query Parameters:
- include_dropped: boolean (include dropped students)
- format: enum (json, csv, pdf)

Response:
{
  "success": true,
  "data": {
    "course": { ... },
    "students": [
      {
        "student_id": "122040012",
        "name": "Filbert Hamijoyo",
        "year": 4,
        "major": "Computer Science",
        "enrollment_status": "CONFIRMED",
        "enrolled_at": "2025-08-15T10:00:00Z",
        "current_grade": "IP"
      }
    ]
  }
}
```

---

### 6.3.8 Detect Schedule Conflicts
```
GET /api/admin/courses/conflicts

Query Parameters:
- semester: enum
- year: integer
- type: enum (ROOM, INSTRUCTOR, TIME, ALL)

Response:
{
  "success": true,
  "data": {
    "conflicts": [
      {
        "type": "ROOM",
        "severity": "HIGH",
        "description": "TC-207 double-booked",
        "courses": [
          {
            "id": 456,
            "course_code": "CSC3170",
            "session": "Tuesday 15:30-16:50"
          },
          {
            "id": 457,
            "course_code": "DDA3020",
            "session": "Tuesday 15:30-16:50"
          }
        ],
        "suggested_resolution": "Move DDA3020 to TC-305"
      }
    ]
  }
}
```

---

### 6.3.9 Copy Courses from Previous Term
```
POST /api/admin/courses/copy-from-term

Request Body:
{
  "source_semester": "FALL",
  "source_year": 2024,
  "target_semester": "FALL",
  "target_year": 2025,
  "department_filter": "SDS",  // optional
  "exclude_cancelled": true
}

Response:
{
  "success": true,
  "data": {
    "copied_count": 127,
    "skipped_count": 5,
    "details": [ ... ]
  }
}
```

---

### 6.3.10 Bulk Create Courses
```
POST /api/admin/courses/bulk-create

Content-Type: multipart/form-data
- file: CSV with course data

Response: Similar to bulk student import
```

---

## 6.4 Enrollment Management APIs

### 6.4.1 List Enrollments
```
GET /api/admin/enrollments

Query Parameters:
- page, perPage
- status: enum (PENDING, CONFIRMED, WAITLISTED, DROPPED, REJECTED)
- semester, year
- course_id: integer
- student_id: string
- requires_approval: boolean

Response:
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": 9999,
        "student": {
          "id": 12345,
          "student_id": "122040012",
          "name": "Filbert Hamijoyo"
        },
        "course": {
          "id": 456,
          "course_code": "CSC3170",
          "course_name": "Database System"
        },
        "status": "PENDING",
        "enrolled_at": "2025-08-15T10:00:00Z",
        "requires_approval_reason": "CREDIT_OVERLOAD",
        "current_credits": 18,
        "conflicts": [],
        "prerequisites_met": true
      }
    ]
  }
}
```

---

### 6.4.2 Create Enrollment (Manual)
```
POST /api/admin/enrollments

Request Body:
{
  "student_id": "122040012",  // or student database ID
  "course_id": 456,
  "bypass_validations": false,  // force enrollment
  "reason": "Administrative enrollment per student request"
}

Response:
{
  "success": true,
  "data": {
    "id": 10000,
    "status": "CONFIRMED",
    "conflicts": [],
    "warnings": [
      "Student now has 21 credits (overload)"
    ]
  }
}
```

---

### 6.4.3 Approve Enrollment
```
PUT /api/admin/enrollments/:id/approve

Request Body:
{
  "notes": "Approved due to strong academic standing"
}

Response:
{
  "success": true,
  "data": {
    "id": 9999,
    "status": "CONFIRMED",
    "approved_by": 111,
    "approved_at": "2025-11-19T10:30:00Z"
  }
}
```

---

### 6.4.4 Reject Enrollment
```
PUT /api/admin/enrollments/:id/reject

Request Body:
{
  "reason": "Prerequisite CSC3001 not met"
}

Response: { ... }
```

---

### 6.4.5 Drop Enrollment
```
DELETE /api/admin/enrollments/:id

Query Parameters:
- notify_student: boolean
- reason: string (required)
- refund_eligible: boolean

Response:
{
  "success": true,
  "message": "Student dropped from course successfully"
}
```

---

### 6.4.6 Bulk Approve Enrollments
```
POST /api/admin/enrollments/bulk-approve

Request Body:
{
  "enrollment_ids": [9999, 10000, 10001],
  "notes": "Bulk approval for qualified students"
}

Response:
{
  "success": true,
  "data": {
    "approved": 3,
    "failed": 0,
    "details": [ ... ]
  }
}
```

---

### 6.4.7 Detect Conflicts
```
GET /api/admin/enrollments/conflicts

Query Parameters:
- semester, year
- student_id: optional (check specific student)
- conflict_type: enum (TIME, PREREQUISITE, OVERLOAD, ALL)

Response:
{
  "success": true,
  "data": {
    "conflicts": [
      {
        "student_id": "122040012",
        "student_name": "Filbert Hamijoyo",
        "conflict_type": "TIME",
        "courses": [
          "CSC3170 (Tue 15:30-16:50)",
          "DDA4230 (Tue 15:30-16:50)"
        ],
        "severity": "ERROR"
      }
    ]
  }
}
```

---

### 6.4.8 Waitlist Management
```
GET /api/admin/enrollments/waitlist/:course_id

Response:
{
  "success": true,
  "data": {
    "course": { ... },
    "waitlist": [
      {
        "id": 5001,
        "student": { ... },
        "position": 1,
        "added_at": "2025-08-20T14:00:00Z",
        "status": "WAITING"
      }
    ]
  }
}

POST /api/admin/enrollments/waitlist/promote
PUT /api/admin/enrollments/waitlist/reorder
DELETE /api/admin/enrollments/waitlist/:id
```

---

## 6.5 Grade Management APIs

### 6.5.1 List Grades
```
GET /api/admin/grades

Query Parameters:
- page, perPage
- semester, year
- course_id: integer
- student_id: string
- status: enum (IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED)
- instructor_id: integer

Response:
{
  "success": true,
  "data": {
    "grades": [
      {
        "id": 7777,
        "enrollment_id": 9999,
        "student": { ... },
        "course": { ... },
        "letter_grade": "A-",
        "numeric_grade": 88.5,
        "grade_points": 3.7,
        "status": "PUBLISHED",
        "submitted_by": 789,
        "submitted_at": "2025-05-20T16:00:00Z",
        "approved_by": 111,
        "approved_at": "2025-05-21T10:00:00Z",
        "published_at": "2025-05-22T09:00:00Z"
      }
    ]
  }
}
```

---

### 6.5.2 Create/Update Grade
```
POST /api/admin/grades
PUT /api/admin/grades/:id

Request Body:
{
  "enrollment_id": 9999,
  "letter_grade": "A-",
  "numeric_grade": 88.5,
  "comments": "Excellent performance"
}

Response: { ... }
```

---

### 6.5.3 Bulk Import Grades
```
POST /api/admin/grades/bulk-import

Content-Type: multipart/form-data
- file: CSV (student_id, course_code, grade)
- course_id: integer (if importing for single course)

Response: Similar to bulk student import
```

---

### 6.5.4 Approve Grades
```
PUT /api/admin/grades/:id/approve
POST /api/admin/grades/bulk-approve

Request Body (for single):
{
  "notes": "Grade distribution looks normal"
}

Request Body (for bulk):
{
  "grade_ids": [7777, 7778, 7779],
  "course_id": 456  // approve all grades for course
}

Response: { ... }
```

---

### 6.5.5 Reject Grades
```
PUT /api/admin/grades/:id/reject

Request Body:
{
  "reason": "Grade distribution shows too many A's",
  "request_correction": true
}

Response: { ... }
```

---

### 6.5.6 Publish Grades
```
POST /api/admin/grades/publish

Request Body:
{
  "course_id": 456,  // publish all grades for course
  "grade_ids": [7777, 7778],  // or specific grades
  "publish_at": "2025-05-22T09:00:00Z",  // schedule publication
  "notify_students": true
}

Response:
{
  "success": true,
  "data": {
    "published_count": 48,
    "scheduled": true,
    "publish_at": "2025-05-22T09:00:00Z"
  }
}
```

---

### 6.5.7 Grade Distribution Analysis
```
GET /api/admin/grades/distribution

Query Parameters:
- course_id: integer
- semester, year
- department: string
- instructor_id: integer

Response:
{
  "success": true,
  "data": {
    "distribution": {
      "A": 8,
      "A-": 12,
      "B+": 15,
      "B": 10,
      "B-": 3,
      "C+": 0,
      "C": 0,
      "D": 0,
      "F": 0
    },
    "statistics": {
      "mean": 3.42,
      "median": 3.3,
      "std_dev": 0.45,
      "pass_rate": 100
    }
  }
}
```

---

### 6.5.8 Pending Approvals
```
GET /api/admin/grades/pending

Response:
{
  "success": true,
  "data": {
    "pending_submissions": [
      {
        "course": {
          "id": 456,
          "course_code": "CSC3170",
          "course_name": "Database System"
        },
        "instructor": {
          "id": 789,
          "name": "Prof. Wang"
        },
        "submitted_at": "2025-05-20T16:00:00Z",
        "grade_count": 48,
        "avg_gpa": 3.3,
        "distribution": { ... },
        "flags": [
          "Distribution skewed high (75% A/B)"
        ]
      }
    ]
  }
}
```

---

## 6.6 Academic Records APIs

### 6.6.1 Generate Transcript
```
POST /api/admin/transcripts/generate

Request Body:
{
  "student_id": "122040012",
  "type": "OFFICIAL" | "UNOFFICIAL",
  "format": "PDF",
  "include_in_progress": false,
  "send_email": true
}

Response:
{
  "success": true,
  "data": {
    "transcript_id": "TR-2025-12345",
    "download_url": "https://cdn.cuhk.edu.cn/transcripts/TR-2025-12345.pdf",
    "generated_at": "2025-11-19T10:30:00Z",
    "expires_at": "2025-11-26T10:30:00Z"
  }
}
```

---

### 6.6.2 Degree Audit
```
GET /api/admin/students/:id/degree-audit

Response:
{
  "success": true,
  "data": {
    "student": { ... },
    "program": {
      "name": "Computer Science",
      "total_credits_required": 120
    },
    "progress": {
      "core": {
        "required": 36,
        "earned": 22,
        "in_progress": 0,
        "remaining": 14,
        "details": {
          "chinese": { required: 6, earned: 6, status: "COMPLETE" },
          "english": { required: 12, earned: 12, status: "COMPLETE" },
          "it": { required: 1, earned: 0, status: "NOT_MET" },
          "ged": { required: 15, earned: 12, status: "IN_PROGRESS" },
          "phe": { required: 2, earned: 2, status: "COMPLETE" }
        }
      },
      "major_required": {
        "required": 45,
        "earned": 30,
        "in_progress": 0,
        "remaining": 15
      },
      "major_elective": {
        "required": 25,
        "earned": 39,
        "status": "EXCEEDED"
      },
      "free_elective": {
        "required": 14,
        "earned": 6,
        "in_progress": 0,
        "remaining": 8
      }
    },
    "graduation_eligible": false,
    "missing_requirements": [
      "Core IT: ITE1000 (1 credit)",
      "Core GED: Need 1 more course (3 credits)",
      "Major Required: Need 15 credits",
      "Free Elective: Need 8 credits"
    ],
    "estimated_graduation": "Fall 2026"
  }
}
```

---

### 6.6.3 Graduation Eligibility Check
```
GET /api/admin/graduation/eligibility

Query Parameters:
- semester, year (graduation term)
- major_id: optional (check specific major)

Response:
{
  "success": true,
  "data": {
    "eligible_students": [
      {
        "student_id": "122040001",
        "name": "...",
        "major": "Computer Science",
        "gpa": 3.45,
        "credits_earned": 120,
        "requirements_met": true
      }
    ],
    "ineligible_students": [
      {
        "student_id": "122040012",
        "name": "Filbert Hamijoyo",
        "major": "Computer Science",
        "gpa": 3.033,
        "credits_earned": 97,
        "requirements_met": false,
        "missing": [
          "Core requirements: 14 credits",
          "Major requirements: 15 credits",
          "Free electives: 8 credits"
        ]
      }
    ],
    "summary": {
      "total_candidates": 1247,
      "eligible": 1156,
      "ineligible": 91
    }
  }
}
```

---

### 6.6.4 Process Graduation
```
POST /api/admin/graduation/process

Request Body:
{
  "student_ids": ["122040001", "122040002"],
  "graduation_date": "2026-06-30",
  "degree_conferral_date": "2026-07-01"
}

Response:
{
  "success": true,
  "data": {
    "processed": 2,
    "failed": 0,
    "graduated_students": [ ... ]
  }
}
```

---

### 6.6.5 Transfer Credit Management
```
POST /api/admin/students/:id/transfer-credits

Request Body:
{
  "institution": "University of Hong Kong",
  "course_name": "Introduction to Databases",
  "credits": 3,
  "grade": "B+",
  "equivalent_course_code": "CSC3170",
  "semester_taken": "Spring 2023"
}

Response: { ... }

GET /api/admin/students/:id/transfer-credits
PUT /api/admin/transfer-credits/:id
DELETE /api/admin/transfer-credits/:id
```

---

## 6.7 Academic Calendar APIs

### 6.7.1 Get Calendar
```
GET /api/admin/calendar

Query Parameters:
- year: integer
- semester: enum (optional)

Response:
{
  "success": true,
  "data": {
    "academic_year": "2025-2026",
    "terms": [
      {
        "semester": "FALL",
        "year": 2025,
        "start_date": "2025-09-01",
        "end_date": "2025-12-20",
        "events": [
          {
            "id": 1,
            "event_type": "TERM_START",
            "event_date": "2025-09-01",
            "description": "Fall 2025 term begins"
          },
          {
            "id": 2,
            "event_type": "ADD_DROP_DEADLINE",
            "event_date": "2025-09-15",
            "description": "Last day to add/drop courses"
          },
          {
            "id": 3,
            "event_type": "WITHDRAWAL_DEADLINE",
            "event_date": "2025-11-10",
            "description": "Last day to withdraw with W grade"
          },
          {
            "id": 4,
            "event_type": "GRADE_SUBMISSION_DEADLINE",
            "event_date": "2025-12-25",
            "description": "Instructors must submit grades"
          },
          {
            "id": 5,
            "event_type": "TERM_END",
            "event_date": "2025-12-20",
            "description": "Fall 2025 term ends"
          }
        ],
        "holidays": [
          {
            "name": "National Day",
            "start_date": "2025-10-01",
            "end_date": "2025-10-07"
          }
        ]
      }
    ]
  }
}
```

---

### 6.7.2 Create Calendar Event
```
POST /api/admin/calendar/events

Request Body:
{
  "semester": "SPRING",
  "year": 2026,
  "event_type": "READING_WEEK",
  "event_date": "2026-03-15",
  "description": "Reading week - no classes"
}

Response: { ... }
```

---

### 6.7.3 Update/Delete Calendar Event
```
PUT /api/admin/calendar/events/:id
DELETE /api/admin/calendar/events/:id
```

---

## 6.8 Reporting APIs

### 6.8.1 Standard Reports
```
GET /api/admin/reports/enrollment-summary

Query Parameters:
- semester, year
- department: optional
- format: enum (json, pdf, csv, excel)

Response (JSON):
{
  "success": true,
  "data": {
    "report_type": "ENROLLMENT_SUMMARY",
    "generated_at": "2025-11-19T10:30:00Z",
    "parameters": {
      "semester": "FALL",
      "year": 2025
    },
    "summary": {
      "total_courses": 1247,
      "total_enrollments": 52847,
      "avg_class_size": 42.3,
      "enrollment_rate": 94.2
    },
    "by_department": [
      {
        "department": "SDS",
        "courses": 187,
        "enrollments": 7821,
        "avg_class_size": 41.8
      }
    ],
    "by_year_level": [ ... ]
  }
}

For format=pdf/csv/excel:
Response: Binary file download
```

---

### 6.8.2 Custom Report
```
POST /api/admin/reports/custom

Request Body:
{
  "report_name": "High GPA Students by Major",
  "data_source": "students",
  "fields": ["student_id", "full_name", "major", "gpa"],
  "filters": [
    {
      "field": "gpa",
      "operator": ">=",
      "value": 3.5
    }
  ],
  "group_by": ["major"],
  "sort_by": [
    {
      "field": "gpa",
      "order": "desc"
    }
  ],
  "format": "excel"
}

Response:
{
  "success": true,
  "data": {
    "report_id": "RPT-12345",
    "download_url": "...",
    "expires_at": "..."
  }
}
```

---

### 6.8.3 Save Report Template
```
POST /api/admin/reports/templates

Request Body:
{
  "template_name": "Monthly Enrollment Report",
  "report_definition": { ... },  // same as custom report body
  "schedule": {
    "frequency": "MONTHLY",
    "day_of_month": 1,
    "recipients": ["admin@cuhk.edu.cn"]
  }
}

Response: { ... }
```

---

### 6.8.4 Analytics Dashboard Data
```
GET /api/admin/dashboard/stats

Query Parameters:
- semester, year

Response:
{
  "success": true,
  "data": {
    "overview": {
      "total_students": 8542,
      "active_students": 8421,
      "total_courses": 1247,
      "pending_approvals": 156,
      "unresolved_alerts": 23
    },
    "enrollment_metrics": {
      "current_term_enrollments": 52847,
      "avg_credits_per_student": 15.2,
      "enrollment_rate": 94.2,
      "waitlist_total": 347
    },
    "academic_performance": {
      "avg_gpa": 3.12,
      "pass_rate": 96.8,
      "dean_list_students": 1247
    },
    "trends": {
      "enrollment_by_week": [ ... ],
      "gpa_by_term": [ ... ],
      "graduation_rate": {
        "4_year": 87.5,
        "5_year": 95.2,
        "6_year": 97.8
      }
    },
    "alerts": [
      {
        "id": 1,
        "severity": "HIGH",
        "category": "ENROLLMENT",
        "message": "15 students exceed credit limit",
        "created_at": "..."
      }
    ]
  }
}
```

---

## 6.9 System Administration APIs

### 6.9.1 User Management
```
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

// Create admin user
POST /api/admin/users

Request Body:
{
  "email": "admin@cuhk.edu.cn",
  "full_name": "Admin User",
  "role": "ADMINISTRATOR",
  "admin_level": "ACADEMIC_ADMIN",
  "permissions": {
    "students": { "read": true, "create": true, "update": true, "delete": false },
    "courses": { "read": true, "create": true, "update": true, "delete": false },
    ...
  },
  "department_filter": "SDS"  // optional: restrict to department
}

Response: { ... }
```

---

### 6.9.2 Permission Management
```
GET /api/admin/users/:id/permissions
PUT /api/admin/users/:id/permissions

Request Body:
{
  "permissions": {
    "students": {
      "read": true,
      "create": true,
      "update": true,
      "delete": false
    },
    "grades": {
      "read": true,
      "create": false,
      "update": false,
      "delete": false,
      "approve": true
    }
  },
  "department_filter": "SDS",
  "term_filter": {
    "semester": "FALL",
    "year": 2025
  }
}

Response: { ... }
```

---

### 6.9.3 Audit Log
```
GET /api/admin/audit-log

Query Parameters:
- page, perPage
- admin_id: integer
- action_type: enum (CREATE, UPDATE, DELETE, APPROVE, REJECT)
- resource_type: enum (STUDENT, COURSE, GRADE, ENROLLMENT)
- resource_id: integer
- start_date, end_date: ISO dates

Response:
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 99999,
        "timestamp": "2025-11-19T10:30:00Z",
        "admin": {
          "id": 111,
          "name": "Liu Ming",
          "email": "liu.ming@cuhk.edu.cn"
        },
        "action": "UPDATE",
        "resource_type": "STUDENT",
        "resource_id": 12345,
        "resource_identifier": "122040012",
        "old_value": {
          "major_id": 5,
          "status": "ACTIVE"
        },
        "new_value": {
          "major_id": 7,
          "status": "ACTIVE"
        },
        "reason": "Student requested major change",
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0..."
      }
    ]
  },
  "metadata": { ... }
}
```

---

### 6.9.4 System Alerts
```
GET /api/admin/alerts

Query Parameters:
- status: enum (UNRESOLVED, RESOLVED, ALL)
- severity: enum (LOW, MEDIUM, HIGH, CRITICAL)
- category: enum (ENROLLMENT, GRADES, SCHEDULE, SYSTEM, DATA_INTEGRITY)

Response:
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": 1,
        "alert_type": "WARNING",
        "category": "ENROLLMENT",
        "severity": 3,
        "title": "Students exceeding credit limit",
        "message": "15 students are enrolled in >18 credits without approval",
        "is_resolved": false,
        "created_at": "2025-11-18T14:00:00Z",
        "metadata": {
          "student_ids": ["122040012", "122040013", ...]
        }
      }
    ]
  }
}

PUT /api/admin/alerts/:id/resolve
POST /api/admin/alerts (create manual alert)
```

---

### 6.9.5 System Configuration
```
GET /api/admin/config
PUT /api/admin/config

Request Body:
{
  "policies": {
    "max_credits_per_term": 18,
    "min_credits_full_time": 12,
    "min_gpa_good_standing": 2.0,
    "probation_gpa_threshold": 2.0,
    "max_w_grades": 3
  },
  "enrollment": {
    "auto_approve_enabled": true,
    "waitlist_auto_promote": true,
    "waitlist_accept_window_hours": 24
  },
  "grades": {
    "require_approval": true,
    "approval_levels": 2
  },
  "notifications": {
    "email_enabled": true,
    "sms_enabled": false
  }
}

Response: { ... }
```

---

### 6.9.6 Backup & Recovery
```
POST /api/admin/system/backup

Request Body:
{
  "backup_type": "FULL" | "INCREMENTAL",
  "include_files": boolean
}

Response:
{
  "success": true,
  "data": {
    "backup_id": "BKP-20251119-1030",
    "status": "IN_PROGRESS",
    "estimated_completion": "2025-11-19T11:00:00Z"
  }
}

GET /api/admin/system/backups (list backups)
POST /api/admin/system/restore (restore from backup)
```

---

### 6.9.7 Batch Operations Status
```
GET /api/admin/batch-operations

Response:
{
  "success": true,
  "data": {
    "operations": [
      {
        "id": "batch_12345",
        "operation_type": "BULK_IMPORT_STUDENTS",
        "status": "COMPLETED",
        "admin": { ... },
        "total_items": 500,
        "processed_items": 487,
        "failed_items": 13,
        "created_at": "2025-11-19T09:00:00Z",
        "completed_at": "2025-11-19T09:15:00Z",
        "error_log": [ ... ]
      }
    ]
  }
}

GET /api/admin/batch-operations/:id (get specific operation)
DELETE /api/admin/batch-operations/:id (cancel operation)
```

---

# 7. Data Models

## 7.1 Core Entities

### Student
```
- id: integer (PK)
- user_id: integer (FK to users)
- student_id: string (unique, e.g., "122040012")
- major_id: integer (FK to programs)
- minor_id: integer (FK to programs, nullable)
- year: integer (1-4+)
- status: enum (ACTIVE, ON_LEAVE, WITHDRAWN, SUSPENDED, GRADUATED)
- college: string
- admission_date: date
- expected_graduation: date
- academic_standing: enum (GOOD_STANDING, PROBATION, DISMISSAL)
- created_at: timestamp
- updated_at: timestamp
```

### Course
```
- id: integer (PK)
- course_code: string (unique per term, e.g., "CSC3170")
- course_name: string
- description: text
- department: string
- credits: integer
- category: enum (course_category)
- semester: enum (FALL, SPRING, SUMMER)
- year: integer
- status: enum (ACTIVE, INACTIVE, FULL, CANCELLED)
- max_capacity: integer
- current_enrollment: integer
- waitlist_enabled: boolean
- instructor_id: integer (FK to users)
- day_of_week: enum (DayOfWeek)
- start_time: time
- end_time: time
- location: string
- tutorial_day: enum (DayOfWeek, nullable)
- tutorial_start_time: time (nullable)
- tutorial_end_time: time (nullable)
- tutorial_location: string (nullable)
- prerequisites: text[] (array of course codes)
- corequisites: text[]
- created_at: timestamp
- updated_at: timestamp
```

### Course_Sessions
```
- id: integer (PK)
- course_id: integer (FK to courses)
- session_type: enum (LECTURE, TUTORIAL, LAB)
- day_of_week: enum (DayOfWeek)
- start_time: time
- end_time: time
- location: string
- instructor_id: integer (FK to users, nullable)
- created_at: timestamp
```

### Enrollment
```
- id: integer (PK)
- user_id: integer (FK to users)
- course_id: integer (FK to courses)
- status: enum (PENDING, CONFIRMED, WAITLISTED, DROPPED, REJECTED)
- enrolled_at: timestamp
- approved_by: integer (FK to users, nullable)
- approved_at: timestamp (nullable)
- dropped_at: timestamp (nullable)
- drop_reason: text (nullable)
- created_at: timestamp
```

### Grade
```
- id: integer (PK)
- enrollment_id: integer (FK to enrollments)
- letter_grade: string (A, A-, B+, etc.)
- numeric_grade: decimal (nullable)
- grade_points: decimal (0.0-4.0, nullable)
- status: enum (IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED)
- comments: text (nullable)
- submitted_by: integer (FK to users, nullable)
- submitted_at: timestamp (nullable)
- approved_by: integer (FK to users, nullable)
- approved_at: timestamp (nullable)
- published_at: timestamp (nullable)
- created_at: timestamp
- updated_at: timestamp
```

---

## 7.2 Admin-Specific Entities

### Admin_Permissions
```
- id: integer (PK)
- user_id: integer (FK to users)
- permission_type: string
- resource_type: enum (STUDENT, COURSE, GRADE, ENROLLMENT, etc.)
- can_create: boolean
- can_read: boolean
- can_update: boolean
- can_delete: boolean
- department_filter: string (nullable)
- term_filter: jsonb (nullable)
- created_at: timestamp
```

### Audit_Log
```
- id: integer (PK)
- admin_id: integer (FK to users)
- action_type: enum (CREATE, UPDATE, DELETE, APPROVE, REJECT)
- resource_type: enum (STUDENT, COURSE, GRADE, ENROLLMENT, etc.)
- resource_id: integer
- old_value: jsonb (nullable)
- new_value: jsonb (nullable)
- reason: text (nullable)
- ip_address: string
- user_agent: text
- created_at: timestamp
```

### System_Alerts
```
- id: integer (PK)
- alert_type: enum (WARNING, ERROR, INFO, CRITICAL)
- category: enum (ENROLLMENT, GRADES, SCHEDULE, SYSTEM, DATA_INTEGRITY)
- title: string
- message: text
- severity: integer (1-4)
- is_resolved: boolean
- resolved_by: integer (FK to users, nullable)
- resolved_at: timestamp (nullable)
- metadata: jsonb (nullable)
- created_at: timestamp
```

### Batch_Operations
```
- id: integer (PK)
- admin_id: integer (FK to users)
- operation_type: enum (BULK_ENROLL, BULK_GRADE, BULK_DROP, BULK_IMPORT, etc.)
- status: enum (PENDING, IN_PROGRESS, COMPLETED, FAILED)
- total_items: integer
- processed_items: integer
- failed_items: integer
- error_log: jsonb (nullable)
- file_url: text (nullable)
- created_at: timestamp
- completed_at: timestamp (nullable)
```

### Academic_Calendar
```
- id: integer (PK)
- semester: enum (FALL, SPRING, SUMMER)
- year: integer
- event_type: enum (TERM_START, TERM_END, ADD_DROP_DEADLINE, etc.)
- event_date: date
- description: text
- is_holiday: boolean
- created_at: timestamp
```

### Course_Waitlist
```
- id: integer (PK)
- user_id: integer (FK to users)
- course_id: integer (FK to courses)
- position: integer
- status: enum (WAITING, ENROLLED, DROPPED, EXPIRED)
- enrolled_at: timestamp (nullable)
- created_at: timestamp
```

---

# 8. User Workflows

## 8.1 Student Enrollment Approval Workflow

```
1. Student submits enrollment request (via student portal)
   ↓
2. System validates automatically:
   - Prerequisites met?
   - No time conflicts?
   - Credit limit not exceeded?
   - Course has capacity?
   ↓
3a. All checks pass → Auto-approve → Status: CONFIRMED
   ↓
3b. Any check fails → Status: PENDING
   ↓
4. Admin views pending queue
   ↓
5. Admin reviews:
   - Student academic standing (GPA, credits)
   - Reason for override request
   - Course demand/waitlist
   ↓
6a. Admin approves → Status: CONFIRMED → Student notified
   ↓
6b. Admin rejects → Status: REJECTED → Student notified with reason
```

---

## 8.2 Grade Submission & Approval Workflow

```
1. Instructor enters grades via portal
   ↓
2. Instructor submits for approval
   ↓
3. System validates:
   - All students have grades?
   - No invalid grade values?
   ↓
4. Department Head reviews (optional):
   - Grade distribution reasonable?
   - Consistent with past terms?
   ↓
5. Registrar approves:
   - Final validation
   - Check for anomalies
   ↓
6a. Approve → Grades marked APPROVED
   ↓
6b. Reject → Return to instructor with notes
   ↓
7. Registrar publishes grades
   ↓
8. Students can view grades
   ↓
9. Grade change requests (if needed):
   - Instructor submits change request
   - Department Head reviews
   - Registrar approves
   - Student notified of change
```

---

## 8.3 Course Schedule Creation Workflow

```
1. Admin selects term (e.g., Fall 2026)
   ↓
2. Option A: Copy from previous term
   - Select source term (Fall 2025)
   - Review copied courses
   - Make adjustments
   ↓
   Option B: Create from scratch
   - Add courses manually
   ↓
3. For each course:
   - Assign instructor
   - Set capacity
   - Add lecture sessions (day, time, room)
   - Add tutorial session (if applicable)
   - Add lab session (if applicable)
   ↓
4. System checks for conflicts:
   - Room double-bookings
   - Instructor conflicts
   - Time slot availability
   ↓
5. Admin resolves conflicts:
   - Change rooms
   - Adjust times
   - Reassign instructors
   ↓
6. Admin reviews full schedule grid
   ↓
7. Admin publishes schedule
   ↓
8. Students can view and enroll
```

---

## 8.4 Bulk Student Import Workflow

```
1. Admin downloads CSV template
   ↓
2. Admin fills in student data:
   - student_id
   - full_name
   - email
   - major
   - year
   - etc.
   ↓
3. Admin uploads CSV file
   ↓
4. System validates data:
   - Required fields present?
   - Valid email format?
   - No duplicate student IDs?
   - Valid major codes?
   ↓
5. System shows preview:
   - X rows valid (green)
   - Y rows have errors (red, with details)
   ↓
6a. Admin fixes errors → Re-upload
   ↓
6b. Admin confirms import (valid rows only)
   ↓
7. System processes import:
   - Create user accounts
   - Create student records
   - Send welcome emails
   ↓
8. System shows results:
   - Z students imported successfully
   - Error log for failed rows
   ↓
9. Admin downloads error log (if needed)
```

---

## 8.5 Graduation Processing Workflow

```
1. Admin runs graduation eligibility check (for specific term)
   ↓
2. System generates two lists:
   - Eligible students (all requirements met)
   - Ineligible students (with missing requirements)
   ↓
3. Admin reviews ineligible students:
   - Contact students
   - Provide guidance on completing requirements
   ↓
4. Admin reviews eligible students:
   - Verify all data correct
   - Check for holds/restrictions
   ↓
5. Admin approves graduation applications
   ↓
6. System updates:
   - Student status → GRADUATED
   - Set degree conferral date
   - Generate diploma data
   ↓
7. Admin generates graduation ceremony list
   ↓
8. Post-graduation:
   - Generate official transcripts
   - Archive student records
   - Alumni status
```

---

# 9. Security & Permissions

## 9.1 Authentication & Authorization

### Authentication Methods
- **Primary**: Username/password with JWT tokens
- **Secondary**: Two-Factor Authentication (2FA) via SMS/email
- **Session Management**: 30-minute inactivity timeout
- **Password Policy**:
  - Minimum 10 characters
  - Must include uppercase, lowercase, number, special character
  - Cannot reuse last 5 passwords
  - Expires every 90 days

### Authorization Levels
```
1. Super Administrator
   - Full system access
   - User management
   - System configuration
   - All CRUD operations
   - No restrictions

2. Academic Affairs Officer
   - Student management (CRUD)
   - Enrollment management (approve/reject)
   - Grade approval
   - Transcript generation
   - Department: All
   - Terms: All

3. Registrar
   - Student records (read only)
   - Grade approval (final)
   - Transcript generation (official)
   - Graduation processing
   - Academic calendar management
   - Department: All
   - Terms: All

4. Department Administrator
   - Student management (read, update within department)
   - Course management (CRUD within department)
   - Enrollment management (read, approve within department)
   - Grade management (read, approve within department)
   - Reports (department only)
   - Department: Specific (e.g., SDS only)
   - Terms: Current and future

5. Faculty Coordinator
   - Course management (read, update assigned courses)
   - Grade entry (assigned courses)
   - Enrollment roster (read for assigned courses)
   - Department: Specific
   - Courses: Assigned only

6. Viewer (Read-Only)
   - Dashboard access
   - Reports (read only)
   - No write permissions
   - Department: May be restricted
```

---

## 9.2 Permission Matrix

| Resource | Super Admin | Academic Affairs | Registrar | Dept Admin | Faculty Coord | Viewer |
|----------|-------------|------------------|-----------|------------|---------------|--------|
| **Students** |
| Create | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| Read | ✅ | ✅ | ✅ | ✅ (dept) | ✅ (courses) | ✅ (limited) |
| Update | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Courses** |
| Create | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| Read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update | ✅ | ✅ | ❌ | ✅ (dept) | ✅ (assigned) | ❌ |
| Delete | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| **Enrollments** |
| Create | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| Read | ✅ | ✅ | ✅ | ✅ (dept) | ✅ (assigned) | ❌ |
| Approve | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| Reject | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| Drop | ✅ | ✅ | ❌ | ✅ (dept) | ❌ | ❌ |
| **Grades** |
| Enter | ✅ | ❌ | ❌ | ❌ | ✅ (assigned) | ❌ |
| Read | ✅ | ✅ | ✅ | ✅ (dept) | ✅ (assigned) | ❌ |
| Approve | ✅ | ✅ | ✅ | ✅ (dept) | ❌ | ❌ |
| Publish | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Transcripts** |
| Generate (Unofficial) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Generate (Official) | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **System** |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Config | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Audit Log | ✅ | ✅ (own actions) | ✅ | ❌ | ❌ | ❌ |

---

## 9.3 Data Privacy & Compliance

### GDPR/Personal Data Protection
- **Student data encryption**: All PII encrypted at rest and in transit
- **Data retention**: Student records retained for 7 years post-graduation
- **Right to access**: Students can request all their data
- **Right to deletion**: Alumni can request data deletion (after retention period)
- **Data portability**: Students can export their data

### Access Logging
- **All data access logged**: Who accessed what, when
- **Sensitive data alerts**: Alert on bulk data downloads
- **Anomaly detection**: Flag unusual access patterns
- **Audit trail**: 7-year retention of all access logs

### Role-Based Access Control (RBAC)
- **Principle of least privilege**: Users only get minimum necessary permissions
- **Department restrictions**: Admins can only access their department data
- **Term restrictions**: Prevent modification of past terms
- **IP restrictions**: Limit admin access to campus network (optional)

---

# 10. Reporting & Analytics

## 10.1 Standard Reports

### 10.1.1 Enrollment Reports
- **Enrollment Summary by Term**: Total enrollments, by department, by year level
- **Course Fill Rates**: % capacity utilized per course
- **Enrollment Trends**: Historical enrollment data (YoY comparison)
- **Waitlist Report**: Courses with waitlists, conversion rates
- **Late Enrollments**: Students who enrolled after add/drop deadline
- **Drop Analysis**: Drop rates by course, instructor, department

### 10.1.2 Grade Reports
- **Grade Distribution**: Histogram of grades by course, department, instructor
- **GPA Analysis**: Average GPA by major, year level, cohort
- **Pass/Fail Rates**: By course, department, term
- **Grade Trends**: Historical grade inflation/deflation analysis
- **Dean's List**: Students with GPA ≥ 3.5
- **Academic Probation**: Students with GPA < 2.0
- **Missing Grades**: Courses without submitted/published grades

### 10.1.3 Student Reports
- **Student Roster**: Complete list with filters
- **Academic Standing**: Distribution of students by standing (good, probation, dismissal)
- **Credit Analysis**: Average credits per student, distribution
- **Retention Report**: Year-to-year retention rates
- **Graduation Forecast**: Projected graduation by term
- **Demographics**: Student distribution by nationality, gender, etc.

### 10.1.4 Course Reports
- **Course Catalog**: Complete listing with details
- **Course Roster**: Enrolled students per course
- **Schedule Grid**: Weekly timetable view
- **Room Utilization**: % of time each room is used
- **Instructor Workload**: Courses per instructor, total students

### 10.1.5 Faculty Reports
- **Faculty Directory**: All instructors with contact info
- **Teaching Load**: Credit hours taught per instructor
- **Grade Distribution by Instructor**: Compare grading patterns
- **Course Evaluations**: Student feedback scores

### 10.1.6 Financial Reports
(If integrated with finance system)
- **Tuition Revenue**: By term, by major
- **Payment Status**: Outstanding balances
- **Scholarship Distribution**: By type, by student

---

## 10.2 Analytics Dashboard Metrics

### Real-Time Metrics
- Total active students (live count)
- Current term enrollments (live count)
- Pending approvals count
- Unresolved alerts count
- System health status

### Key Performance Indicators (KPIs)
- **Enrollment Rate**: (Current Enrollment / Total Capacity) × 100
- **Average Class Size**: Total Enrollments / Total Courses
- **Retention Rate**: (Students Returning / Students Previous Year) × 100
- **Graduation Rate**: (Graduated in 4 years / Total Cohort) × 100
- **Average GPA**: Institution-wide
- **Course Completion Rate**: (Courses Passed / Courses Enrolled) × 100

### Trend Analysis
- Enrollment trends (by term, YoY)
- GPA trends (by cohort, by major)
- Graduation trends
- Course demand trends (popular courses over time)

---

## 10.3 Data Visualization

### Chart Types
- **Line Charts**: Trends over time (enrollment, GPA, graduation rate)
- **Bar Charts**: Comparisons (enrollments by department, grades by course)
- **Pie Charts**: Distributions (students by major, grade distribution)
- **Heat Maps**: Schedule conflicts, room utilization by time slot
- **Scatter Plots**: Correlation analysis (GPA vs. credit load)
- **Funnel Charts**: Enrollment pipeline (applicants → admitted → enrolled → graduated)

### Interactive Features
- Drill-down capability (click on chart to see details)
- Filters (by term, department, year level)
- Date range selectors
- Export charts as PNG/SVG

---

# 11. Integration Requirements

## 11.1 External Systems

### 11.1.1 Authentication System (SSO)
- **Integration**: LDAP/Active Directory, SAML 2.0
- **Purpose**: Single Sign-On for admin users
- **Data Flow**: User authentication → Role assignment → Permission check

### 11.1.2 Email System
- **Integration**: SMTP server, API (SendGrid, AWS SES)
- **Purpose**: Send notifications, reports, transcripts
- **Features**: 
  - Transactional emails (enrollment confirmations, grade published)
  - Bulk emails (announcements)
  - Email templates
  - Delivery tracking

### 11.1.3 SMS Gateway
- **Integration**: Twilio, AWS SNS
- **Purpose**: Critical notifications (alerts, 2FA)
- **Use Cases**: Emergency alerts, high-priority reminders

### 11.1.4 Document Storage (Cloud)
- **Integration**: AWS S3, Google Cloud Storage, Azure Blob
- **Purpose**: Store transcripts, uploaded documents, reports
- **Features**:
  - Secure storage with encryption
  - CDN for fast delivery
  - Automatic backup

### 11.1.5 Calendar System
- **Integration**: Google Calendar, Outlook Calendar, iCal
- **Purpose**: Sync academic calendar to personal calendars
- **Features**: Subscribe to calendar feeds, event reminders

### 11.1.6 Learning Management System (LMS)
- **Integration**: Moodle, Canvas, Blackboard (API)
- **Purpose**: Sync course rosters, grades
- **Data Flow**: 
  - SIS → LMS: Course creation, student enrollment
  - LMS → SIS: Final grades import

### 11.1.7 Financial System
- **Integration**: ERP system (SAP, Oracle) API
- **Purpose**: Tuition billing, payment tracking
- **Data Flow**:
  - SIS → Finance: Enrollment changes (for billing)
  - Finance → SIS: Payment status (for holds)

---

## 11.2 API Integrations (Outbound)

### 11.2.1 Third-Party Analytics
- **Integration**: Google Analytics, Mixpanel
- **Purpose**: Track admin usage patterns, optimize UX
- **Data**: Anonymized usage data (page views, feature adoption)

### 11.2.2 Reporting Tools
- **Integration**: Tableau, Power BI, Looker
- **Purpose**: Advanced data visualization and analysis
- **Data Flow**: Export data extracts (CSV, database connection)

### 11.2.3 Background Check Services
- **Integration**: Third-party API (for new student verification)
- **Purpose**: Verify student identity, credentials
- **Data Flow**: SIS → Service: Student info → Service → SIS: Verification result

---

## 11.3 Webhook/Event System

### Event Types
- `student.created`
- `student.updated`
- `student.graduated`
- `enrollment.confirmed`
- `enrollment.dropped`
- `grade.published`
- `course.created`
- `course.cancelled`

### Webhook Payload Example
```json
{
  "event_type": "grade.published",
  "timestamp": "2025-11-19T10:30:00Z",
  "data": {
    "student_id": "122040012",
    "course_code": "CSC3170",
    "grade": "A-",
    "gpa_impact": 3.7
  }
}
```

### Use Cases
- Trigger emails on events
- Update external systems (LMS, finance)
- Sync to data warehouse
- Trigger workflows (e.g., print diploma on graduation)

---

# 12. Non-Functional Requirements

## 12.1 Performance

### Response Time
- **Dashboard load**: < 2 seconds
- **Search queries**: < 2 seconds for 10,000+ records
- **Bulk operations**: Process 1,000 records in < 60 seconds
- **Report generation**: PDF < 10 seconds, Excel < 5 seconds
- **API response**: 95th percentile < 500ms

### Throughput
- **Concurrent users**: Support 100+ simultaneous admin users
- **Peak load**: Handle 500 requests/second during registration period
- **Database queries**: Optimize for <100ms query time

### Scalability
- **Horizontal scaling**: Add web servers as needed
- **Database**: Support 100,000+ students, 10,000+ courses
- **File storage**: Scale to 100TB+ (transcripts, documents)

---

## 12.2 Reliability

### Availability
- **Uptime SLA**: 99.9% (< 8.76 hours downtime/year)
- **Maintenance windows**: Scheduled during low-usage periods
- **Failover**: Automatic failover to backup servers

### Data Integrity
- **ACID compliance**: Database transactions ensure consistency
- **Validation**: Multi-layer validation (frontend, backend, database)
- **Referential integrity**: Foreign key constraints enforced
- **Audit trail**: Complete history of all changes

### Backup & Recovery
- **Backup frequency**: Daily full backup, hourly incremental
- **Backup retention**: 30 days online, 7 years archived
- **Recovery time objective (RTO)**: < 4 hours
- **Recovery point objective (RPO)**: < 1 hour (max data loss)

---

## 12.3 Security

### Data Security
- **Encryption at rest**: AES-256
- **Encryption in transit**: TLS 1.3
- **Database access**: Role-based access, encrypted connections
- **Password storage**: bcrypt hashing with salt

### Application Security
- **Input validation**: Prevent SQL injection, XSS, CSRF
- **Rate limiting**: Prevent brute force attacks
- **Session management**: Secure cookies, HTTPS only
- **File upload**: Virus scanning, file type validation

### Compliance
- **GDPR**: Data protection, right to access/deletion
- **FERPA** (if US students): Student privacy protection
- **SOC 2**: Security controls audit
- **ISO 27001**: Information security management

---

## 12.4 Usability

### User Interface
- **Responsive design**: Works on desktop, tablet, mobile
- **Accessibility**: WCAG 2.1 AA compliance
- **Browser support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Keyboard navigation**: Full keyboard accessibility

### User Experience
- **Intuitive navigation**: Maximum 3 clicks to any feature
- **Consistent UI**: Standard patterns across modules
- **Help documentation**: Context-sensitive help, tooltips
- **Error messages**: Clear, actionable error messages

### Training & Onboarding
- **User guide**: Comprehensive admin manual
- **Video tutorials**: For common tasks
- **In-app tour**: Guided walkthrough for new admins
- **Support**: Help desk, ticketing system

---

## 12.5 Maintainability

### Code Quality
- **Code standards**: Follow industry best practices
- **Documentation**: Inline comments, API documentation
- **Testing**: Unit tests (80%+ coverage), integration tests
- **Code reviews**: All changes reviewed before merge

### Monitoring & Logging
- **Application monitoring**: Track errors, performance
- **System monitoring**: Server health, resource usage
- **Logging**: Centralized logging (ELK stack, Splunk)
- **Alerts**: Real-time alerts for critical issues

### Version Control
- **Git**: Source code version control
- **Branching strategy**: GitFlow (main, develop, feature branches)
- **Release management**: Semantic versioning (v1.0.0)

---

# 13. Success Metrics

## 13.1 Business Metrics

### Operational Efficiency
- **Admin time savings**: 60% reduction in manual tasks
- **Enrollment processing time**: < 5 minutes per student (vs. 15 min manual)
- **Grade processing time**: < 2 hours for 50-student course (vs. 4 hours)
- **Transcript generation**: < 1 minute (vs. 30 min manual)

### Data Quality
- **Data accuracy**: 99.9% (measured by error rate)
- **Duplicate records**: < 0.1%
- **Missing data**: < 1% of required fields

### User Satisfaction
- **Admin satisfaction score**: > 4.0/5.0
- **System ease of use**: > 4.2/5.0
- **Feature adoption rate**: > 80% of admins using key features

---

## 13.2 Technical Metrics

### Performance
- **Page load time**: < 2 seconds (95th percentile)
- **API response time**: < 500ms (95th percentile)
- **Database query time**: < 100ms (average)

### Reliability
- **System uptime**: > 99.9%
- **Mean time between failures (MTBF)**: > 720 hours
- **Mean time to recovery (MTTR)**: < 1 hour

### Security
- **Security incidents**: 0 major breaches
- **Failed login attempts**: < 1% of total logins
- **Data loss incidents**: 0

---

## 13.3 Adoption Metrics

### User Engagement
- **Daily active admins**: > 50% of total admin users
- **Feature usage**: All key features used by > 70% of admins
- **Mobile access**: > 30% of sessions from mobile devices

### Process Automation
- **Auto-approved enrollments**: > 80% of enrollments auto-processed
- **Bulk operations usage**: > 50% of data changes via bulk operations
- **Scheduled reports**: > 20 reports scheduled and auto-delivered

---

# 14. Future Enhancements (Out of Scope for Phase 1)

## Phase 2 Features
- **AI-powered recommendations**: Course recommendations for students
- **Predictive analytics**: Predict at-risk students, enrollment demand
- **Mobile app**: Native iOS/Android admin app
- **Chatbot**: AI assistant for common admin tasks
- **Advanced scheduling**: AI-powered auto-scheduling with optimization
- **Student self-service**: Let students update their own info
- **Parent portal**: Parent access to student records
- **Alumni management**: Track alumni, fundraising

## Phase 3 Features
- **Financial aid integration**: Scholarship management
- **Housing management**: Room assignments
- **Meal plan management**: Dining services integration
- **Event management**: Track campus events, attendance
- **Career services integration**: Job placements, internships
- **Research management**: Track student research projects

---

# 15. Glossary

| Term | Definition |
|------|------------|
| **Academic Standing** | Student's status based on GPA (Good Standing, Probation, Dismissal) |
| **Add/Drop Period** | Time window when students can freely enroll/drop courses |
| **Corequisite** | Course that must be taken concurrently with another course |
| **Credit Hour** | Unit of measurement for course workload (1 credit ≈ 1 hour/week) |
| **Dean's List** | Honor roll for students with high GPA (typically ≥ 3.5) |
| **Degree Audit** | Analysis of student's progress toward degree completion |
| **Enrollment** | Student's registration in a course |
| **GPA** | Grade Point Average (weighted average of grades) |
| **Prerequisite** | Course that must be completed before enrolling in another course |
| **Registrar** | Administrative officer responsible for student records |
| **Transcript** | Official record of student's courses and grades |
| **Waitlist** | Queue for students waiting for space in a full course |
| **Withdrawal** | Dropping a course after add/drop deadline (results in W grade) |

---

# 16. Appendices

## Appendix A: Sample CSV Templates

### Student Import Template
```csv
student_id,full_name,email,phone,date_of_birth,nationality,major_code,year,college,admission_date
122040999,John Doe,john.doe@cuhk.edu.cn,+86-138-0000-0000,2005-01-15,Chinese,CS,1,Diligentia,2025-09-01
```

### Course Import Template
```csv
course_code,course_name,department,credits,category,semester,year,max_capacity,instructor_email,day1,time1,day2,time2,location
CSC4999,Special Topics in AI,SDS,3,MAJOR_ELECTIVE,SPRING,2026,40,prof.wang@cuhk.edu.cn,MONDAY,10:30-11:50,WEDNESDAY,10:30-11:50,AI-301
```

### Grade Import Template
```csv
student_id,course_code,letter_grade,numeric_grade
122040012,CSC3170,A-,88.5
122040013,CSC3170,B+,85.0
```

---

## Appendix B: Error Codes

| Code | Message | HTTP Status |
|------|---------|-------------|
| `AUTH_001` | Invalid credentials | 401 |
| `AUTH_002` | Session expired | 401 |
| `AUTH_003` | Insufficient permissions | 403 |
| `VAL_001` | Required field missing | 400 |
| `VAL_002` | Invalid email format | 400 |
| `VAL_003` | Invalid date format | 400 |
| `BIZ_001` | Student already enrolled | 409 |
| `BIZ_002` | Course at capacity | 409 |
| `BIZ_003` | Prerequisite not met | 400 |
| `BIZ_004` | Time conflict detected | 409 |
| `BIZ_005` | Credit limit exceeded | 400 |
| `SYS_001` | Database connection error | 500 |
| `SYS_002` | External service unavailable | 503 |

---

## Appendix C: Sample Permissions Configuration

```json
{
  "role": "Department Administrator",
  "department": "SDS",
  "permissions": {
    "students": {
      "create": true,
      "read": true,
      "update": true,
      "delete": false,
      "filters": {
        "major": ["Computer Science", "Data Science"]
      }
    },
    "courses": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true,
      "filters": {
        "department": ["SDS"]
      }
    },
    "enrollments": {
      "create": true,
      "read": true,
      "update": true,
      "approve": true,
      "reject": true,
      "filters": {
        "course_department": ["SDS"]
      }
    },
    "grades": {
      "create": false,
      "read": true,
      "approve": true,
      "publish": false,
      "filters": {
        "course_department": ["SDS"]
      }
    },
    "transcripts": {
      "generate_unofficial": true,
      "generate_official": false
    },
    "reports": {
      "create": true,
      "read": true,
      "export": true,
      "filters": {
        "department": ["SDS"]
      }
    }
  },
  "restrictions": {
    "max_bulk_operations": 500,
    "can_modify_past_terms": false,
    "can_override_validations": false
  }
}
```

---

