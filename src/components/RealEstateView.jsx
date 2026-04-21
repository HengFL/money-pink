import React, { useState, useEffect, useMemo } from 'react';
import { processDashboardData } from '../utils/dataProcessor';
import { Dashboard } from './Dashboard';
import { Loader2, AlertCircle } from 'lucide-react';

const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMUXZc8ENGNqufB_jL4JGclgSzTkMibN3C75zrLGNNMnodQRnI8bc9whGWox-9MM5wzU7BFvb7_u55RDkT5Ha7MeAcjIjDG3Q6jDWaTOFxkMO5zBuEj7g5jXb9U3KqsLKVW94CJrJ7DgRgZJWmCciwqMRORQ6rPLZHBqTjb1ZsXyi8dKQVRpbQZib4Z2PmAdJ9yhyB5HplDinyL2PfHQRO9pIPmfnhk_Kg3s0yP4iruq5Rg_uJ43o_4T6bpm3glEQcN43ODS9xZXJW-IfLU&lib=MIJPxqDUveZMHAuU6EOU0QllmX6t1pghm';

export const RealEstateView = () => {
  const [rawData, setRawData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMember, setSelectedMember] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
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
    const customOrder = ['รอมือลาห์', 'ปาตีเมาะห์', 'อิบรอเฮง', 'ซากีเราะห์'];
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
    
    return processDashboardData(filtered, selectedYear);
  }, [rawData, selectedYear, selectedMember]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={48} className="text-primary" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-full)' }}>
          <AlertCircle size={48} className="text-danger" />
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
        <Dashboard 
          data={dashboardData} 
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableMembers={availableMembers}
          selectedMember={selectedMember}
          onMemberChange={setSelectedMember}
        />
      )}
    </div>
  );
};
