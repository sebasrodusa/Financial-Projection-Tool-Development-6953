import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUser, FiLogOut, FiMenu } = FiIcons;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Upload', href: '/upload' },
    { name: 'Settings', href: '/settings' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-financial-blue to-primary-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Prosperity Projector</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-financial-blue bg-blue-50'
                    : 'text-gray-600 hover:text-financial-blue hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="w-4 h-4" />
              <span>{user?.name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;