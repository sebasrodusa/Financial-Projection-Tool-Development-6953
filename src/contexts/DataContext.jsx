import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data generators
const generateMockIllustrations = () => [
  {
    id: '1',
    clientName: 'Robert Johnson',
    uploadDate: '2024-01-15',
    pdfUrl: 'https://example.com/iul1.pdf',
    status: 'analyzed',
    extractedData: {
      premiums: Array.from({ length: 30 }, (_, i) => 12000 + (i * 200)),
      deathBenefits: Array.from({ length: 30 }, (_, i) => 500000 + (i * 5000)),
      cashValues: Array.from({ length: 30 }, (_, i) => i * 8000 + Math.random() * 2000),
      incomeStream: Array.from({ length: 20 }, (_, i) => 25000 + (i * 500))
    }
  },
  {
    id: '2',
    clientName: 'Sarah Williams',
    uploadDate: '2024-01-20',
    pdfUrl: 'https://example.com/iul2.pdf',
    status: 'pending',
    extractedData: null
  },
  {
    id: '3',
    clientName: 'Michael Davis',
    uploadDate: '2024-01-25',
    pdfUrl: 'https://example.com/iul3.pdf',
    status: 'analyzed',
    extractedData: {
      premiums: Array.from({ length: 25 }, (_, i) => 15000 + (i * 300)),
      deathBenefits: Array.from({ length: 25 }, (_, i) => 750000 + (i * 7500)),
      cashValues: Array.from({ length: 25 }, (_, i) => i * 12000 + Math.random() * 3000),
      incomeStream: Array.from({ length: 15 }, (_, i) => 35000 + (i * 750))
    }
  }
];

export const DataProvider = ({ children }) => {
  const [illustrations, setIllustrations] = useState(generateMockIllustrations());
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  const addIllustration = (illustrationData) => {
    const newIllustration = {
      id: Date.now().toString(),
      ...illustrationData,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setIllustrations(prev => [newIllustration, ...prev]);
    return newIllustration;
  };

  const updateIllustration = (id, updates) => {
    setIllustrations(prev => prev.map(ill => 
      ill.id === id ? { ...ill, ...updates } : ill
    ));
  };

  const deleteIllustration = (id) => {
    setIllustrations(prev => prev.filter(ill => ill.id !== id));
  };

  // Mock OCR extraction
  const extractDataFromPDF = async (pdfUrl) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      premiums: Array.from({ length: 30 }, (_, i) => 10000 + (i * 250) + Math.random() * 1000),
      deathBenefits: Array.from({ length: 30 }, (_, i) => 400000 + (i * 4000) + Math.random() * 10000),
      cashValues: Array.from({ length: 30 }, (_, i) => i * 7500 + Math.random() * 2500),
      incomeStream: Array.from({ length: 20 }, (_, i) => 20000 + (i * 400) + Math.random() * 1000)
    };
  };

  const calculateComparisons = (iulData, assumptions) => {
    const { age, contributionAmount, returnRate, taxRateWorking, taxRateRetirement, fees } = assumptions;
    const yearsToRetirement = 65 - age;
    const retirementYears = 25;

    // IRA Calculation
    const iraData = {
      contributions: [],
      balances: [],
      taxes: [],
      income: []
    };

    let iraBalance = 0;
    for (let i = 0; i < yearsToRetirement; i++) {
      iraBalance = iraBalance * (1 + returnRate - fees) + contributionAmount;
      iraData.contributions.push(contributionAmount * (i + 1));
      iraData.balances.push(iraBalance);
      iraData.taxes.push(0); // Tax deferred
    }

    // Retirement income for IRA
    for (let i = 0; i < retirementYears; i++) {
      const withdrawal = iraBalance * 0.04; // 4% rule
      iraData.income.push(withdrawal * (1 - taxRateRetirement));
      iraBalance = iraBalance * (1 + returnRate - fees) - withdrawal;
    }

    // 401k Calculation (similar to IRA but with employer match)
    const k401Data = {
      contributions: [],
      balances: [],
      taxes: [],
      income: []
    };

    let k401Balance = 0;
    const employerMatch = contributionAmount * 0.5; // 50% match
    for (let i = 0; i < yearsToRetirement; i++) {
      k401Balance = k401Balance * (1 + returnRate - fees) + contributionAmount + employerMatch;
      k401Data.contributions.push((contributionAmount + employerMatch) * (i + 1));
      k401Data.balances.push(k401Balance);
      k401Data.taxes.push(0); // Tax deferred
    }

    for (let i = 0; i < retirementYears; i++) {
      const withdrawal = k401Balance * 0.04;
      k401Data.income.push(withdrawal * (1 - taxRateRetirement));
      k401Balance = k401Balance * (1 + returnRate - fees) - withdrawal;
    }

    // Mutual Fund (Taxable)
    const mutualFundData = {
      contributions: [],
      balances: [],
      taxes: [],
      income: []
    };

    let mfBalance = 0;
    for (let i = 0; i < yearsToRetirement; i++) {
      const growth = mfBalance * returnRate;
      const taxes = growth * taxRateWorking; // Tax on growth
      mfBalance = (mfBalance + contributionAmount + growth - taxes) * (1 - fees);
      mutualFundData.contributions.push(contributionAmount * (i + 1));
      mutualFundData.balances.push(mfBalance);
      mutualFundData.taxes.push(taxes);
    }

    for (let i = 0; i < retirementYears; i++) {
      const withdrawal = mfBalance * 0.04;
      const capitalGainsTax = withdrawal * 0.15; // Long-term capital gains
      mutualFundData.income.push(withdrawal - capitalGainsTax);
      mfBalance = mfBalance * (1 + returnRate - fees) - withdrawal;
    }

    return {
      iul: {
        contributions: iulData.premiums,
        balances: iulData.cashValues,
        income: iulData.incomeStream,
        deathBenefit: iulData.deathBenefits,
        taxes: Array(iulData.premiums.length).fill(0) // Tax-free growth
      },
      ira: iraData,
      k401: k401Data,
      mutualFund: mutualFundData
    };
  };

  const value = {
    illustrations,
    currentAnalysis,
    setCurrentAnalysis,
    addIllustration,
    updateIllustration,
    deleteIllustration,
    extractDataFromPDF,
    calculateComparisons
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};