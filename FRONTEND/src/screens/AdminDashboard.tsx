import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import type { Issue } from '../types/issue';
import type { AdminStats } from '../types/admin';

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isBanned: boolean;
  totalReports: number;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

const AdminDashboardContent: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalReports: 0,
    openReports: 0,
    resolvedReports: 0,
    spamReports: 0
  });
  const [recentReports, setRecentReports] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Issue | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'users'>('reports');
  const [statusUpdate, setStatusUpdate] = useState({
    reportId: '',
    newStatus: 'Open' as Issue['status'],
    assignedTo: '',
    notes: '',
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await fetch('/api/admin/stats');
      const reportsResponse = await fetch('/api/admin/reports');
      const usersResponse = await fetch('/api/admin/users');
      
      if (statsResponse.ok && reportsResponse.ok && usersResponse.ok) {
        const statsData = await statsResponse.json();
        const reportsData = await reportsResponse.json();
        const usersData = await usersResponse.json();
        
        setStats(statsData);
        setRecentReports(reportsData);
        setUsers(usersData);
      } else {
        const mockStats: AdminStats = {
          totalReports: 147,
          openReports: 45,
          resolvedReports: 102,
          spamReports: 8
        };

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
          },
          {
            id: "4",
            title: "Graffiti on community center",
            description: "Offensive graffiti needs immediate removal from public building.",
            category: "Public Safety",
            status: "Resolved",
            priority: "low",
            votes: 5,
            distance: "2.1 km",
            reportedDate: "1 week ago",
            submittedBy: "Sarah Johnson",
            submittedAt: "2025-07-26T10:15:00Z",
          },
          {
            id: "5",
            title: "Fake construction work claim",
            description: "This report appears to be fabricated - no construction visible at location.",
            category: "Road & Transportation",
            status: "rejected",
            priority: "low",
            votes: 2,
            distance: "1.5 km",
            reportedDate: "6 hours ago",
            submittedBy: "anonymous",
            submittedAt: "2025-08-02T04:00:00Z",
            isSpam: false,
            isInvalid: true
          },
          {
            id: "6",
            title: "Urgent water emergency - multiple locations",
            description: "Major water emergency affecting entire city - needs immediate action!",
            category: "Water & Sanitation",
            status: "rejected",
            priority: "high",
            votes: 0,
            distance: "unknown",
            reportedDate: "12 hours ago",
            submittedBy: "concerned_citizen",
            submittedAt: "2025-08-01T22:00:00Z",
            isSpam: true,
            isInvalid: false
          }
        ];

        const mockUsers: User[] = [
          {
            id: "1",
            name: "John Smith",
            email: "john.smith@example.com",
            isActive: true,
            isBanned: false,
            totalReports: 8,
            createdAt: "2025-07-15"
          },
          {
            id: "2",
            name: "Jane Doe",
            email: "jane.doe@example.com",
            isActive: true,
            isBanned: false,
            totalReports: 12,
            createdAt: "2025-07-20"
          },
          {
            id: "3",
            name: "Spam User",
            email: "spam@example.com",
            isActive: false,
            isBanned: true,
            totalReports: 15,
            createdAt: "2025-07-25"
          }
        ];
        
        setStats(mockStats);
        setRecentReports(mockReports);
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: string | number, newStatus: Issue['status'], assignedTo?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, assignedTo })
      });

      if (response.ok) {
        setRecentReports(prev => 
          prev.map(report => 
            report.id === reportId 
              ? { ...report, status: newStatus, assignedTo, updatedAt: new Date().toISOString() }
              : report
          )
        );

        setStats((prev: AdminStats) => {
          const updatedReports = recentReports.map(report => 
            report.id === reportId ? { ...report, status: newStatus } : report
          );
          const openReports = updatedReports.filter(r => r.status === 'Open').length;
          const resolvedReports = updatedReports.filter(r => r.status === 'Resolved').length;
          
          return {
            ...prev,
            openReports,
            resolvedReports
          };
        });
      }

      setShowStatusModal(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to update report status:', error);
    }
  };

  const markAsSpam = async (reportId: string | number) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/spam`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setRecentReports(prev => 
          prev.map(report => 
            report.id === reportId 
              ? { ...report, isSpam: true, status: 'rejected' as Issue['status'], moderatedAt: new Date().toISOString() }
              : report
          )
        );
        
        setStats((prev: AdminStats) => ({
          ...prev,
          spamReports: prev.spamReports + 1,
          openReports: prev.openReports - 1
        }));
      }
    } catch (error) {
      console.error('Failed to mark as spam:', error);
    }
  };

  const markAsInvalid = async (reportId: string | number) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/invalid`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setRecentReports(prev => 
          prev.map(report => 
            report.id === reportId 
              ? { ...report, isInvalid: true, status: 'rejected' as Issue['status'], moderatedAt: new Date().toISOString() }
              : report
          )
        );
        
        setStats((prev: AdminStats) => ({
          ...prev,
          openReports: prev.openReports - 1
        }));
      }
    } catch (error) {
      console.error('Failed to mark as invalid:', error);
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, isBanned: true, isActive: false }
              : user
          )
        );
      }

      setShowBanModal(false);
      setSelectedUser(null);
      setBanReason('');
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, isBanned: false, isActive: true }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Failed to unban user:', error);
    }
  };

  const openStatusModal = (report: Issue) => {
    setSelectedReport(report);
    setStatusUpdate({
      reportId: String(report.id),
      newStatus: report.status,
      assignedTo: report.assignedTo || '',
      notes: '',
    });
    setShowStatusModal(true);
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: Issue['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage civic issues, monitor reports, and oversee community activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.totalReports}</h3>
          <p className="text-slate-600 text-sm">Total Reports</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm text-yellow-600 font-medium">pending</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.openReports}</h3>
          <p className="text-slate-600 text-sm">Open Issues</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-green-600 font-medium">resolved</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.resolvedReports}</h3>
          <p className="text-slate-600 text-sm">Resolved Issues</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span className="text-sm text-red-600 font-medium">flagged</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">{stats.spamReports}</h3>
          <p className="text-slate-600 text-sm">Spam Reports</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Users
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reports' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">All Reports</h3>
                <button 
                  onClick={fetchDashboardData}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors ${report.isSpam || report.isInvalid ? 'bg-red-50' : 'bg-slate-50'}`}>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(report.priority)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-slate-800 truncate">
                          Report #{report.id} - {report.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2 truncate">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{report.category} • {report.reportedDate}</span>
                        <span>{report.votes} votes</span>
                      </div>
                      {(report.isSpam || report.isInvalid) && (
                        <div className="text-xs text-red-600 font-medium mt-1">
                          {report.isSpam ? 'MARKED AS SPAM' : 'MARKED AS INVALID'}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openStatusModal(report)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        disabled={report.isSpam || report.isInvalid}
                      >
                        {report.isSpam || report.isInvalid ? 'Flagged' : 'Manage'}
                      </button>
                      {!report.isSpam && !report.isInvalid && (
                        <>
                          <button
                            onClick={() => markAsSpam(report.id)}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          >
                            Spam
                          </button>
                          <button
                            onClick={() => markAsInvalid(report.id)}
                            className="px-2 py-1 text-xs font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                          >
                            Invalid
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">User Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className={user.isBanned ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isBanned 
                              ? 'bg-red-100 text-red-800' 
                              : user.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalReports}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.isBanned ? (
                            <button
                              onClick={() => handleUnbanUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowBanModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Ban User
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showStatusModal && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
              onClick={() => setShowStatusModal(false)}
            />
            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-800">
                  Manage Report #{selectedReport.id}
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">{selectedReport.title}</h4>
                  <p className="text-sm text-slate-600">{selectedReport.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusUpdate.newStatus}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, newStatus: e.target.value as Issue['status'] }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Assign To
                  </label>
                  <input
                    type="text"
                    value={statusUpdate.assignedTo}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Enter assignee name or ID"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes or comments..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(
                    statusUpdate.reportId,
                    statusUpdate.newStatus,
                    statusUpdate.assignedTo
                  )}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
              onClick={() => setShowBanModal(false)}
            />
            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-800">
                  Ban User: {selectedUser.name}
                </h3>
                <button
                  onClick={() => setShowBanModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">User: {selectedUser.email}</p>
                  <p className="text-sm text-slate-600">Reports: {selectedUser.totalReports}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for Ban
                  </label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter the reason for banning this user"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBanUser(selectedUser.id, banReason)}
                  disabled={!banReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Ban User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
