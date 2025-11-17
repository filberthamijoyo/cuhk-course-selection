import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { academicAPI, campusAPI, enrollmentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  BarChart3,
  UserCircle,
  Target,
  Calendar,
  Bell,
  ChevronRight,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();

  // Get current enrollments for weekly schedule
  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentAPI.getMyEnrollments().then(res => res.data.data),
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => campusAPI.getAnnouncements().then(res => res.data.data),
  });

  // Build weekly schedule from enrollments
  const buildWeeklySchedule = () => {
    if (!enrollments) return {};

    const schedule: Record<string, any[]> = {
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': [],
    };

    enrollments.forEach((enrollment: any) => {
      if (enrollment.courses?.time_slots) {
        enrollment.courses.time_slots.forEach((slot: any) => {
          const day = slot.day_of_week;
          if (schedule[day]) {
            schedule[day].push({
              courseCode: enrollment.courses.course_code,
              courseName: enrollment.courses.course_name,
              startTime: slot.start_time,
              endTime: slot.end_time,
              location: slot.location,
              instructor: enrollment.courses.users?.full_name,
            });
          }
        });
      }
    });

    // Sort each day by start time
    Object.keys(schedule).forEach(day => {
      schedule[day].sort((a, b) => {
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
    });

    return schedule;
  };

  const weeklySchedule = buildWeeklySchedule();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const quickAccessLinks = [
    { label: 'My Enrollments', icon: BookOpen, link: '/enrollments', color: 'from-blue-500 to-cyan-500' },
    { label: 'My Grades', icon: BarChart3, link: '/academic/grades', color: 'from-green-500 to-emerald-500' },
    { label: 'Degree Planning', icon: Target, link: '/planning', color: 'from-purple-500 to-pink-500' },
    { label: 'Transcript', icon: FileText, link: '/academic/transcript', color: 'from-orange-500 to-red-500' },
    { label: 'Personal Info', icon: UserCircle, link: '/personal', color: 'from-indigo-500 to-blue-500' },
    { label: 'Academic Calendar', icon: Calendar, link: '/academic-calendar', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickAccessLinks.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  This Week's Schedule
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(weeklySchedule).map(([day, classes]: [string, any[]]) => {
                    const isToday = day === today;
                    return (
                      <div key={day} className={`${isToday ? 'ring-2 ring-primary rounded-lg' : ''}`}>
                        <div className={`text-center pb-2 mb-3 border-b-2 ${isToday ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}>
                          <div className={`text-xs font-semibold uppercase ${isToday ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                            {day.substring(0, 3)}
                          </div>
                          {isToday && (
                            <div className="text-xs text-primary font-medium mt-1">Today</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {classes.length > 0 ? (
                            classes.map((cls, idx) => (
                              <div
                                key={idx}
                                className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-2 border border-primary/20"
                              >
                                <div className="text-xs font-semibold text-primary mb-1">
                                  {cls.courseCode}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {cls.startTime.substring(0, 5)}
                                </div>
                                {cls.location && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {cls.location}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
                              No classes
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Academic Calendar */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Academic Calendar
                </h2>
                <Link to="/academic-calendar" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Hardcoded important dates for Fall 2024 */}
                  <div className="flex items-start space-x-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-2xl font-bold text-primary">15</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Nov</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Add/Drop Deadline</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last day to add or drop courses</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-2xl font-bold text-purple-600">10</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Dec</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Final Exams Begin</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fall 2024 final examination period</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-2xl font-bold text-green-600">20</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Dec</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Fall Semester Ends</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">End of Fall 2024 semester</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News & Announcements */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary" />
                  News & Announcements
                </h2>
                <Link to="/campus" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="p-6">
                {announcements && announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.slice(0, 5).map((announcement: any) => (
                      <div key={announcement.id} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            announcement.type === 'URGENT'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                              : announcement.type === 'ACADEMIC'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {announcement.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {announcement.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(announcement.posted_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No announcements</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
