import React from 'react';
import { formatCurrency } from '../../utils/dataProcessor';
import { User, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export const CentralMoneyMemberCard = ({ member, index }) => {
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

      {totals.collected > 0 && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ความคืบหน้ายอดเก็บ</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: (totals.called > 0 && totals.collected >= totals.called) ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
              {totals.called > 0 ? ((totals.collected / totals.called) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${totals.called > 0 ? Math.min(100, (totals.collected / totals.called) * 100) : 0}%`, 
                backgroundColor: (totals.called > 0 && totals.collected >= totals.called) ? 'var(--accent-success)' : 'var(--accent-danger)',
                backgroundImage: (totals.called > 0 && totals.collected >= totals.called) ? 'var(--gradient-success)' : 'var(--gradient-danger)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 1s ease-in-out'
              }} 
            />
          </div>
        </div>
      )}

      {totals.borrowed > 0 && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ความคืบหน้ายอดคืนเงิน</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: (totals.borrowed > 0 && totals.returned >= totals.borrowed) ? 'var(--accent-info)' : 'var(--accent-orange)' }}>
              {((totals.returned / totals.borrowed) * 100).toFixed(1)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, Math.max(0, (totals.returned / totals.borrowed) * 100))}%`, 
                backgroundColor: (totals.borrowed > 0 && totals.returned >= totals.borrowed) ? 'var(--accent-info)' : 'var(--accent-orange)',
                backgroundImage: (totals.borrowed > 0 && totals.returned >= totals.borrowed) ? 'var(--gradient-info)' : 'var(--gradient-orange)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 1s ease-in-out'
              }} 
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {totals.called !== 0 && (
          <>
            <div>
              <p style={{ color: 'var(--text-primary)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดเรียก</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(totals.called)}</p>
            </div>
            <div>
              <p style={{ color: 'var(--accent-success)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดเก็บ</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-success)' }}>{formatCurrency(totals.collected)}</p>
            </div>
          </>
        )}
        {totals.withdrawn !== 0 && (
          <div>
            <p style={{ color: 'var(--accent-warning)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดเบิกเงิน</p>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-warning)' }}>{formatCurrency(totals.withdrawn)}</p>
          </div>
        )}
        {totals.borrowed !== 0 && (
          <>
            <div>
              <p style={{ color: 'var(--accent-secondary)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดยืมเงิน</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-secondary)' }}>{formatCurrency(totals.borrowed)}</p>
            </div>
            <div>
              <p style={{ color: 'var(--accent-success)', opacity: 0.8, fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>ยอดคืนเงิน</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-success)' }}>{formatCurrency(totals.returned)}</p>
            </div>
          </>
        )}
      </div>
      
      {(totals.outstanding > 0 || totals.outstandingReturn > 0) && (
        <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-sm)', borderTop: '1px dashed var(--border-color)' }} className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {totals.outstanding > 0 && (
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              ยอดค้าง: {formatCurrency(totals.outstanding)}
            </p>
          )}
          {totals.outstandingReturn > 0 && (
            <p style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              ยอดค้างคืน: {formatCurrency(totals.outstandingReturn)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
