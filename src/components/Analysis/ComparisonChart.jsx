import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const ComparisonChart = ({ data, assumptions, toggles }) => {
  if (!data) return null;

  // Prepare chart data
  const chartData = [];
  const maxLength = Math.max(
    data.iul.balances.length,
    data.ira.balances.length,
    data.k401.balances.length,
    data.mutualFund.balances.length
  );

  for (let i = 0; i < maxLength; i++) {
    const age = assumptions.age + i;
    const isRetirement = age >= 65;
    
    chartData.push({
      age,
      year: i + 1,
      IUL: data.iul.balances[i] || 0,
      IRA: data.ira.balances[i] || 0,
      '401k': data.k401.balances[i] || 0,
      'Mutual Fund': data.mutualFund.balances[i] || 0,
      isRetirement
    });
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{`Age: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="age" 
            label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            label={{ value: 'Account Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Retirement line */}
          <ReferenceLine x={65} stroke="#dc2626" strokeDasharray="5 5" label="Retirement" />
          
          <Line 
            type="monotone" 
            dataKey="IUL" 
            stroke="#1e40af" 
            strokeWidth={3}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="IRA" 
            stroke="#ea580c" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="401k" 
            stroke="#16a34a" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Mutual Fund" 
            stroke="#dc2626" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;