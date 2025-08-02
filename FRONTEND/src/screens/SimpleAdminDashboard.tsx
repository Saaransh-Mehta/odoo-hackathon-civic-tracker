import React, { useState, useEffect } from 'react';
import type { Issue } from '../types/issue';
import type { AdminStats } from '../types/admin';

const AdminDashboard: React.FC = () => {
  const [reports, setReports] = useState<Issue[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalReports: 0,
    openReports: 0,
    resolvedReports: 0,
    spamReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Issue | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const mockReports: Issue[] = [
        {
          id: "1",
          title: "Large pothole on Main Street",
          description: "Dangerous pothole causing vehicle damage near the intersection with Oak Avenue.",
          category: "Road & Transportation",
          status: "Open",
          priority: "high",
          votes: 23,
          distance: "0.5 km",
          reportedDate: "2 hours ago",
          submittedBy: "John Smith",
          submittedAt: "2025-08-02T08:00:00Z",
          isSpam: false,
          isInvalid: false
        },
        {
          id: "2",
          title: "Broken street light on Park Avenue",
          description: "Street light has been out for over a week, creating safety concerns.",
          category: "Street Lighting",
          status: "In Progress",
          priority: "medium",
          votes: 12,
          distance: "1.2 km",
          reportedDate: "1 day ago",
          submittedBy: "Jane Doe",
          submittedAt: "2025-08-01T14:30:00Z",
          isSpam: false,
          isInvalid: false
        },
        {
          id: "3",
          title: "Water leak on Elm Street",
          description: "Continuous water leak from underground pipe causing road damage.",
          category: "Water & Sanitation",
          status: "Open",
          priority: "high",
          votes: 18,
          distance: "0.8 km",
          reportedDate: "4 hours ago",
          submittedBy: "Bob Wilson",
          submittedAt: "2025-08-02T06:00:00Z",
          isSpam: false,
          isInvalid: false
        },
        {
          id: "4",
          title: "Fake report test",
          description: "This is clearly a spam report.",
          category: "Other",
          status: "Open",
          priority: "low",
          votes: 1,
          distance: "5.0 km",
          reportedDate: "30 minutes ago",
          submittedBy: "Spam User",
          submittedAt: "2025-08-02T09:30:00Z",
          isSpam: true,
          isInvalid: false
        }
      ];

      setReports(mockReports);
      
      const totalReports = mockReports.length;
      const openReports = mockReports.filter(r => r.status === 'Open').length;
      const resolvedReports = mockReports.filter(r => r.status === 'Resolved').length;
      const spamReports = mockReports.filter(r => r.isSpam).length;

      setStats({
        totalReports,
        openReports,
        resolvedReports,
        spamReports
      });

    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = (reportId: string | number, newStatus: Issue['status']) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus, updatedAt: new Date().toISOString() }
          : report
      )
    );
    setShowModal(false);
    setSelectedReport(null);
    
    const updatedReports = reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    );
    const openReports = updatedReports.filter(r => r.status === 'Open').length;
    const resolvedReports = updatedReports.filter(r => r.status === 'Resolved').length;
    
    setStats(prev => ({
      ...prev,
      openReports,
      resolvedReports
    }));
  };

  const markAsSpam = (reportId: string | number) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, isSpam: true, status: 'rejected' as Issue['status'], moderatedAt: new Date().toISOString() }
          : report
      )
    );
    
    setStats(prev => ({
      ...prev,
      spamReports: prev.spamReports + 1,
      openReports: prev.openReports - 1
    }));
  };

  const markAsInvalid = (reportId: string | number) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, isInvalid: true, status: 'rejected' as Issue['status'], moderatedAt: new Date().toISOString() }
          : report
      )
    );
    
    setStats(prev => ({
      ...prev,
      openReports: prev.openReports - 1
    }));
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority?: Issue['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Reports</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Open Reports</h3>
            <p className="text-2xl font-bold text-red-600">{stats.openReports}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Resolved Reports</h3>
            <p className="text-2xl font-bold text-green-600">{stats.resolvedReports}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Spam Reports</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.spamReports}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Reports</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className={report.isSpam || report.isInvalid ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                        {(report.isSpam || report.isInvalid) && (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            {report.isSpam ? 'MARKED AS SPAM' : 'MARKED AS INVALID'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.submittedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.reportedDate}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {setSelectedReport(report); setShowModal(true);}}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={report.isSpam || report.isInvalid}
                        >
                          Update Status
                        </button>
                        {!report.isSpam && !report.isInvalid && (
                          <>
                            <button
                              onClick={() => markAsSpam(report.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Mark Spam
                            </button>
                            <button
                              onClick={() => markAsInvalid(report.id)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Mark Invalid
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Update Report Status</h3>
            <p className="text-sm text-gray-600 mb-4">Report: {selectedReport.title}</p>
            
            <div className="space-y-3">
              {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateReportStatus(selectedReport.id, status as Issue['status'])}
                  className={`w-full text-left px-4 py-2 rounded border hover:bg-gray-50 ${
                    selectedReport.status === status ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
