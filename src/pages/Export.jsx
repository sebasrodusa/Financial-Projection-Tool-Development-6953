import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiDownload, FiPrinter, FiFileText } = FiIcons;

const Export = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { illustrations, calculateComparisons } = useData();
  const { user } = useAuth();
  const [illustration, setIllustration] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const assumptions = {
    age: 47,
    contributionAmount: 12000,
    returnRate: 0.07,
    taxRateWorking: 0.24,
    taxRateRetirement: 0.22,
    fees: 0.01
  };

  useEffect(() => {
    const found = illustrations.find(ill => ill.id === id);
    if (found && found.status === 'analyzed') {
      setIllustration(found);
    } else {
      navigate('/dashboard');
    }
  }, [id, illustrations, navigate]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would use @react-pdf/renderer
    const blob = new Blob(['Mock PDF Content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${illustration.clientName}_IUL_Analysis_Report.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!illustration) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-financial-blue"></div>
      </div>
    );
  }

  const comparisonData = calculateComparisons(illustration.extractedData, assumptions);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const calculateTotals = (dataset) => {
    const totalContributions = dataset.contributions[dataset.contributions.length - 1] || 0;
    const finalBalance = dataset.balances[dataset.balances.length - 1] || 0;
    const totalTaxes = dataset.taxes.reduce((sum, tax) => sum + tax, 0);
    
    return {
      totalContributions,
      finalBalance,
      totalTaxes,
      netReturn: finalBalance - totalContributions
    };
  };

  const iulTotals = calculateTotals(comparisonData.iul);
  const iraTotals = calculateTotals(comparisonData.ira);
  const k401Totals = calculateTotals(comparisonData.k401);
  const mutualFundTotals = calculateTotals(comparisonData.mutualFund);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header - Hidden in print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/analysis/${id}`)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-1" />
            Back to Analysis
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Export Report</h1>
            <p className="text-gray-600">{illustration.clientName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <SafeIcon icon={FiPrinter} className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-financial-blue hover:bg-blue-700 disabled:opacity-50"
          >
            <SafeIcon icon={isGenerating ? FiFileText : FiDownload} className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow print:shadow-none print:rounded-none p-8 print:p-0">
        {/* Report Header */}
        <div className="text-center mb-8 print:mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-financial-blue to-primary-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiFileText} className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">IUL Analysis Report</h1>
          </div>
          <div className="text-gray-600">
            <p className="text-lg font-medium">{illustration.clientName}</p>
            <p>Prepared by {user?.name} • {user?.company}</p>
            <p>Report Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h2>
          <div className="bg-blue-50 p-6 rounded-lg print:bg-gray-50">
            <p className="text-gray-700 leading-relaxed">
              This analysis compares the Indexed Universal Life (IUL) insurance policy against 
              traditional investment vehicles including IRA, 401(k), and taxable mutual fund investments. 
              The comparison is based on current assumptions and projected returns over a 
              {65 - assumptions.age}-year period from age {assumptions.age} to retirement at 65.
            </p>
          </div>
        </div>

        {/* Key Assumptions */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Assumptions</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Age:</span>
                <span className="font-medium">{assumptions.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Contribution:</span>
                <span className="font-medium">{formatCurrency(assumptions.contributionAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Return:</span>
                <span className="font-medium">{(assumptions.returnRate * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Working Tax Rate:</span>
                <span className="font-medium">{(assumptions.taxRateWorking * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retirement Tax Rate:</span>
                <span className="font-medium">{(assumptions.taxRateRetirement * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Fees:</span>
                <span className="font-medium">{(assumptions.fees * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Results */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comparison Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IUL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IRA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    401(k)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mutual Fund
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Final Balance</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iulTotals.finalBalance)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iraTotals.finalBalance)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(k401Totals.finalBalance)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(mutualFundTotals.finalBalance)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Contributions</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iulTotals.totalContributions)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iraTotals.totalContributions)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(k401Totals.totalContributions)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(mutualFundTotals.totalContributions)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Net Return</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iulTotals.netReturn)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iraTotals.netReturn)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(k401Totals.netReturn)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(mutualFundTotals.netReturn)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Taxes Paid</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iulTotals.totalTaxes)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(iraTotals.totalTaxes)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(k401Totals.totalTaxes)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(mutualFundTotals.totalTaxes)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Benefits of IUL</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-financial-blue rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Tax-free growth and withdrawals</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-financial-blue rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Permanent life insurance protection</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-financial-blue rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Flexible premium payments</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-financial-blue rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Downside protection with upside potential</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-financial-blue rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">No required minimum distributions</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-financial-blue rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">Potential for tax-free retirement income</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Recommendation</h2>
          <div className="bg-blue-50 p-6 rounded-lg print:bg-gray-50">
            <p className="text-gray-700 leading-relaxed mb-4">
              Based on the analysis performed, the IUL policy shows competitive performance 
              when considering the additional benefits of life insurance protection and tax-free 
              growth potential. The policy provides flexibility and tax advantages that may be 
              particularly beneficial for high-income earners looking to supplement their retirement planning.
            </p>
            <p className="text-gray-700 leading-relaxed">
              It is recommended to consider this IUL policy as part of a diversified financial 
              strategy, taking into account your specific financial goals, risk tolerance, and 
              overall estate planning objectives.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
          <p>This analysis is for illustrative purposes only and does not constitute financial advice.</p>
          <p>Generated by Prosperity Projector • {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Export;