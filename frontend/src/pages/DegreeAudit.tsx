import { useQuery } from '@tanstack/react-query';
import { Check, X, Clock, AlertCircle, BookOpen, Award } from 'lucide-react';
import api from '../services/api';

interface DegreeRequirement {
  category: string;
  subcategory?: string;
  required: number;
  earned: number;
  inProgress: number;
  remaining: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  courses: {
    completed: Array<{ code: string; name: string; credits: number }>;
    inProgress: Array<{ code: string; name: string; credits: number }>;
    needed: string[];
  };
}

export function DegreeAudit() {
  const { data: auditData, isLoading } = useQuery({
    queryKey: ['degree-audit'],
    queryFn: async () => {
      const response = await api.get('/planning/degree-audit');
      return response.data.data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Check className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <X className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      COMPLETED: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      IN_PROGRESS: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      NOT_STARTED: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    };
    return styles[status as keyof typeof styles] || styles.NOT_STARTED;
  };

const getProgressPercentage = (earned: number, required: number) => {
  if (!required || required <= 0) {
    return earned > 0 ? 100 : 0;
  }
  return Math.min((earned / required) * 100, 100);
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

const requirements: DegreeRequirement[] = (auditData?.requirements || []).map(req => ({
  ...req,
  status: req.status || 'NOT_STARTED',
  courses: {
    completed: req.courses?.completed || [],
    inProgress: req.courses?.inProgress || [],
    needed: req.courses?.needed || [],
  },
}));
  const overallProgress = auditData?.overallProgress || {
    totalRequired: 120,
    totalEarned: 0,
    percentage: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          Degree Audit & Requirements
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your progress toward graduation requirements
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Overall Progress</h2>
            <p className="text-muted-foreground">Degree Requirements</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">
              {overallProgress.percentage}%
            </div>
            <div className="text-sm text-muted-foreground">
              {overallProgress.totalEarned} / {overallProgress.totalRequired} credits
            </div>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Breakdown */}
      <div className="space-y-6">
        {requirements.map((req, index) => {
          const status = req.status || 'NOT_STARTED';
          return (
            <div key={index} className="bg-card border border-border rounded-lg shadow overflow-hidden">
            {/* Requirement Header */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{req.category}</h3>
                    {req.subcategory && (
                      <p className="text-sm text-muted-foreground">{req.subcategory}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)}`}>
                    {status.replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {req.earned} / {req.required}
                    </div>
                    <div className="text-xs text-muted-foreground">credits</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      status === 'COMPLETED'
                        ? 'bg-green-500'
                        : status === 'IN_PROGRESS'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${getProgressPercentage(req.earned, req.required)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{getProgressPercentage(req.earned, req.required).toFixed(0)}% complete</span>
                  {req.remaining > 0 && <span>{req.remaining} credits remaining</span>}
                </div>
              </div>
            </div>

            {/* Requirement Details */}
            <div className="p-6 space-y-4">
              {/* Completed Courses */}
              {req.courses.completed.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    Completed ({req.earned} credits)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {req.courses.completed.map((course, idx) => (
                      <div
                        key={idx}
                        className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-sm"
                      >
                        <div className="font-medium text-foreground">{course.code}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {course.name}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          {course.credits} credits
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Courses */}
              {req.courses.inProgress.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    In Progress ({req.inProgress} credits)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {req.courses.inProgress.map((course, idx) => (
                      <div
                        key={idx}
                        className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded px-3 py-2 text-sm"
                      >
                        <div className="font-medium text-foreground">{course.code}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {course.name}
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                          {course.credits} credits
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Needed Courses */}
              {req.courses.needed.length > 0 && req.remaining > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    Still Needed ({req.remaining} credits)
                  </h4>
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
                      {req.courses.needed.map((courseInfo, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <span>{courseInfo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {overallProgress.percentage >= 100 && (
        <div className="mt-8 bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Congratulations!
              </h3>
              <p className="text-green-700 dark:text-green-300 mt-1">
                You have completed all degree requirements and are eligible for graduation!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
