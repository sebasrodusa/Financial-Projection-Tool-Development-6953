import React from 'react';

const ComparisonTable = ({ data, assumptions, toggles }) => {
  if (!data) return null;

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
    const totalIncome = dataset.income ? dataset.income.reduce((sum, inc) => sum + inc, 0) : 0;
    
    return {
      totalContributions,
      finalBalance,
      totalTaxes,
      totalIncome,
      netReturn: finalBalance - totalContributions
    };
  };

  const iulTotals = calculateTotals(data.iul);
  const iraTotals = calculateTotals(data.ira);
  const k401Totals = calculateTotals(data.k401);
  const mutualFundTotals = calculateTotals(data.mutualFund);

  const rows = [
    {
      metric: 'Total Contributions',
      iul: iulTotals.totalContributions,
      ira: iraTotals.totalContributions,
      k401: k401Totals.totalContributions,
      mutualFund: mutualFundTotals.totalContributions
    },
    {
      metric: 'Final Balance',
      iul: iulTotals.finalBalance,
      ira: iraTotals.finalBalance,
      k401: k401Totals.finalBalance,
      mutualFund: mutualFundTotals.finalBalance
    },
    {
      metric: 'Net Return',
      iul: iulTotals.netReturn,
      ira: iraTotals.netReturn,
      k401: k401Totals.netReturn,
      mutualFund: mutualFundTotals.netReturn
    },
    {
      metric: 'Total Taxes Paid',
      iul: iulTotals.totalTaxes,
      ira: iraTotals.totalTaxes,
      k401: k401Totals.totalTaxes,
      mutualFund: mutualFundTotals.totalTaxes
    },
    {
      metric: 'Retirement Income (Total)',
      iul: iulTotals.totalIncome,
      ira: iraTotals.totalIncome,
      k401: k401Totals.totalIncome,
      mutualFund: mutualFundTotals.totalIncome
    },
    {
      metric: 'Death Benefit',
      iul: data.iul.deathBenefit ? data.iul.deathBenefit[data.iul.deathBenefit.length - 1] : 0,
      ira: iraTotals.finalBalance,
      k401: k401Totals.finalBalance,
      mutualFund: mutualFundTotals.finalBalance
    }
  ];

  const getBestValue = (row) => {
    const values = [row.iul, row.ira, row.k401, row.mutualFund];
    if (row.metric === 'Total Taxes Paid') {
      return Math.min(...values);
    }
    return Math.max(...values);
  };

  const isHighlighted = (value, row) => {
    const best = getBestValue(row);
    return value === best;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Metric
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-financial-blue rounded-full mr-2"></div>
                IUL
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-financial-orange rounded-full mr-2"></div>
                IRA
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-financial-green rounded-full mr-2"></div>
                401(k)
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-financial-red rounded-full mr-2"></div>
                Mutual Fund
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.metric}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                isHighlighted(row.iul, row) 
                  ? 'text-financial-blue font-semibold bg-blue-50' 
                  : 'text-gray-900'
              }`}>
                {formatCurrency(row.iul)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                isHighlighted(row.ira, row) 
                  ? 'text-financial-orange font-semibold bg-orange-50' 
                  : 'text-gray-900'
              }`}>
                {formatCurrency(row.ira)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                isHighlighted(row.k401, row) 
                  ? 'text-financial-green font-semibold bg-green-50' 
                  : 'text-gray-900'
              }`}>
                {formatCurrency(row.k401)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                isHighlighted(row.mutualFund, row) 
                  ? 'text-financial-red font-semibold bg-red-50' 
                  : 'text-gray-900'
              }`}>
                {formatCurrency(row.mutualFund)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;