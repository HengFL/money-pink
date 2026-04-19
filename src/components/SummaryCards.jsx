import React from 'react';
import { formatCurrency } from '../utils/dataProcessor';
import { Wallet, TrendingUp, AlertCircle, Banknote, CreditCard, PiggyBank } from 'lucide-react';

export const SummaryCards = ({ totals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md" style={{ marginBottom: 'var(--spacing-xl)' }}>
      {/* ต้นทุนรวม (Total Cost) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ต้นทุนทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <Wallet size={20} className="text-primary" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.cost)}
        </div>
      </div>

      {/* ยอดจ่ายรวม (Total Paid) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ยอดจ่ายทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <CreditCard size={20} className="text-success" />
          </div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.paid)}
        </div>
      </div>

      {/* ค้างจ่ายรวม (Total Outstanding Pay) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ค้างจ่ายทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <AlertCircle size={20} className="text-danger" />
          </div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.outstandingPay)}
        </div>
      </div>

      {/* รายได้รวม (Total Income) */}
      <div className="bg-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>รายได้ทั้งหมด</h3>
          <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <TrendingUp size={20} className="text-warning" />
          </div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {formatCurrency(totals.income)}
        </div>
      </div>
      
      {/* ค้างรับรวม (Total Outstanding Receive) */}
      <div className="bg-card animate-fade-in md:col-span-2 lg:col-span-4" style={{ animationDelay: '0.5s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-md">
           <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-full)' }}>
            <PiggyBank size={24} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ค้างรับทั้งหมด</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {formatCurrency(totals.outstandingReceive)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
