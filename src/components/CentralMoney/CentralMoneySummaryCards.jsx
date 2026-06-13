import React from 'react';
import { formatCurrency } from '../../utils/dataProcessor';


export const CentralMoneySummaryCards = ({ totals, growth }) => {
  const renderGrowth = (value, inverse = false) => {
    if (value === undefined || value === null) return null;
    const isPositive = value > 0;
    const isNegative = value < 0;
    let color = '#94a3b8';
    let icon = null;
    
    if (isPositive) {
      color = inverse ? '#dcfce7' : '#16a34a';
      icon = '▲';
    } else if (isNegative) {
      color = inverse ? 'rgba(255, 255, 255, 0.9)' : '#dc2626';
      icon = '▼';
    } else {
      color = inverse ? 'rgba(255, 255, 255, 0.7)' : '#64748b';
      icon = '-';
    }

    return (
      <div style={{ fontSize: '0.75rem', fontWeight: '500', color, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
        {icon} {isPositive ? '+' : ''}{value.toFixed(2)}%
      </div>
    );
  };

  const balance = (totals.collected + totals.returned) - (totals.withdrawn + totals.borrowed);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
      {/* ยอดคงเหลือทั้งหมด (Total Balance) */}
      <div className="bg-card animate-fade-in col-span-2 md:col-span-2 lg:col-span-4" style={{ animationDelay: '0.05s', border: '2.5px solid #db2777', backgroundColor: '#fce7f3', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#db2777', fontSize: '0.75rem', fontWeight: '500' }}>ยอดคงเหลือทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#fdf2f8', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-piggy-bank" style={{ fontSize: '20px', color: '#db2777' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#db2777' }}>
          {formatCurrency(balance)}
        </div>
        {growth && renderGrowth(growth.balance)}
      </div>

      {/* ยอดเรียกทั้งหมด (Total Called) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.1s', border: '1px solid rgba(219, 39, 119, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#db2777', fontWeight: '500', fontSize: '0.75rem' }}>ยอดเรียกทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#fdf2f8', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-money-bill-wave" style={{ fontSize: '20px', color: '#db2777' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#db2777' }}>
          {formatCurrency(totals.called)}
        </div>
        {growth && renderGrowth(growth.called)}
      </div>

      {/* ยอดเก็บทั้งหมด (Total Collected) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.2s', border: '1px solid rgba(22, 163, 74, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#15803d', fontWeight: '500', fontSize: '0.75rem' }}>ยอดเก็บทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-wallet" style={{ fontSize: '20px', color: '#15803d' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#15803d' }}>
          {formatCurrency(totals.collected)}
        </div>
        {growth && renderGrowth(growth.collected)}
      </div>

      {/* ยอดค้างทั้งหมด (Total Outstanding) */}
      <div className="bg-card animate-fade-in" style={{ 
        animationDelay: '0.3s', 
        backgroundColor: totals.outstanding === 0 ? 'var(--bg-card)' : 'rgba(254, 242, 242, 0.6)', 
        border: totals.outstanding === 0 ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(220, 38, 38, 0.2)',
        padding: 'var(--spacing-lg)'
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: totals.outstanding === 0 ? '#64748b' : '#dc2626', fontSize: '0.75rem', fontWeight: '600' }}>ยอดค้างทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: totals.outstanding === 0 ? '#f8fafc' : '#fef2f2', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '20px', color: totals.outstanding === 0 ? '#94a3b8' : '#dc2626' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: totals.outstanding === 0 ? '#94a3b8' : '#dc2626' }}>
          {formatCurrency(totals.outstanding)}
        </div>
        {growth && renderGrowth(growth.outstanding)}
      </div>


      {/* ยอดยืมเงินทั้งหมด (Total Borrowed) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.5s', border: '1px solid rgba(29, 78, 216, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#1d4ed8', fontWeight: '500', fontSize: '0.75rem' }}>ยอดยืมเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-circle-arrow-down" style={{ fontSize: '20px', color: '#1d4ed8' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1d4ed8' }}>
          {formatCurrency(totals.borrowed)}
        </div>
        {growth && renderGrowth(growth.borrowed)}
      </div>
      
      {/* ยอดคืนเงินทั้งหมด (Total Returned) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.6s', border: '1px solid rgba(14, 116, 144, 0.2)', padding: 'var(--spacing-lg)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#0e7490', fontWeight: '500', fontSize: '0.75rem' }}>ยอดคืนเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#ecfeff', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '20px', color: '#0e7490' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0e7490' }}>
          {formatCurrency(totals.returned)}
        </div>
        {growth && renderGrowth(growth.returned)}
      </div>

      {/* ยอดค้างคืนทั้งหมด (Total Outstanding Return) */}
      <div className="bg-card animate-fade-in" style={{ 
        animationDelay: '0.7s', 
        backgroundColor: totals.outstandingReturn === 0 ? 'var(--bg-card)' : '#fff7ed', 
        border: totals.outstandingReturn === 0 ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(234, 88, 12, 0.2)',
        padding: 'var(--spacing-lg)'
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: totals.outstandingReturn === 0 ? '#64748b' : '#ea580c', fontSize: '0.75rem', fontWeight: '600' }}>ยอดค้างคืนทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: totals.outstandingReturn === 0 ? '#f8fafc' : '#fff7ed', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '20px', color: totals.outstandingReturn === 0 ? '#94a3b8' : '#ea580c' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: totals.outstandingReturn === 0 ? '#94a3b8' : '#ea580c' }}>
          {formatCurrency(totals.outstandingReturn)}
        </div>
        {growth && renderGrowth(growth.outstandingReturn)}
      </div>

      {/* ยอดเบิกเงินทั้งหมด (Total Withdrawn) */}
      <div className="bg-card animate-fade-in" style={{ 
        animationDelay: '0.8s',
        backgroundColor: totals.withdrawn === 0 ? 'var(--bg-card)' : '#faf5ff', 
        border: '1px solid rgba(109, 40, 217, 0.2)',
        padding: 'var(--spacing-lg)'
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#6d28d9', fontWeight: '500', fontSize: '0.75rem' }}>ยอดเบิกเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: '#faf5ff', borderRadius: 'var(--radius-full)' }}>
            <i className="fa-solid fa-circle-arrow-up" style={{ fontSize: '20px', color: '#6d28d9' }}></i>
          </div>
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#6d28d9' }}>
          {formatCurrency(totals.withdrawn)}
        </div>
        {growth && renderGrowth(growth.withdrawn)}
      </div>

    </div>
  );
};
