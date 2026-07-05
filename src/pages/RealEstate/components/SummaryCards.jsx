import React from 'react';
import { formatCurrency } from '../../../utils/dataProcessor';


export const SummaryCards = ({ totals, growth }) => {
  const renderGrowth = (value) => {
    if (value === undefined || value === null) return null;
    const isPositive = value > 0;
    const isNegative = value < 0;
    let color = '#94a3b8';
    let icon = null;
    
    if (isPositive) {
      color = '#16a34a';
      icon = '▲';
    } else if (isNegative) {
      color = '#dc2626';
      icon = '▼';
    } else {
      color = '#64748b';
      icon = '-';
    }

    return (
      <div style={{ fontSize: '0.75rem', fontWeight: '500', color, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
        {icon} {isPositive ? '+' : ''}{value.toFixed(2)}%
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
      {/* ต้นทุนรวม (Total Cost) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.1s', border: '1px solid rgba(219, 39, 119, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#db2777', fontWeight: '500', fontSize: '0.75rem' }}>ต้นทุนทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#fdf2f8', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-wallet" style={{ fontSize: '20px', color: '#db2777' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#db2777' }}>
          {formatCurrency(totals.cost)}
        </div>
        {growth && renderGrowth(growth.cost)}
      </div>

      {/* ยอดจ่ายรวม (Total Paid) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.2s', border: '1px solid rgba(22, 163, 74, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#15803d', fontWeight: '500', fontSize: '0.75rem' }}>ยอดจ่ายทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-credit-card" style={{ fontSize: '20px', color: '#15803d' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#15803d' }}>
          {formatCurrency(totals.paid)}
        </div>
        {growth && renderGrowth(growth.paid)}
      </div>

      {/* ค้างจ่ายรวม (Total Outstanding Pay) */}
      <div className="bg-card animate-fade-in" style={{ 
        animationDelay: '0.3s', 
        border: totals.outstandingPay === 0 ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(220, 38, 38, 0.2)',
        padding: 'var(--spacing-lg)'
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: totals.outstandingPay === 0 ? '#64748b' : '#dc2626', fontSize: '0.75rem', fontWeight: '600' }}>ค้างจ่ายทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: totals.outstandingPay === 0 ? '#f8fafc' : '#fef2f2', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '20px', color: totals.outstandingPay === 0 ? '#94a3b8' : '#dc2626' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: totals.outstandingPay === 0 ? '#94a3b8' : '#dc2626' }}>
          {formatCurrency(totals.outstandingPay)}
        </div>
        {growth && renderGrowth(growth.outstandingPay)}
      </div>

      {/* รายได้รวม (Total Income) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.4s', border: '1px solid rgba(29, 78, 216, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#1d4ed8', fontWeight: '500', fontSize: '0.75rem' }}>รายได้ทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '20px', color: '#1d4ed8' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1d4ed8' }}>
          {formatCurrency(totals.income)}
        </div>
        {growth && renderGrowth(growth.income)}
      </div>
      
      {/* ยอดรับรวม (Total Received) */}
      <div className="bg-card animate-fade-in col-span-1 lg:col-span-2" style={{ animationDelay: '0.45s', border: '1px solid rgba(14, 116, 144, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#0e7490', fontWeight: '500', fontSize: '0.75rem' }}>ยอดรับทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#ecfeff', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-money-bill-wave" style={{ fontSize: '20px', color: '#0e7490' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0e7490' }}>
          {formatCurrency(totals.received)}
        </div>
        {growth && renderGrowth(growth.received)}
      </div>
      
      {/* ค้างรับรวม (Total Outstanding Receive) */}
      <div className="bg-card animate-fade-in col-span-1 lg:col-span-2" style={{ 
        animationDelay: '0.5s',
        border: totals.outstandingReceive === 0 ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(234, 88, 12, 0.2)',
        padding: 'var(--spacing-lg)'
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: totals.outstandingReceive === 0 ? '#64748b' : '#ea580c', fontWeight: totals.outstandingReceive === 0 ? '600' : '500', fontSize: '0.75rem' }}>ค้างรับทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: totals.outstandingReceive === 0 ? '#f8fafc' : '#fff7ed', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-piggy-bank" style={{ fontSize: '20px', color: totals.outstandingReceive === 0 ? '#94a3b8' : '#ea580c' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: totals.outstandingReceive === 0 ? '#94a3b8' : '#ea580c' }}>
          {formatCurrency(totals.outstandingReceive)}
        </div>
        {growth && renderGrowth(growth.outstandingReceive)}
      </div>

    </div>
  );
};
