import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiSettings, FiMail, FiBriefcase, FiSave, FiCheck } = FiIcons;

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-financial-blue" />
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-financial-blue focus:border-financial-blue"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-financial-blue focus:border-financial-blue"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-financial-blue focus:border-financial-blue"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-financial-blue focus:border-financial-blue"
                >
                  <option value="Financial Professional">Financial Professional</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
                    saved 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-financial-blue hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSaving ? (
                    <>
                      <SafeIcon icon={FiSettings} className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Email Address</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBriefcase} className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">{user?.company}</p>
                  <p className="text-xs text-gray-500">Company</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-financial-blue mb-2">Demo Environment</h4>
            <p className="text-xs text-gray-600">
              This is a demonstration environment. Changes made here are for testing purposes only 
              and will not be persisted between sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;