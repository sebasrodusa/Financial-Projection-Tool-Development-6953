import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import ComparisonChart from '../components/Analysis/ComparisonChart';
import ComparisonTable from '../components/Analysis/ComparisonTable';
import AssumptionsPanel from '../components/Analysis/AssumptionsPanel';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiDownload, FiSettings } = FiIcons;

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { illustrations, calculateComparisons } = useData();
  const [illustration, setIllustration] = useState(null);
  const [assumptions, setAssumptions] = useState({
    age: 47,
    contributionAmount: 12000,
    returnRate: 0.07,
    taxRateWorking: 0.24,
    taxRateRetirement: 0.22,
    fees: 0.01
  });
  const [comparisonData, setComparisonData] = useState(null);
  const [toggles, setToggles] = useState({
    compareOutOfPocket: false,
    qualifiedPlan: true,
    earlyWithdrawalPenalty: false,
    lifetimeIncome: false
  });

  useEffect(() => {
    const found = illustrations.find(ill => ill.id === id);
    if (found && found.status === 'analyzed') {
      setIllustration(found);
    } else {
      navigate('/dashboard');
    }
  }, [id, illustrations, navigate]);

  useEffect(() => {
    if (illustration && illustration.extractedData) {
      const data = calculateComparisons(illustration.extractedData, assumptions);
      setComparisonData(data);
    }
  }, [illustration, assumptions, calculateComparisons]);

  const handleAssumptionChange = (key, value) => {
    setAssumptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggleChange = (key, value) => {
    setToggles(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportPDF = () => {
    navigate(`/export/${id}`);
  };

  if (!illustration || !comparisonData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-financial-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analysis: {illustration.clientName}
            </h1>
            <p className="text-gray-600">
              Uploaded on {new Date(illustration.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-financial-blue hover:bg-blue-700"
        >
          <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assumptions Panel */}
        <div className="lg:col-span-1">
          <AssumptionsPanel
            assumptions={assumptions}
            toggles={toggles}
            onAssumptionChange={handleAssumptionChange}
            onToggleChange={handleToggleChange}
          />
        </div>

        {/* Main Analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Investment Comparison Over Time
            </h3>
            <ComparisonChart 
              data={comparisonData} 
              assumptions={assumptions}
              toggles={toggles}
            />
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Detailed Comparison
            </h3>
            <ComparisonTable 
              data={comparisonData}
              assumptions={assumptions}
              toggles={toggles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;