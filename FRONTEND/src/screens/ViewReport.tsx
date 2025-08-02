import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  submittedAt: string;
  updatedAt: string;
  isAnonymous: boolean;
}

const ViewReport = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest');

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserReports();
    }
  }, [isLoggedIn]);

  const fetchUserReports = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Broken streetlight on Main Street',
          description: 'The streetlight has been flickering for weeks and finally went out completely. This creates a safety hazard for pedestrians walking at night.',
          category: 'Street Lighting',
          status: 'in-progress',
          location: {
            lat: 40.7580,
            lng: -73.9855,
            address: '123 Main Street, New York, NY 10001'
          },
          images: [
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
          ],
          submittedAt: '2025-01-28T10:30:00Z',
          updatedAt: '2025-01-30T14:20:00Z',
          isAnonymous: false
        },
        {
          id: '2',
          title: 'Pothole on Oak Avenue',
          description: 'Large pothole causing damage to vehicles. Multiple cars have been affected.',
          category: 'Road & Transportation',
          status: 'resolved',
          location: {
            lat: 40.7505,
            lng: -73.9934,
            address: '456 Oak Avenue, New York, NY 10002'
          },
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
          ],
          submittedAt: '2025-01-25T16:45:00Z',
          updatedAt: '2025-02-01T09:15:00Z',
          isAnonymous: false
        },
        {
          id: '3',
          title: 'Overflowing trash bins in Central Park',
          description: 'Multiple trash bins are overflowing, creating unsanitary conditions and attracting pests.',
          category: 'Waste Management',
          status: 'pending',
          location: {
            lat: 40.7829,
            lng: -73.9654,
            address: 'Central Park, New York, NY 10024'
          },
          images: [
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop'
          ],
          submittedAt: '2025-02-01T08:20:00Z',
          updatedAt: '2025-02-01T08:20:00Z',
          isAnonymous: true
        }
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'resolved':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredAndSortedReports = reports
    .filter(report => filter === 'all' || report.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Login Required</h1>
        <p className="text-slate-600 mb-6">You need to be logged in to view your reports.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">My Reports</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Track the status of your submitted civic issues and see how they're being addressed.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-700"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'status')}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/report')}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Report</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your reports...</p>
          </div>
        ) : filteredAndSortedReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No reports found</h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all' 
                ? "You haven't submitted any reports yet." 
                : `No reports with status "${filter}" found.`}
            </p>
            <button
              onClick={() => navigate('/add-report')}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Submit Your First Report
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedReports.map((report) => (
              <div key={report.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">{report.title}</h3>
                      {report.isAnonymous && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>{report.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{report.location.address}</span>
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status.replace('-', ' ')}</span>
                  </div>
                </div>

                <p className="text-slate-700 mb-4 line-clamp-2">{report.description}</p>

                {report.images.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {report.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Report image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                      />
                    ))}
                    {report.images.length > 3 && (
                      <div className="w-20 h-20 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-slate-600">+{report.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>Submitted: {formatDate(report.submittedAt)}</span>
                    {report.updatedAt !== report.submittedAt && (
                      <span>Updated: {formatDate(report.updatedAt)}</span>
                    )}
                  </div>
                  <button className="text-slate-600 hover:text-slate-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Report Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{reports.length}</div>
            <div className="text-sm text-slate-600">Total Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{reports.filter(r => r.status === 'in-progress').length}</div>
            <div className="text-sm text-slate-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'resolved').length}</div>
            <div className="text-sm text-slate-600">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
