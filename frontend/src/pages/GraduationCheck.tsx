import { useQuery } from '@tanstack/react-query';
import { GraduationCap, Check, X, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import api from '../services/api';

interface GraduationStatus {
  eligible: boolean;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'ON_TRACK' | 'AT_RISK';
  checklist: {
    coreComplete: boolean;
    majorRequiredComplete: boolean;
    majorElectiveComplete: boolean;
    freeElectiveComplete: boolean;
    totalCreditsComplete: boolean;
    gpaRequirement: boolean;
  };
  missing: {
    coreCredits: number;
    majorRequiredCredits: number;
    majorElectiveCredits: number;
    freeElectiveCredits: number;
    totalCredits: number;
    gpaDeficit: number;
  };
  summary: {
    totalRequired: number;
    totalEarned: number;
    currentGPA: number;
    minimumGPA: number;
  };
  estimatedGraduation: string;
  actionItems: string[];
}

export function GraduationCheck() {
  const { data: graduationData, isLoading } = useQuery<GraduationStatus>({
    queryKey: ['graduation-eligibility'],
    queryFn: async () => {
      const response = await api.get('/planning/graduation-eligibility');
      return response.data.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'from-green-500 to-emerald-600';
      case 'ON_TRACK':
        return 'from-blue-500 to-cyan-600';
      case 'AT_RISK':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-red-500 to-rose-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return <GraduationCap className="h-12 w-12 text-white" />;
      case 'ON_TRACK':
        return <TrendingUp className="h-12 w-12 text-white" />;
      case 'AT_RISK':
        return <AlertTriangle className="h-12 w-12 text-white" />;
      default:
        return <X className="h-12 w-12 text-white" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return {
          title: 'Eligible for Graduation!',
          subtitle: 'You have met all requirements for graduation.',
        };
      case 'ON_TRACK':
        return {
          title: 'On Track to Graduate',
          subtitle: 'Continue your current pace to graduate on time.',
        };
      case 'AT_RISK':
        return {
          title: 'At Risk - Action Required',
          subtitle: 'You may not graduate on time without additional courses.',
        };
      default:
        return {
          title: 'Not Eligible to Graduate',
          subtitle: 'You have not met all graduation requirements.',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const status = graduationData?.status || 'NOT_ELIGIBLE';
  const statusInfo = getStatusMessage(status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          Graduation Eligibility Check
        </h1>
        <p className="mt-2 text-muted-foreground">
          Check your eligibility for graduation and view requirements
        </p>
      </div>

      {/* Status Banner */}
      <div className={`bg-gradient-to-r ${getStatusColor(status)} rounded-lg shadow-xl p-8 mb-8`}>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              {getStatusIcon(status)}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white">{statusInfo.title}</h2>
            <p className="text-white/90 text-lg mt-1">{statusInfo.subtitle}</p>
            {graduationData?.estimatedGraduation && (
              <div className="flex items-center gap-2 mt-3 text-white/80">
                <Calendar className="h-5 w-5" />
                <span>Estimated Graduation: {graduationData.estimatedGraduation}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg shadow p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Credits</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {graduationData?.summary.totalEarned || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            / {graduationData?.summary.totalRequired || 120} required
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  ((graduationData?.summary.totalEarned || 0) /
                    (graduationData?.summary.totalRequired || 120)) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-muted-foreground">Current GPA</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {graduationData?.summary.currentGPA.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            / {graduationData?.summary.minimumGPA.toFixed(1) || '2.0'} minimum
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-sm font-medium text-muted-foreground">Requirements Met</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {graduationData &&
              Object.values(graduationData.checklist).filter(Boolean).length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            / {graduationData && Object.keys(graduationData.checklist).length} total
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="text-sm font-medium text-muted-foreground">Credits Remaining</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {graduationData?.missing.totalCredits || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">to complete</div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-card border border-border rounded-lg shadow overflow-hidden mb-8">
        <div className="bg-muted/50 px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Requirements Status</h2>
        </div>
        <div className="p-6 space-y-4">
          <RequirementRow
            label="Core Requirements"
            completed={graduationData?.checklist.coreComplete || false}
            missing={graduationData?.missing.coreCredits || 0}
          />
          <RequirementRow
            label="Major Required Courses"
            completed={graduationData?.checklist.majorRequiredComplete || false}
            missing={graduationData?.missing.majorRequiredCredits || 0}
          />
          <RequirementRow
            label="Major Elective Courses"
            completed={graduationData?.checklist.majorElectiveComplete || false}
            missing={graduationData?.missing.majorElectiveCredits || 0}
          />
          <RequirementRow
            label="Free Elective Courses"
            completed={graduationData?.checklist.freeElectiveComplete || false}
            missing={graduationData?.missing.freeElectiveCredits || 0}
          />
          <RequirementRow
            label="Total Credit Requirement (120 credits)"
            completed={graduationData?.checklist.totalCreditsComplete || false}
            missing={graduationData?.missing.totalCredits || 0}
          />
          <RequirementRow
            label="Minimum GPA Requirement (2.0)"
            completed={graduationData?.checklist.gpaRequirement || false}
            missing={0}
            gpaDeficit={graduationData?.missing.gpaDeficit}
          />
        </div>
      </div>

      {/* Action Items */}
      {graduationData?.actionItems && graduationData.actionItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-3">Action Items</h3>
              <ul className="space-y-2">
                {graduationData.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-foreground">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Eligible Message */}
      {graduationData?.eligible && (
        <div className="mt-8 bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                Ready to Graduate!
              </h3>
              <p className="text-green-700 dark:text-green-300 mt-1">
                You have met all degree requirements. Contact your advisor to initiate the
                graduation application process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RequirementRowProps {
  label: string;
  completed: boolean;
  missing: number;
  gpaDeficit?: number;
}

function RequirementRow({ label, completed, missing, gpaDeficit }: RequirementRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        {completed ? (
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : (
          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
        )}
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div>
        {completed ? (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
            COMPLETED
          </span>
        ) : (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold rounded-full">
            {gpaDeficit !== undefined
              ? `${gpaDeficit.toFixed(2)} GPA deficit`
              : `${missing} credits needed`}
          </span>
        )}
      </div>
    </div>
  );
}
