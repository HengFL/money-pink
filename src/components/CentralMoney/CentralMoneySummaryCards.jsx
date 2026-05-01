import React from 'react';
import { formatCurrency } from '../../utils/dataProcessor';
import { Wallet, TrendingUp, AlertCircle, Banknote, CreditCard, PiggyBank, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const CentralMoneySummaryCards = ({ totals }) => {
  const balance = (totals.collected + totals.returned) - (totals.withdrawn + totals.borrowed);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-md" style={{ marginBottom: 'var(--spacing-lg)' }}>
      {/* ยอดคงเหลือทั้งหมด (Total Balance) */}
      <div className="bg-card animate-fade-in col-span-2 md:col-span-2 lg:col-span-4" style={{ animationDelay: '0.05s', border: '1px solid var(--accent-info)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--accent-info)', opacity: 0.8, fontSize: '0.875rem', fontWeight: '500' }}>ยอดคงเหลือทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <PiggyBank size={20} style={{ color: 'var(--accent-info)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-info)' }}>
          {formatCurrency(balance)}
        </div>
      </div>

      {/* ยอดเรียกทั้งหมด (Total Called) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--accent-primary)', opacity: 0.8, fontWeight: '500', fontSize: '0.875rem' }}>ยอดเรียกทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <Banknote size={20} className="text-primary" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
          {formatCurrency(totals.called)}
        </div>
      </div>

      {/* ยอดเก็บทั้งหมด (Total Collected) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--accent-success)', opacity: 0.8, fontWeight: '500', fontSize: '0.875rem' }}>ยอดเก็บทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <Wallet size={20} className="text-success" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-success)' }}>
          {formatCurrency(totals.collected)}
        </div>
      </div>

      {/* ยอดค้างทั้งหมด (Total Outstanding) */}
      <div className="bg-card animate-fade-in" style={{ 
        animationDelay: '0.3s', 
        backgroundColor: totals.outstanding === 0 ? 'var(--bg-card)' : '#fef2f2', 
        borderColor: totals.outstanding === 0 ? 'var(--border-color)' : '#fecaca' 
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: totals.outstanding === 0 ? '#64748b' : 'var(--accent-danger)', opacity: 0.8, fontSize: '0.875rem', fontWeight: '600' }}>ยอดค้างทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: totals.outstanding === 0 ? 'rgba(148, 163, 184, 0.1)' : 'rgba(220, 38, 38, 0.15)', borderRadius: 'var(--radius-full)' }}>
            <AlertCircle size={20} style={{ color: totals.outstanding === 0 ? '#94a3b8' : 'var(--accent-danger)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: totals.outstanding === 0 ? '#94a3b8' : 'var(--accent-danger)' }}>
          {formatCurrency(totals.outstanding)}
        </div>
      </div>

      {/* ยอดเบิกเงินทั้งหมด (Total Withdrawn) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--accent-warning)', opacity: 0.8, fontWeight: '500', fontSize: '0.875rem' }}>ยอดเบิกเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <ArrowUpCircle size={20} className="text-warning" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-warning)' }}>
          {formatCurrency(totals.withdrawn)}
        </div>
      </div>

      {/* ยอดยืมเงินทั้งหมด (Total Borrowed) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--accent-secondary)', opacity: 0.8, fontWeight: '500', fontSize: '0.875rem' }}>ยอดยืมเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <ArrowDownCircle size={20} style={{ color: 'var(--accent-secondary)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>
          {formatCurrency(totals.borrowed)}
        </div>
      </div>
      
      {/* ยอดคืนเงินทั้งหมด (Total Returned) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--accent-success)', opacity: 0.8, fontWeight: '500', fontSize: '0.875rem' }}>ยอดคืนเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <TrendingUp size={20} className="text-success" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-success)' }}>
          {formatCurrency(totals.returned)}
        </div>
      </div>

      {/* ยอดค้างคืนทั้งหมด (Total Outstanding Return) */}
      <div className="bg-card animate-fade-in col-span-2 md:col-span-2 lg:col-span-2" style={{ 
        animationDelay: '0.7s', 
        backgroundColor: totals.outstandingReturn === 0 ? 'var(--bg-card)' : '#fef2f2', 
        borderColor: totals.outstandingReturn === 0 ? 'var(--border-color)' : '#fecaca' 
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: totals.outstandingReturn === 0 ? '#64748b' : 'var(--accent-danger)', opacity: 0.8, fontSize: '0.875rem', fontWeight: '600' }}>ยอดค้างคืนทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: totals.outstandingReturn === 0 ? 'rgba(148, 163, 184, 0.1)' : 'rgba(220, 38, 38, 0.15)', borderRadius: 'var(--radius-full)' }}>
            <AlertCircle size={20} style={{ color: totals.outstandingReturn === 0 ? '#94a3b8' : 'var(--accent-danger)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: totals.outstandingReturn === 0 ? '#94a3b8' : 'var(--accent-danger)' }}>
          {formatCurrency(totals.outstandingReturn)}
        </div>
      </div>

    </div>
  );
};
