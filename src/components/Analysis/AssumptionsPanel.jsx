import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiToggleLeft, FiToggleRight } = FiIcons;

const AssumptionsPanel = ({ assumptions, toggles, onAssumptionChange, onToggleChange }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-6">
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiSettings} className="w-5 h-5 text-financial-blue" />
        <h3 className="text-lg font-medium text-gray-900">Assumptions</h3>
      </div>

      <div className="space-y-6">
        {/* Age Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Age: {assumptions.age}
          </label>
          <input
            type="range"
            min="25"
            max="65"
            value={assumptions.age}
            onChange={(e) => onAssumptionChange('age', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>25</span>
            <span>65</span>
          </div>
        </div>

        {/* Contribution Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Contribution
          </label>
          <input
            type="number"
            value={assumptions.contributionAmount}
            onChange={(e) => onAssumptionChange('contributionAmount', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-financial-blue"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(assumptions.contributionAmount)}
          </p>
        </div>

        {/* Return Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Return: {formatPercentage(assumptions.returnRate)}
          </label>
          <input
            type="range"
            min="0.03"
            max="0.12"
            step="0.005"
            value={assumptions.returnRate}
            onChange={(e) => onAssumptionChange('returnRate', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Tax Rates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Working Tax Rate: {formatPercentage(assumptions.taxRateWorking)}
          </label>
          <input
            type="range"
            min="0.10"
            max="0.37"
            step="0.01"
            value={assumptions.taxRateWorking}
            onChange={(e) => onAssumptionChange('taxRateWorking', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retirement Tax Rate: {formatPercentage(assumptions.taxRateRetirement)}
          </label>
          <input
            type="range"
            min="0.10"
            max="0.37"
            step="0.01"
            value={assumptions.taxRateRetirement}
            onChange={(e) => onAssumptionChange('taxRateRetirement', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Fees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Fees: {formatPercentage(assumptions.fees)}
          </label>
          <input
            type="range"
            min="0.005"
            max="0.03"
            step="0.001"
            value={assumptions.fees}
            onChange={(e) => onAssumptionChange('fees', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Toggle Options */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Display Options</h4>
        <div className="space-y-3">
          {[
            { key: 'compareOutOfPocket', label: 'Compare Out-of-Pocket' },
            { key: 'qualifiedPlan', label: 'Qualified Plan' },
            { key: 'earlyWithdrawalPenalty', label: 'Early Withdrawal Penalty' },
            { key: 'lifetimeIncome', label: 'Lifetime Income' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                onClick={() => onToggleChange(key, !toggles[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  toggles[key] ? 'bg-financial-blue' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    toggles[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssumptionsPanel;