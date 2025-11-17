import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { CourseCard } from '../components/CourseCard';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  department: string;
  maxCapacity: number;
  currentEnrollment: number;
  description: string | null;
  prerequisites: string | null;
  instructor: {
    fullName: string;
  } | null;
  timeSlots: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    location: string;
  }>;
}

export function CourseList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/courses');
      // Transform backend data (snake_case) to frontend format (camelCase)
      return response.data.data.map((course: any) => ({
        id: course.id,
        courseCode: course.course_code,
        courseName: course.course_name,
        credits: course.credits,
        department: course.department,
        maxCapacity: course.max_capacity,
        currentEnrollment: course.current_enrollment,
        description: course.description,
        prerequisites: course.prerequisites,
        instructor: course.users ? {
          fullName: course.users.full_name
        } : null,
        timeSlots: (course.time_slots || []).map((slot: any) => ({
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
          location: slot.location || ''
        }))
      }));
    },
  });

  const { data: departments } = useQuery<string[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/courses/departments');
      return response.data.data;
    },
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesDepartment =
      selectedDepartment === '' || course.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Group courses by department
  const coursesByDepartment = filteredCourses?.reduce((acc, course) => {
    const dept = course.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const toggleDepartment = (dept: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(dept)) {
      newExpanded.delete(dept);
    } else {
      newExpanded.add(dept);
    }
    setExpandedDepartments(newExpanded);
  };

  const expandAll = () => {
    if (coursesByDepartment) {
      setExpandedDepartments(new Set(Object.keys(coursesByDepartment)));
    }
  };

  const collapseAll = () => {
    setExpandedDepartments(new Set());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Browse Courses</h2>
          <p className="text-muted-foreground">Fall 2025 Course Offerings</p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
                Search Courses
              </label>
              <input
                type="text"
                id="search"
                className="input"
                placeholder="Search by course code, name, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">
                Department
              </label>
              <select
                id="department"
                className="input"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments?.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCourses?.length || 0} courses across {Object.keys(coursesByDepartment || {}).length} departments
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Expand All
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={collapseAll}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grouped by Department */}
        {coursesByDepartment && Object.keys(coursesByDepartment).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(coursesByDepartment)
              .sort(([deptA], [deptB]) => deptA.localeCompare(deptB))
              .map(([department, deptCourses]) => {
                const isExpanded = expandedDepartments.has(department);
                return (
                  <div key={department} className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
                    {/* Department Header */}
                    <button
                      onClick={() => toggleDepartment(department)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-semibold">
                          {department.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-foreground">{department}</h3>
                          <p className="text-sm text-muted-foreground">{deptCourses.length} course{deptCourses.length !== 1 ? 's' : ''} available</p>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Department Courses */}
                    {isExpanded && (
                      <div className="px-6 py-4 bg-muted/50 border-t border-border">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {deptCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg shadow-md">
            <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
