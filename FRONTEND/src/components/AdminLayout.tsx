import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You need admin privileges to access this area.</p>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navigationItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      )
    },
    {
      path: '/admin/reports',
      label: 'Manage Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      path: '/admin/users',
      label: 'User Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-red-600 border-b border-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="flex items-center space-x-2 text-white hover:text-red-100 transition-colors">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-lg font-bold">A</span>
                </div>
                <span className="text-xl font-semibold">Admin Portal</span>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center text-sm text-red-100">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-medium text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span>Welcome, {user?.name}</span>
              </div>

              <Link
                to="/"
                className="text-red-100 hover:text-white transition-colors text-sm"
              >
                View Site
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
