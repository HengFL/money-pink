import React from 'react';
import { formatCurrency } from '../../../utils/dataProcessor';


export const MemberCard = ({ member, index }) => {
  const { name, totals, statuses } = member;

  const getProgressStyle = (percent) => {
    if (percent === 0) return { color: '#4b5563', bg: 'none' };
    if (percent > 0 && percent < 50) return { color: '#b91c1c', bg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' };
    if (percent >= 50 && percent < 75) return { color: '#c2410c', bg: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)' };
    if (percent >= 75 && percent < 100) return { color: '#b45309', bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' };
    if (percent >= 100) return { color: '#15803d', bg: 'linear-gradient(135deg, #10b981 0%, #15803d 100%)' };
    return { color: '#4b5563', bg: 'none' };
  };

  return (
    <div className="bg-card animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s`, marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-lg)' }}>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center" style={{ marginBottom: 'var(--spacing-sm)', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--border-color)', gap: 'var(--spacing-sm)' }}>
        <div className="flex items-center gap-sm">
          <div style={{ padding: '0.35rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-user" style={{ fontSize: '16px', color: 'var(--text-primary)' }}></i>
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{name}</h2>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
        <div>
          <p style={{ color: '#db2777', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ต้นทุน</p>
          <p style={{ fontSize: '1rem', fontWeight: '600', color: '#db2777' }}>{formatCurrency(totals.cost)}</p>
        </div>
        <div>
          <p style={{ color: '#15803d', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดจ่าย</p>
          <p style={{ fontSize: '1rem', fontWeight: '600', color: '#15803d' }}>{formatCurrency(totals.paid)}</p>
        </div>
        <div>
          <p style={{ color: totals.outstandingPay === 0 ? '#94a3b8' : '#dc2626', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ค้างจ่าย</p>
          <p style={{ fontSize: '1rem', fontWeight: '600', color: totals.outstandingPay === 0 ? '#94a3b8' : '#dc2626' }}>{formatCurrency(totals.outstandingPay)}</p>
        </div>
        {totals.income !== 0 && (
          <>
            <div>
              <p style={{ color: '#1d4ed8', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>รายได้</p>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1d4ed8' }}>{formatCurrency(totals.income)}</p>
            </div>
            <div>
              <p style={{ color: '#0e7490', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดรับ</p>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: '#0e7490' }}>{formatCurrency(totals.received)}</p>
            </div>
            <div>
              <p style={{ color: totals.outstandingReceive === 0 ? '#94a3b8' : '#ea580c', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ค้างรับ</p>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: totals.outstandingReceive === 0 ? '#94a3b8' : '#ea580c' }}>{formatCurrency(totals.outstandingReceive)}</p>
            </div>
          </>
        )}
      </div>
      

    </div>
  );
};
