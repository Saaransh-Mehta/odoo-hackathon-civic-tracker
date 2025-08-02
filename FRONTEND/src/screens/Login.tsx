import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' as UserRole
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email?.trim() || !formData.password?.trim()) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLoginMode && !formData.name?.trim()) {
      setError('Please enter your name');
      return false;
    }

    if (!isLoginMode && !formData.mobile?.trim()) {
      setError('Please enter your mobile number');
      return false;
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!isLoginMode) {
      const mobileRegex = /^[0-9]{10,15}$/;
      if (!mobileRegex.test(formData.mobile.replace(/\s+/g, ''))) {
        setError('Please enter a valid mobile number (10-15 digits)');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const response = await axios.get('https://odoo-hackathon-civic-tracker-5yfm.onrender.com/api/v1/login', {
          params: {
            email: formData.email,
            password: formData.password
          }
        });

        const data = response.data;
        
        const userData = {
          id: data.user?.id || data.id || Math.random().toString(36).substr(2, 9),
          name: data.user?.name || data.name || formData.email.split('@')[0],
          email: data.user?.email || data.email || formData.email,
          role: (data.user?.role || data.role || 'user') as UserRole
        };

        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        login(userData);
        navigate('/');
      } else {
        const response = await axios.post('https://odoo-hackathon-civic-tracker-5yfm.onrender.com/api/v1/register', {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        });

        const data = response.data;
        
        const userData = {
          id: data.user?.id || data.id || Math.random().toString(36).substr(2, 9),
          name: data.user?.name || data.name || formData.name,
          email: data.user?.email || data.email || formData.email,
          role: (data.user?.role || data.role || 'user') as UserRole
        };

        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        login(userData);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
    setError('');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('https://odoo-hackathon-civic-tracker-5yfm.onrender.com/v1/login', {
        params: {
          email: 'demo@civictracker.com',
          password: 'demo123'
        }
      });

      const data = response.data;
      
      const userData = {
        id: data.user?.id || data.id || 'demo-user-123',
        name: data.user?.name || data.name || 'Demo User',
        email: data.user?.email || data.email || 'demo@civictracker.com',
        role: (data.user?.role || data.role || 'user') as UserRole
      };

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      login(userData);
      navigate('/');
    } catch (err) {
      console.error('Demo login error:', err);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const demoUser = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@civictracker.com',
          role: 'user' as const
        };

        login(demoUser);
        navigate('/');
      } catch (fallbackErr) {
        setError('Demo login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                {isLoginMode ? 'Welcome Back' : 'Join the Community'}
              </h1>
              <p className="text-slate-600">
                {isLoginMode 
                  ? 'Sign in to track and resolve civic issues in your area'
                  : 'Create an account to start making a difference in your community'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    placeholder="Enter your full name"
                    required={!isLoginMode}
                  />
                </div>
              )}

              {!isLoginMode && (
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    placeholder="Enter your mobile number"
                    required={!isLoginMode}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    placeholder="Confirm your password"
                    required={!isLoginMode}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLoginMode ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {isLoginMode && (
              <div className="mt-4">
                <button
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600 mr-2"></div>
                      Loading Demo...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Try Demo Account
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 font-medium text-slate-800 hover:text-slate-600 transition-colors duration-200"
                >
                  {isLoginMode ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {isLoginMode && (
              <div className="mt-4 text-center">
                <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200">
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
