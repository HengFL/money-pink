import React from 'react';
import { formatCurrency } from '../../utils/dataProcessor';
import { Wallet, TrendingUp, AlertCircle, Banknote, CreditCard, PiggyBank, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const CentralMoneySummaryCards = ({ totals }) => {
  const balance = (totals.collected + totals.returned) - (totals.withdrawn + totals.borrowed);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-md" style={{ marginBottom: 'var(--spacing-xl)' }}>
      {/* ยอดคงเหลือทั้งหมด (Total Balance) */}
      <div className="bg-card animate-fade-in col-span-2 md:col-span-2 lg:col-span-4" style={{ animationDelay: '0.05s', border: '2px solid var(--accent-primary)', background: 'linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>ยอดคงเหลือทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-primary)', borderRadius: 'var(--radius-full)' }}>
            <PiggyBank size={24} style={{ color: 'white' }} />
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
          {formatCurrency(balance)}
        </div>
      </div>

      {/* ยอดเรียกทั้งหมด (Total Called) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ยอดเรียกทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <Banknote size={20} className="text-primary" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.called)}
        </div>
      </div>

      {/* ยอดเก็บทั้งหมด (Total Collected) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ยอดเก็บทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <Wallet size={20} className="text-success" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.collected)}
        </div>
      </div>

      {/* ยอดค้างทั้งหมด (Total Outstanding) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.3s', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#991b1b', fontSize: '0.875rem', fontWeight: '600' }}>ยอดค้างทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: 'var(--radius-full)' }}>
            <AlertCircle size={20} className="text-danger" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-danger)' }}>
          {formatCurrency(totals.outstanding)}
        </div>
      </div>

      {/* ยอดเบิกเงินทั้งหมด (Total Withdrawn) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ยอดเบิกเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <ArrowUpCircle size={20} className="text-warning" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.withdrawn)}
        </div>
      </div>

      {/* ยอดยืมเงินทั้งหมด (Total Borrowed) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ยอดยืมเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <ArrowDownCircle size={20} style={{ color: 'var(--accent-secondary)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.borrowed)}
        </div>
      </div>
      
      {/* ยอดคืนเงินทั้งหมด (Total Returned) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ยอดคืนเงินทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <TrendingUp size={20} className="text-success" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.returned)}
        </div>
      </div>

      {/* ยอดค้างคืนทั้งหมด (Total Outstanding Return) */}
      <div className="bg-card animate-fade-in col-span-2 md:col-span-2 lg:col-span-2" style={{ animationDelay: '0.7s', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: '#991b1b', fontSize: '0.875rem', fontWeight: '600' }}>ยอดค้างคืนทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: 'var(--radius-full)' }}>
            <AlertCircle size={20} className="text-danger" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-danger)' }}>
          {formatCurrency(totals.outstandingReturn)}
        </div>
      </div>

    </div>
  );
};
