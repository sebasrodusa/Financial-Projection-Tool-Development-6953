import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiFilter, FiFileText, FiCalendar, FiUser, FiCheckCircle, FiClock, FiEye } = FiIcons;

const Dashboard = () => {
  const { illustrations } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredIllustrations = illustrations.filter(illustration => {
    const matchesSearch = illustration.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || illustration.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    return status === 'analyzed' ? FiCheckCircle : FiClock;
  };

  const getStatusColor = (status) => {
    return status === 'analyzed' 
      ? 'text-green-600 bg-green-100' 
      : 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-financial-blue hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          New Upload
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiFileText} className="h-8 w-8 text-financial-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Illustrations</p>
              <p className="text-2xl font-semibold text-gray-900">{illustrations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiCheckCircle} className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Analyzed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {illustrations.filter(ill => ill.status === 'analyzed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SafeIcon icon={FiClock} className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {illustrations.filter(ill => ill.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-financial-blue focus:border-financial-blue"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-financial-blue focus:border-financial-blue"
            >
              <option value="all">All Status</option>
              <option value="analyzed">Analyzed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Illustrations List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Illustrations</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredIllustrations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <SafeIcon icon={FiFileText} className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No illustrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by uploading your first IUL illustration.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <div className="mt-6">
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-financial-blue hover:bg-blue-700"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Upload Illustration
                  </Link>
                </div>
              )}
            </div>
          ) : (
            filteredIllustrations.map((illustration) => (
              <div key={illustration.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <SafeIcon icon={FiUser} className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {illustration.clientName}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(illustration.status)}`}>
                          <SafeIcon icon={getStatusIcon(illustration.status)} className="w-3 h-3 mr-1" />
                          {illustration.status.charAt(0).toUpperCase() + illustration.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                          {new Date(illustration.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {illustration.status === 'analyzed' && (
                      <Link
                        to={`/analysis/${illustration.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-financial-blue bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <SafeIcon icon={FiEye} className="w-3 h-3 mr-1" />
                        View Analysis
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;