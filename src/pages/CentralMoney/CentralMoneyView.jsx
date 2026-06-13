import React, { useState, useEffect, useMemo } from 'react';
import { processCentralMoneyData } from '../../utils/centralMoneyDataProcessor';
import { CentralMoneyDashboard } from './components/CentralMoneyDashboard';
import { CENTRAL_MONEY_API_URL, MEMBER_ORDER } from '../../config/constants';

export const CentralMoneyView = () => {
  const [rawData, setRawData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMember, setSelectedMember] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(CENTRAL_MONEY_API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      setRawData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableYears = useMemo(() => {
    if (!rawData) return [];
    const years = new Set(rawData.map(item => String(item.source_year || 'ไม่ระบุ')));
    return Array.from(years).sort().reverse();
  }, [rawData]);

  const availableMembers = useMemo(() => {
    if (!rawData) return [];
    const members = new Set(rawData.map(item => item['สมาชิก'] ? String(item['สมาชิก']).trim() : '').filter(Boolean));
    const customOrder = MEMBER_ORDER;
    return Array.from(members).sort((a, b) => {
      const indexA = customOrder.indexOf(a);
      const indexB = customOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [rawData]);

  const dashboardData = useMemo(() => {
    if (!rawData) return null;
    let filtered = rawData;
    
    if (selectedYear !== 'All') {
      filtered = filtered.filter(item => String(item.source_year || 'ไม่ระบุ') === selectedYear);
    }
    
    if (selectedMember !== 'All') {
      filtered = filtered.filter(item => (item['สมาชิก'] ? String(item['สมาชิก']).trim() : '') === selectedMember);
    }
    
    const processed = processCentralMoneyData(filtered, selectedYear);

    // Calculate growth
    let currentYearStr, prevYearStr;
    if (selectedYear === 'All') {
      const maxYear = Math.max(...rawData.map(item => Number(item.source_year)).filter(y => !isNaN(y)));
      const currentYear = maxYear > 0 ? maxYear : new Date().getFullYear();
      currentYearStr = String(currentYear);
      prevYearStr = String(currentYear - 1);
    } else {
      currentYearStr = selectedYear;
      prevYearStr = String(parseInt(selectedYear) - 1);
    }

    const currentYearData = rawData.filter(item => String(item.source_year || 'ไม่ระบุ') === currentYearStr);
    const prevYearData = rawData.filter(item => String(item.source_year || 'ไม่ระบุ') === prevYearStr);

    let currentFiltered = currentYearData;
    let prevFiltered = prevYearData;

    if (selectedMember !== 'All') {
      currentFiltered = currentFiltered.filter(item => (item['สมาชิก'] ? String(item['สมาชิก']).trim() : '') === selectedMember);
      prevFiltered = prevFiltered.filter(item => (item['สมาชิก'] ? String(item['สมาชิก']).trim() : '') === selectedMember);
    }

    const calculateTotals = (data) => {
      return data.reduce((acc, item) => {
        acc.called += Number(item['ยอดเรียก (฿)']) || 0;
        acc.collected += Number(item['ยอดเก็บ (฿)']) || 0;
        acc.outstanding += Number(item['ยอดค้าง (฿)']) || 0;
        acc.withdrawn += Number(item['ยอดเบิกเงิน (฿)']) || 0;
        acc.borrowed += Number(item['ยอดยืมเงิน (฿)']) || 0;
        acc.returned += Number(item['ยอดคืนเงิน (฿)']) || 0;
        acc.outstandingReturn += Number(item['ยอดค้างคืน (฿)']) || 0;
        return acc;
      }, { called: 0, collected: 0, outstanding: 0, withdrawn: 0, borrowed: 0, returned: 0, outstandingReturn: 0 });
    };

    const currentTotals = calculateTotals(currentFiltered);
    const prevTotals = calculateTotals(prevFiltered);

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const calculateBalance = (t) => (t.collected + t.returned) - (t.withdrawn + t.borrowed);
    const currentBalance = calculateBalance(currentTotals);
    const prevBalance = calculateBalance(prevTotals);

    processed.growth = {
      called: calculateGrowth(currentTotals.called, prevTotals.called),
      collected: calculateGrowth(currentTotals.collected, prevTotals.collected),
      outstanding: calculateGrowth(currentTotals.outstanding, prevTotals.outstanding),
      withdrawn: calculateGrowth(currentTotals.withdrawn, prevTotals.withdrawn),
      borrowed: calculateGrowth(currentTotals.borrowed, prevTotals.borrowed),
      returned: calculateGrowth(currentTotals.returned, prevTotals.returned),
      outstandingReturn: calculateGrowth(currentTotals.outstandingReturn, prevTotals.outstandingReturn),
      balance: calculateGrowth(currentBalance, prevBalance)
    };

    return processed;
  }, [rawData, selectedYear, selectedMember]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <i className="fa-solid fa-spinner fa-spin text-primary" style={{ fontSize: '48px' }}></i>
        <p style={{ color: 'var(--text-secondary)' }}>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-full)' }}>
          <i className="fa-solid fa-circle-exclamation text-danger" style={{ fontSize: '48px' }}></i>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>เกิดข้อผิดพลาด</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: 'var(--accent-primary)', 
            color: 'white', 
            border: 'none', 
            borderRadius: 'var(--radius-md)',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div>
      {dashboardData && (
        <CentralMoneyDashboard 
          data={dashboardData} 
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableMembers={availableMembers}
          selectedMember={selectedMember}
          onMemberChange={setSelectedMember}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};
