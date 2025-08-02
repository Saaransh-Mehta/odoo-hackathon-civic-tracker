import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'admin@civictracker.com' && credentials.password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@civictracker.com',
          role: 'admin' as const
        };
        
        login(adminUser);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Use admin@civictracker.com / admin123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const adminUser = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@civictracker.com',
      role: 'admin' as const
    };
    
    login(adminUser);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access the administrative dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="admin@civictracker.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in as Admin'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-50 text-slate-500">Demo Access</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex justify-center py-3 px-4 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                Demo Admin Access
              </button>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              ← Back to Main Site
            </a>
          </div>
        </form>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-amber-800">Demo Credentials</h4>
              <p className="text-sm text-amber-700 mt-1">
                Email: admin@civictracker.com<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
