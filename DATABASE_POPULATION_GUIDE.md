# Database Population Guide for CUHK Course Selection System

This document lists all tables that need to be populated in your Supabase database, along with their required fields and relationships. Use this guide to work with Claude to generate SQL INSERT statements.

## Table Population Order (Important!)

Populate tables in this order to respect foreign key constraints:

1. **users** (base table - no dependencies)
2. **majors** (base table - no dependencies)
3. **requirements** (depends on majors)
4. **students** (depends on users, majors)
5. **faculty** (depends on users)
6. **personal_info** (depends on users)
7. **financial_accounts** (depends on users)
8. **courses** (depends on users/instructors)
9. **time_slots** (depends on courses)
10. **enrollments** (depends on users, courses)
11. **grades** (depends on enrollments)
12. **transcripts** (depends on users)
13. **charges** (depends on financial_accounts)
14. **payments** (depends on financial_accounts)
15. **applications** (depends on users)
16. **announcements** (depends on users)
17. **events** (no dependencies)
18. **course_materials** (depends on courses, users)
19. **attendance** (depends on enrollments, users)
20. **audit_logs** (depends on users)
21. **Term** (no dependencies)
22. **academic_events** (no dependencies)
23. **course_add_drop_requests** (depends on users, courses)
24. **course_evaluations** (depends on users, courses)
25. **enrollment_rules** (no dependencies)
26. **major_change_requests** (depends on users)

---

## 1. users

**Purpose**: Base user accounts for all system users (students, instructors, administrators)

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_identifier` (String, unique) - e.g., '120090001', 'inst001', 'admin001'
- `email` (String, unique) - e.g., 'alice.wang@link.cuhk.edu.cn'
- `password_hash` (String) - bcrypt hashed password
- `full_name` (String) - e.g., 'Alice Wang'
- `role` (Enum: STUDENT, INSTRUCTOR, ADMINISTRATOR)
- `created_at` (DateTime, default: now())
- `updated_at` (DateTime)

**Optional Fields**:
- `major` (String?) - for students
- `year_level` (Int?) - for students
- `department` (String?) - for instructors/admins

**Sample Data Needed**:
- At least 1 ADMINISTRATOR
- At least 3-5 INSTRUCTOR users
- At least 10-20 STUDENT users

**Password**: Use bcrypt hash of a test password (e.g., 'Password123!')

---

## 2. majors

**Purpose**: Academic majors/programs offered

**Required Fields**:
- `id` (auto-increment, primary key)
- `code` (String, unique) - e.g., 'CS', 'DS', 'EE', 'MATH'
- `name` (String) - e.g., 'Computer Science'
- `department` (String) - e.g., 'School of Data Science'
- `degree` (Enum: BS, BA, MS, MA, PHD)
- `total_credits` (Int) - e.g., 120
- `description` (String?) - optional

**Sample Data Needed**:
- Computer Science (CS)
- Data Science (DS)
- Electronic Engineering (EE)
- Mathematics (MATH)
- Statistics (STAT)
- Information Engineering (IE)

---

## 3. requirements

**Purpose**: Major requirements (core courses, electives, etc.)

**Required Fields**:
- `id` (auto-increment, primary key)
- `major_id` (Int, foreign key → majors.id)
- `category` (String) - e.g., 'Core Courses', 'Elective Courses', 'General Education'
- `name` (String) - e.g., 'Programming Fundamentals'
- `credits` (Int) - e.g., 18
- `courses` (Json) - array of course codes, e.g., ['CSC1001', 'CSC1002']
- `description` (String?) - optional

**Sample Data Needed**:
- Core requirements for each major
- Elective requirements
- General education requirements

---

## 4. students

**Purpose**: Student-specific information

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, unique, foreign key → users.id)
- `student_id` (String, unique) - e.g., '120090001'
- `year` (Int) - 1, 2, 3, or 4
- `admission_date` (DateTime)
- `status` (Enum: ACTIVE, LEAVE_OF_ABSENCE, WITHDRAWN, SUSPENDED, GRADUATED) - default: ACTIVE

**Optional Fields**:
- `major_id` (Int?, foreign key → majors.id)
- `minor_id` (Int?, foreign key → majors.id)
- `advisor_id` (Int?, foreign key → users.id) - instructor user_id
- `expected_grad` (DateTime?)

**Sample Data Needed**:
- One record per student user
- Mix of years (1-4)
- Different majors
- Some with advisors assigned

---

## 5. faculty

**Purpose**: Faculty/instructor information

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, unique, foreign key → users.id)
- `employee_id` (String, unique) - e.g., 'INST001'
- `title` (String) - e.g., 'Associate Professor', 'Professor', 'Assistant Professor'
- `department` (String) - e.g., 'School of Data Science'

**Optional Fields**:
- `office` (String?)
- `office_hours` (Json?) - array of {day, startTime, endTime}
- `research_areas` (Json?) - array of strings
- `bio` (String?)
- `cv_url` (String?)

**Sample Data Needed**:
- One record per instructor user
- Various titles and departments

---

## 6. personal_info

**Purpose**: Personal information for users (mainly students)

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, unique, foreign key → users.id)
- `updated_at` (DateTime)

**Optional Fields** (all nullable):
- `phone_number` (String?)
- `alternate_phone` (String?)
- `permanent_address` (String?)
- `mailing_address` (String?)
- `city` (String?)
- `state` (String?)
- `postal_code` (String?)
- `country` (String?, default: 'China')
- `emergency_name` (String?)
- `emergency_relation` (String?)
- `emergency_phone` (String?)
- `emergency_email` (String?)
- `date_of_birth` (DateTime?)
- `gender` (String?)
- `nationality` (String?)
- `id_number` (String?)
- `high_school` (String?)
- `high_school_grad` (DateTime?)

**Sample Data Needed**:
- Personal info for student users
- Emergency contacts
- Address information

---

## 7. financial_accounts

**Purpose**: Student financial accounts

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, unique, foreign key → users.id)
- `balance` (Float, default: 0) - negative = owes money
- `last_updated` (DateTime)

**Optional Fields**:
- `tuition_due` (Float, default: 0)
- `housing_due` (Float, default: 0)
- `other_due` (Float, default: 0)

**Sample Data Needed**:
- One account per student user
- Various balances (some with outstanding fees)

---

## 8. courses

**Purpose**: Course offerings

**Required Fields**:
- `id` (auto-increment, primary key)
- `course_code` (String, unique) - e.g., 'CSC3170', 'DDA3020'
- `course_name` (String) - e.g., 'Database Systems'
- `department` (String) - e.g., 'SDS', 'SSE'
- `credits` (Int) - e.g., 3
- `max_capacity` (Int) - e.g., 80
- `semester` (Enum: FALL, SPRING, SUMMER)
- `year` (Int) - e.g., 2024
- `status` (Enum: ACTIVE, INACTIVE, FULL, default: ACTIVE)
- `version` (Int, default: 0) - for optimistic locking
- `created_at` (DateTime, default: now())
- `updated_at` (DateTime)

**Optional Fields**:
- `current_enrollment` (Int, default: 0)
- `description` (String?)
- `prerequisites` (String?) - comma-separated course codes, e.g., 'CSC1001, STA2001'
- `instructor_id` (Int?, foreign key → users.id)

**Sample Data Needed**:
- Multiple courses across different departments
- Mix of semesters (FALL 2024, SPRING 2025)
- Various capacities
- Some with prerequisites
- Different instructors

---

## 9. time_slots

**Purpose**: Course schedule/time slots

**Required Fields**:
- `id` (auto-increment, primary key)
- `course_id` (Int, foreign key → courses.id)
- `day_of_week` (Enum: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY)
- `start_time` (String) - format: 'HH:MM', e.g., '10:00', '14:30'
- `end_time` (String) - format: 'HH:MM', e.g., '11:50', '15:50'

**Optional Fields**:
- `location` (String?) - e.g., 'TD301', 'LSB LT1'

**Sample Data Needed**:
- Multiple time slots per course (typically 2-3 per week)
- Various days and times
- Different locations

---

## 10. enrollments

**Purpose**: Student course enrollments

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, foreign key → users.id)
- `course_id` (Int, foreign key → courses.id)
- `status` (Enum: PENDING, CONFIRMED, WAITLISTED, DROPPED, REJECTED, default: PENDING)
- `enrolled_at` (DateTime, default: now())
- `updated_at` (DateTime)

**Optional Fields**:
- `waitlist_position` (Int?) - for WAITLISTED status

**Unique Constraint**: (user_id, course_id) - one enrollment per student per course

**Sample Data Needed**:
- Multiple enrollments per student
- Mix of CONFIRMED, PENDING, WAITLISTED statuses
- Some past enrollments (different semester/year)
- Some current enrollments

---

## 11. grades

**Purpose**: Grades for enrollments

**Required Fields**:
- `id` (auto-increment, primary key)
- `enrollment_id` (Int, unique, foreign key → enrollments.id)
- `status` (Enum: IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED, default: IN_PROGRESS)

**Optional Fields**:
- `letter_grade` (String?) - e.g., 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'
- `numeric_grade` (Float?) - e.g., 92.5
- `grade_points` (Float?) - e.g., 4.0, 3.7, 3.3
- `submitted_by` (Int?, foreign key → users.id) - instructor
- `submitted_at` (DateTime?)
- `approved_by` (Int?, foreign key → users.id) - admin
- `approved_at` (DateTime?)
- `comments` (String?)

**Sample Data Needed**:
- Grades for past enrollments (PUBLISHED status)
- In-progress grades for current enrollments (IN_PROGRESS status)
- Some with letter and numeric grades

---

## 12. transcripts

**Purpose**: Academic transcripts per semester

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, foreign key → users.id)
- `semester` (Enum: FALL, SPRING, SUMMER)
- `year` (Int)
- `gpa` (Float) - cumulative GPA
- `term_gpa` (Float) - semester GPA
- `total_credits` (Float)
- `earned_credits` (Float)
- `quality_points` (Float)
- `academic_standing` (String) - e.g., 'Good Standing'
- `generated_at` (DateTime, default: now())

**Unique Constraint**: (user_id, semester, year)

**Sample Data Needed**:
- Transcripts for past semesters
- Various GPAs and credit totals

---

## 13. charges

**Purpose**: Financial charges (tuition, housing, fees)

**Required Fields**:
- `id` (auto-increment, primary key)
- `account_id` (Int, foreign key → financial_accounts.id)
- `type` (Enum: TUITION, HOUSING, MEAL_PLAN, ACTIVITY_FEE, TECHNOLOGY_FEE, LIBRARY_FEE, OTHER)
- `description` (String) - e.g., 'Fall 2024 Tuition'
- `amount` (Float)
- `due_date` (DateTime)
- `created_at` (DateTime, default: now())

**Optional Fields**:
- `semester` (Enum: FALL, SPRING, SUMMER?)
- `year` (Int?)
- `is_paid` (Boolean, default: false)

**Sample Data Needed**:
- Tuition charges per semester
- Housing charges
- Various fees
- Mix of paid and unpaid

---

## 14. payments

**Purpose**: Payment records

**Required Fields**:
- `id` (auto-increment, primary key)
- `account_id` (Int, foreign key → financial_accounts.id)
- `amount` (Float)
- `method` (Enum: BANK_TRANSFER, CREDIT_CARD, WECHAT_PAY, ALIPAY, CASH, CHECK)
- `reference_number` (String) - transaction reference
- `status` (Enum: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, default: PENDING)
- `created_at` (DateTime, default: now())

**Optional Fields**:
- `processed_at` (DateTime?)

**Sample Data Needed**:
- Various payment methods
- Mix of statuses (mostly COMPLETED)
- Different amounts

---

## 15. applications

**Purpose**: Student applications (leave of absence, major change, etc.)

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, foreign key → users.id)
- `type` (Enum: LEAVE_OF_ABSENCE, WITHDRAWAL, MAJOR_CHANGE, MINOR_DECLARATION, CREDIT_TRANSFER, OVERLOAD_REQUEST, GRADE_APPEAL, READMISSION, GRADUATION_APPLICATION)
- `status` (Enum: PENDING, UNDER_REVIEW, APPROVED, DENIED, WITHDRAWN, default: PENDING)
- `reason` (String)
- `requested_date` (DateTime, default: now())

**Optional Fields**:
- `semester` (Enum: FALL, SPRING, SUMMER?)
- `year` (Int?)
- `supporting_docs` (Json?)
- `reviewed_by` (Int?, foreign key → users.id)
- `reviewed_at` (DateTime?)
- `review_notes` (String?)
- `decision` (String?)

**Sample Data Needed**:
- Various application types
- Mix of statuses
- Some reviewed, some pending

---

## 16. announcements

**Purpose**: System announcements

**Required Fields**:
- `id` (auto-increment, primary key)
- `title` (String)
- `content` (String)
- `type` (Enum: ACADEMIC, ADMINISTRATIVE, EVENT, EMERGENCY, GENERAL)
- `priority` (Enum: LOW, NORMAL, HIGH, URGENT, default: NORMAL)
- `target_audience` (Json) - array of strings, e.g., ['STUDENT'], ['ALL']
- `publish_date` (DateTime, default: now())
- `is_active` (Boolean, default: true)
- `created_by` (Int, foreign key → users.id)

**Optional Fields**:
- `expiry_date` (DateTime?)
- `attachments` (Json?)

**Sample Data Needed**:
- Various announcement types
- Different priorities
- Mix of active and expired
- Different target audiences

---

## 17. events

**Purpose**: Campus events

**Required Fields**:
- `id` (auto-increment, primary key)
- `title` (String)
- `description` (String)
- `location` (String)
- `start_time` (DateTime)
- `end_time` (DateTime)
- `category` (Enum: ACADEMIC, CULTURAL, SPORTS, WORKSHOP, SOCIAL, CAREER, OTHER)
- `organizer` (String)
- `registered` (Int, default: 0)
- `is_public` (Boolean, default: true)
- `created_at` (DateTime, default: now())

**Optional Fields**:
- `registration_url` (String?)
- `capacity` (Int?)

**Sample Data Needed**:
- Various event categories
- Future and past events
- Different capacities

---

## 18. course_materials

**Purpose**: Course materials (syllabi, lecture notes, assignments)

**Required Fields**:
- `id` (auto-increment, primary key)
- `course_id` (Int, foreign key → courses.id)
- `title` (String)
- `type` (Enum: SYLLABUS, LECTURE_NOTES, ASSIGNMENT, READING, EXAM, SOLUTION, RECORDING, OTHER)
- `file_url` (String) - path to file
- `file_name` (String)
- `uploaded_by` (Int, foreign key → users.id)
- `uploaded_at` (DateTime, default: now())
- `is_visible` (Boolean, default: true)

**Optional Fields**:
- `description` (String?)
- `file_size` (Int?)

**Sample Data Needed**:
- Materials for various courses
- Different types (syllabi, notes, assignments)
- Mix of visible and hidden

---

## 19. attendance

**Purpose**: Attendance records

**Required Fields**:
- `id` (auto-increment, primary key)
- `enrollment_id` (Int, foreign key → enrollments.id)
- `date` (DateTime)
- `status` (Enum: PRESENT, ABSENT, LATE, EXCUSED)
- `marked_by` (Int, foreign key → users.id)

**Optional Fields**:
- `notes` (String?)

**Unique Constraint**: (enrollment_id, date)

**Sample Data Needed**:
- Attendance records for current enrollments
- Mix of statuses
- Various dates

---

## 20. audit_logs

**Purpose**: System audit trail

**Required Fields**:
- `id` (auto-increment, primary key)
- `user_id` (Int, foreign key → users.id)
- `action` (String) - e.g., 'ENROLL', 'DROP', 'WAITLISTED', 'ENROLL_REJECTED'
- `entity_type` (String) - e.g., 'enrollment', 'course', 'user'
- `entity_id` (Int)
- `timestamp` (DateTime, default: now())

**Optional Fields**:
- `changes` (Json?) - additional data
- `ip_address` (String?)

**Sample Data Needed**:
- Logs for various actions
- Different entity types
- Historical records

---

## 21. Term

**Purpose**: Academic terms

**Required Fields**:
- `id` (auto-increment, primary key)
- `name` (String) - e.g., 'Fall 2024'
- `code` (String, unique) - e.g., '2024F'
- `type` (String) - e.g., 'Regular'
- `status` (String) - e.g., 'ACTIVE', 'INACTIVE'
- `startDate` (DateTime)
- `endDate` (DateTime)
- `enrollmentStart` (DateTime)
- `enrollmentEnd` (DateTime)

**Optional Fields**:
- `isActive` (Boolean?, default: false)
- `createdAt` (DateTime?, default: now())

**Sample Data Needed**:
- Current term (Fall 2024)
- Past terms
- Future terms

---

## 22. academic_events

**Purpose**: Academic calendar events

**Required Fields**:
- `id` (auto-increment, primary key)
- `event_type` (String) - e.g., 'Add/Drop Period', 'Final Exams', 'Holiday'
- `term` (String) - e.g., 'Fall'
- `year` (Int)
- `start_date` (DateTime)
- `name` (String)
- `created_at` (DateTime?, default: now())

**Optional Fields**:
- `end_date` (DateTime?)
- `description` (String?)

**Sample Data Needed**:
- Add/drop periods
- Exam periods
- Holidays
- Important dates

---

## 23. course_add_drop_requests

**Purpose**: Course add/drop requests

**Required Fields**:
- `id` (auto-increment, primary key)
- `request_type` (String) - 'ADD' or 'DROP'
- `status` (String, default: 'PENDING') - 'PENDING', 'APPROVED', 'REJECTED'
- `request_date` (DateTime?, default: now())
- `created_at` (DateTime?, default: now())

**Optional Fields**:
- `student_id` (Int?, foreign key → users.id)
- `course_id` (Int?, foreign key → courses.id)
- `reason` (String?)
- `approved_by` (Int?, foreign key → users.id)
- `approved_date` (DateTime?)
- `rejection_reason` (String?)
- `is_late_request` (Boolean?, default: false)

**Sample Data Needed**:
- Add requests
- Drop requests
- Mix of statuses

---

## 24. course_evaluations

**Purpose**: Course evaluations/ratings

**Required Fields**:
- `id` (auto-increment, primary key)

**Optional Fields** (all nullable):
- `student_id` (Int?, foreign key → users.id)
- `course_id` (Int?, foreign key → courses.id)
- `term` (String?)
- `year` (Int?)
- `overall_rating` (Int?) - 1-5 scale
- `instructor_rating` (Int?) - 1-5 scale
- `course_content_rating` (Int?) - 1-5 scale
- `workload_rating` (Int?) - 1-5 scale
- `comments` (String?)
- `is_anonymous` (Boolean?, default: true)
- `submitted_at` (DateTime?, default: now())
- `created_at` (DateTime?, default: now())

**Unique Constraint**: (student_id, course_id, term, year)

**Sample Data Needed**:
- Evaluations for past courses
- Various ratings
- Some with comments

---

## 25. enrollment_rules

**Purpose**: Enrollment rules and policies

**Required Fields**:
- `id` (auto-increment, primary key)
- `rule_type` (String) - e.g., 'MAX_CREDITS', 'MIN_GPA', 'PREREQUISITE_REQUIRED'
- `value` (Int)
- `created_at` (DateTime?, default: now())

**Optional Fields**:
- `description` (String?)
- `effective_date` (DateTime?)

**Sample Data Needed**:
- Max credits per semester (e.g., 18)
- Minimum GPA requirements
- Other enrollment rules

---

## 26. major_change_requests

**Purpose**: Major change requests

**Required Fields**:
- `id` (auto-increment, primary key)
- `request_date` (DateTime?, default: now())
- `status` (String?, default: 'PENDING')
- `created_at` (DateTime?, default: now())

**Optional Fields** (all nullable):
- `student_id` (Int?, foreign key → users.id)
- `current_major` (String?)
- `requested_major` (String?)
- `current_school` (String?)
- `requested_school` (String?)
- `gpa` (Decimal?)
- `units_completed` (Int?)
- `supporting_documents` (String?)
- `approval_decision` (String?)
- `decision_date` (DateTime?)

**Sample Data Needed**:
- Various major change requests
- Mix of statuses
- Different majors

---

## Important Notes for SQL Generation

1. **Password Hashing**: Use bcrypt to hash passwords. In SQL, you'll need to insert pre-hashed values. The seed file shows using `$2b$10$...` format.

2. **Enum Values**: Use the exact enum values as shown (e.g., 'STUDENT', 'INSTRUCTOR', 'ADMINISTRATOR' for Role).

3. **Date Formats**: Use ISO 8601 format: 'YYYY-MM-DD' for dates, 'YYYY-MM-DD HH:MM:SS' for timestamps.

4. **JSON Fields**: For JSON fields, use valid JSON strings, e.g., `'["STUDENT"]'` or `'{"day": "MONDAY", "startTime": "14:00", "endTime": "16:00"}'`.

5. **Foreign Keys**: Ensure referenced IDs exist before inserting records with foreign keys.

6. **Unique Constraints**: Be careful with unique fields (user_identifier, email, course_code, etc.).

7. **Default Values**: Many fields have defaults, but it's safer to specify them explicitly.

8. **Time Format**: For time_slots, use 'HH:MM' format (e.g., '10:00', '14:30').

---

## Recommended Data Volume

- **Users**: 20-30 (mix of students, instructors, admin)
- **Majors**: 4-6
- **Courses**: 15-25 (across multiple semesters)
- **Enrollments**: 30-50 (mix of current and past)
- **Time Slots**: 2-3 per course
- **Grades**: For all past enrollments
- **Financial Accounts**: One per student
- **Charges**: 2-3 per student account
- **Announcements**: 5-10
- **Events**: 5-10
- **Course Materials**: 2-5 per course

---

## Next Steps

1. Start with the base tables (users, majors)
2. Work through dependencies in order
3. Test each section before moving to the next
4. Verify foreign key relationships
5. Check unique constraints are satisfied

Good luck with your database population! 🚀

