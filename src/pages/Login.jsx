import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiMail, FiUser, FiUserCheck } = FiIcons;

const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Financial Professional');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email || 'demo@example.com', role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (selectedRole) => {
    setIsLoading(true);
    try {
      const email = selectedRole === 'Admin' 
        ? 'admin@prosperityprojector.com' 
        : 'advisor@prosperityprojector.com';
      await login(email, selectedRole);
      navigate('/dashboard');
    } catch (error) {
      console.error('Quick login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-financial-blue to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Prosperity Projector
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            IUL Analysis Platform for Financial Professionals
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Quick Login Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Login</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickLogin('Financial Professional')}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-financial-blue transition-colors"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-2 text-financial-blue" />
                <span>Financial Professional</span>
              </button>
              <button
                onClick={() => handleQuickLogin('Admin')}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-financial-blue transition-colors"
              >
                <SafeIcon icon={FiUserCheck} className="w-5 h-5 mr-2 text-financial-blue" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-blue focus:border-transparent focus:z-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-8 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-financial-blue focus:border-transparent focus:z-10"
                >
                  <option value="Financial Professional">Financial Professional</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-financial-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-financial-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a demo environment with mock authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;