import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { applicationAPI } from '../services/api';

export function Applications() {
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    semester: '',
    year: new Date().getFullYear(),
    reason: '',
  });
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationAPI.getMyApplications().then(res => res.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => applicationAPI.submitApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      setShowNewForm(false);
      setFormData({ type: '', semester: '', year: new Date().getFullYear(), reason: '' });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: number) => applicationAPI.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleWithdraw = (id: number) => {
    if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      withdrawMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'WITHDRAWN':
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const applicationTypes = [
    { value: 'COURSE_OVERRIDE', label: 'Course Override/Prerequisite Waiver' },
    { value: 'LATE_ADD', label: 'Late Add' },
    { value: 'LATE_DROP', label: 'Late Drop' },
    { value: 'CREDIT_OVERLOAD', label: 'Credit Overload' },
    { value: 'GRADE_APPEAL', label: 'Grade Appeal' },
    { value: 'LEAVE_OF_ABSENCE', label: 'Leave of Absence' },
    { value: 'READMISSION', label: 'Readmission' },
    { value: 'TRANSFER_CREDIT', label: 'Transfer Credit Evaluation' },
    { value: 'OTHER', label: 'Other Petition' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Applications & Petitions</h1>
          <p className="mt-2 text-muted-foreground">Submit and track academic petitions and requests</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Application
        </button>
      </div>

      {/* New Application Form */}
      {showNewForm && (
        <div className="mb-8 bg-card rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Submit New Application</h3>
            <button
              onClick={() => setShowNewForm(false)}
              className="text-muted-foreground hover:text-muted-foreground"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  {applicationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select semester...</option>
                    <option value="FALL">Fall</option>
                    <option value="SPRING">Spring</option>
                    <option value="SUMMER">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Academic Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    min={2020}
                    max={2030}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide a detailed explanation for your request. Include any relevant circumstances, documentation, or supporting information."
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Be specific and include all relevant details to help expedite the review process.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Review times vary by petition type. Most applications are reviewed within 3-5 business days. You will be notified via email when a decision is made.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-card rounded-lg shadow">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">My Applications</h3>
        </div>
        <div className="p-6">
          {applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div
                  key={app.id}
                  className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-semibold text-foreground mr-3">
                          {applicationTypes.find(t => t.value === app.type)?.label || app.type}
                        </h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </div>
                        {app.semester && app.year && (
                          <div>
                            <span className="font-medium">Term:</span>{' '}
                            {app.semester} {app.year}
                          </div>
                        )}
                        {app.reviewedAt && (
                          <div>
                            <span className="font-medium">Reviewed:</span>{' '}
                            {new Date(app.reviewedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="bg-muted/50 rounded p-4 mb-4">
                        <div className="text-sm font-medium text-foreground mb-2">Reason:</div>
                        <p className="text-sm text-muted-foreground">{app.reason}</p>
                      </div>

                      {app.decision && (
                        <div className={`rounded p-4 mb-4 ${
                          app.status === 'APPROVED'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="text-sm font-medium mb-2" style={{
                            color: app.status === 'APPROVED' ? '#065f46' : '#991b1b'
                          }}>
                            Decision:
                          </div>
                          <p className="text-sm" style={{
                            color: app.status === 'APPROVED' ? '#047857' : '#dc2626'
                          }}>
                            {app.decision}
                          </p>
                          {app.reviewNotes && (
                            <div className="mt-2">
                              <div className="text-sm font-medium mb-1" style={{
                                color: app.status === 'APPROVED' ? '#065f46' : '#991b1b'
                              }}>
                                Reviewer Notes:
                              </div>
                              <p className="text-sm" style={{
                                color: app.status === 'APPROVED' ? '#047857' : '#dc2626'
                              }}>
                                {app.reviewNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {app.status === 'PENDING' && (
                    <div className="mt-4 flex items-center justify-end">
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-card hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Withdraw Application
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-foreground">No applications</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven't submitted any applications yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowNewForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit Your First Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h4>
        <p className="text-sm text-blue-700 mb-4">
          If you have questions about the application process or need assistance, please contact:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Academic Advising Office: advising@cuhk.edu.cn</li>
          <li>• Registrar's Office: registrar@cuhk.edu.cn</li>
          <li>• Phone: +86 (755) 8427-3500</li>
        </ul>
      </div>
    </div>
  );
}
