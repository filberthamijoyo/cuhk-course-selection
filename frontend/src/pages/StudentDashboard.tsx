import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { academicAPI, financialAPI, planningAPI, campusAPI } from '../services/api';
import { academicCalendarService } from '../services/academicCalendarService';
import { courseEvaluationService } from '../services/courseEvaluationService';
import { addDropService } from '../services/addDropService';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  BookOpen,
  BarChart3,
  CreditCard,
  UserCircle,
  Target,
  Mail,
  Info,
  Calendar,
  Edit3,
  RotateCcw,
  Star,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { cn } from '../lib/utils';

export function StudentDashboard() {
  const { user } = useAuth();
  const { data: gpaData } = useQuery({
    queryKey: ['gpa'],
    queryFn: () => academicAPI.getGPA().then(res => res.data.data),
  });

  const { data: financialAccount } = useQuery({
    queryKey: ['financial-account'],
    queryFn: () => financialAPI.getAccount().then(res => res.data.data),
  });

  const { data: progress } = useQuery({
    queryKey: ['degree-progress'],
    queryFn: () => planningAPI.getProgress().then(res => res.data.data),
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => campusAPI.getAnnouncements().then(res => res.data.data),
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => academicCalendarService.getUpcomingEvents(),
    enabled: !!user,
  });

  const { data: pendingEvaluations } = useQuery({
    queryKey: ['pending-evaluations', user?.id],
    queryFn: () => courseEvaluationService.getPendingEvaluations(user!.id),
    enabled: !!user,
  });

  // const { data: myAddDropRequests } = useQuery({
  //   queryKey: ['my-add-drop-requests', user?.id],
  //   queryFn: () => addDropService.getMyRequests(),
  //   enabled: !!user,
  // });

  const { data: addDropStatus } = useQuery({
    queryKey: ['add-drop-status'],
    queryFn: () => academicCalendarService.getAddDropStatus(),
  });

  const quickStats = [
    {
      label: 'Cumulative GPA',
      value: gpaData ? gpaData.cumulativeGPA.toFixed(2) : '—',
      subtitle: gpaData?.academicStanding || 'Loading...',
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Credits Earned',
      value: progress ? progress.totalCreditsEarned : '—',
      subtitle: `of ${progress?.totalCreditsRequired || 120} required`,
      icon: BookOpen,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Account Balance',
      value: financialAccount ? `¥${financialAccount.balance.toLocaleString()}` : '—',
      subtitle: financialAccount && financialAccount.balance < 0 ? 'Payment Due' : 'Current',
      icon: CreditCard,
      color: financialAccount && financialAccount.balance < 0 ? 'text-destructive' : 'text-foreground',
      bgColor: financialAccount && financialAccount.balance < 0 ? 'bg-destructive/10' : 'bg-muted',
    },
  ];

  const modules = [
    {
      title: 'Course Search',
      description: 'Browse and search available courses',
      icon: BookOpen,
      link: '/courses',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'My Enrollments',
      description: 'View your enrolled courses',
      icon: Edit3,
      link: '/enrollments',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'My Grades',
      description: 'View grades and GPA',
      icon: BarChart3,
      link: '/academic/grades',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      stat: gpaData && `${gpaData.cumulativeGPA.toFixed(2)} GPA`,
    },
    {
      title: 'Transcript',
      description: 'Official academic transcript',
      icon: UserCircle,
      link: '/academic/transcript',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      title: 'Financial Info',
      description: 'Account balance and payments',
      icon: CreditCard,
      link: '/financial',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      stat: financialAccount && `¥${financialAccount.balance.toLocaleString()}`,
      alert: financialAccount && financialAccount.balance < 0,
    },
    {
      title: 'Degree Planning',
      description: 'Track your degree progress',
      icon: Target,
      link: '/planning',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
      stat: progress && `${progress.percentageComplete.toFixed(0)}% Complete`,
    },
    {
      title: 'Academic Calendar',
      description: 'Important dates and events',
      icon: Calendar,
      link: '/academic-calendar',
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    },
    {
      title: 'Add/Drop Courses',
      description: 'Manage course registration',
      icon: RotateCcw,
      link: '/add-drop',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      stat: addDropStatus?.isOpen ? 'OPEN' : 'CLOSED',
      alert: addDropStatus?.isOpen,
    },
    {
      title: 'Course Evaluations',
      description: 'Evaluate your courses',
      icon: Star,
      link: '/evaluations',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      stat: pendingEvaluations && pendingEvaluations.length > 0 ? `${pendingEvaluations.length} pending` : undefined,
      alert: pendingEvaluations && pendingEvaluations.length > 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.fullName?.split(' ')[0] || user?.fullName}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's an overview of your academic journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={cn("mt-2 text-3xl font-bold", stat.color)}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts and Notifications */}
      <div className="space-y-4">
        {/* Add/Drop Period Alert */}
        {addDropStatus?.isOpen && (
          <Card className="border-success bg-success/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Add/Drop Period is Open</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You can add or drop courses{' '}
                    {addDropStatus.period?.end_date && `until ${new Date(addDropStatus.period.end_date).toLocaleDateString()}`}
                  </p>
                  <Link to="/add-drop" className="mt-3 inline-block">
                    <Button size="sm" variant="outline">
                      Go to Add/Drop <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Evaluations Alert */}
        {pendingEvaluations && pendingEvaluations.length > 0 && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Pending Course Evaluations</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You have {pendingEvaluations.length} course{pendingEvaluations.length !== 1 ? 's' : ''} waiting for evaluation.
                    Your feedback helps improve education quality.
                  </p>
                  <Link to="/evaluations" className="mt-3 inline-block">
                    <Button size="sm" variant="outline">
                      Complete Evaluations <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Upcoming Academic Events</h3>
                  <p className="mt-1 text-sm font-medium text-foreground">{upcomingEvents[0].name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(upcomingEvents[0].start_date).toLocaleDateString()} - {upcomingEvents[0].event_type}
                  </p>
                  {upcomingEvents.length > 1 && (
                    <p className="mt-1 text-sm text-muted-foreground">+ {upcomingEvents.length - 1} more upcoming events</p>
                  )}
                  <Link to="/academic-calendar" className="mt-3 inline-block">
                    <Button size="sm" variant="outline">
                      View Calendar <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Latest Announcement */}
        {announcements && announcements.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Latest Announcement</h3>
                  <p className="mt-1 text-sm font-medium text-foreground">{announcements[0].title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcements[0].content}
                  </p>
                  <Link to="/campus" className="mt-3 inline-block">
                    <Button size="sm" variant="ghost">
                      View All Announcements <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Access Modules */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.title} to={module.link}>
                <Card hover className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn("p-2.5 rounded-lg", module.bgColor)}>
                        <Icon className={cn("h-5 w-5", module.color)} />
                      </div>
                      {module.stat && (
                        <Badge variant={module.alert ? 'warning' : 'secondary'}>
                          {module.stat}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                    <div className="mt-4 flex items-center text-sm text-primary font-medium">
                      Access <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
