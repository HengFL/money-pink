import React from 'react';
import { formatCurrency } from '../utils/dataProcessor';
import { User, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export const MemberCard = ({ member, index }) => {
  const { name, totals, statuses } = member;



  return (
    <div className="bg-card animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s`, marginBottom: 'var(--spacing-md)' }}>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center" style={{ marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--border-color)', gap: 'var(--spacing-sm)' }}>
        <div className="flex items-center gap-sm">
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
            <User size={20} style={{ color: 'var(--text-primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{name}</h2>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ความคืบหน้ายอดจ่าย</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: (totals.cost > 0 && totals.paid >= totals.cost) ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
            {totals.cost > 0 ? ((totals.paid / totals.cost) * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${totals.cost > 0 ? Math.min(100, (totals.paid / totals.cost) * 100) : 0}%`, 
              backgroundColor: (totals.cost > 0 && totals.paid >= totals.cost) ? 'var(--accent-success)' : 'var(--accent-danger)',
              backgroundImage: (totals.cost > 0 && totals.paid >= totals.cost) ? 'var(--gradient-success)' : 'var(--gradient-danger)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 1s ease-in-out'
            }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        <div>
          <p style={{ color: 'var(--text-primary)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ต้นทุน</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(totals.cost)}</p>
        </div>
        <div>
          <p style={{ color: 'var(--accent-success)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดจ่าย</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-success)' }}>{formatCurrency(totals.paid)}</p>
        </div>
        {totals.income !== 0 && (
          <>
            <div>
              <p style={{ color: 'var(--accent-warning)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>รายได้</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-warning)' }}>{formatCurrency(totals.income)}</p>
            </div>
            <div>
              <p style={{ color: 'var(--accent-secondary)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดรับ</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-secondary)' }}>{formatCurrency(totals.received)}</p>
            </div>
          </>
        )}
      </div>
      
      {totals.outstandingPay > 0 && (
        <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-sm)', borderTop: '1px dashed var(--border-color)' }}>
           <p style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} />
            ยอดค้างจ่าย: {formatCurrency(totals.outstandingPay)}
          </p>
        </div>
      )}
    </div>
  );
};
