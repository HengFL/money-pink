import React from 'react';
import { formatCurrency } from '../../utils/dataProcessor';
import { User, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export const CentralMoneyMemberCard = ({ member, index }) => {
  const { name, totals, statuses } = member;

  const StatusBadge = ({ count, label, type }) => {
    if (count === 0) return null;
    let badgeClass = 'badge ';
    let Icon = HelpCircle;
    
    if (type === 'success') {
      badgeClass += 'badge-success';
      Icon = CheckCircle;
    } else if (type === 'danger') {
      badgeClass += 'badge-danger';
      Icon = AlertTriangle;
    } else {
      badgeClass += 'badge-warning';
    }

    return (
      <div className={badgeClass} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.5rem', marginBottom: '0.5rem' }}>
        <Icon size={14} />
        <span>{label}: {count}</span>
      </div>
    );
  };

  return (
    <div className="bg-card animate-fade-in" style={{ animationDelay: `${0.1 * (index + 1)}s`, marginBottom: 'var(--spacing-md)' }}>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center" style={{ marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--border-color)', gap: 'var(--spacing-sm)' }}>
        <div className="flex items-center gap-sm">
          <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)' }}>
            <User size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{name}</h2>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }} className="md:justify-end">
          <StatusBadge count={statuses['จ่ายแล้ว']} label="จ่ายแล้ว" type="success" />
          <StatusBadge count={statuses['ค้างจ่าย']} label="ค้างจ่าย" type="danger" />
          {Object.entries(statuses).map(([key, count]) => {
            if (key !== 'จ่ายแล้ว' && key !== 'ค้างจ่าย' && key !== 'อื่นๆ' && count > 0) {
              return <StatusBadge key={key} count={count} label={key} type="warning" />;
            }
            return null;
          })}
        </div>
      </div>

      {totals.collected > 0 && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ความคืบหน้ายอดเก็บ</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-success)' }}>
              {totals.called > 0 ? ((totals.collected / totals.called) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${totals.called > 0 ? Math.min(100, (totals.collected / totals.called) * 100) : 0}%`, 
                backgroundColor: 'var(--accent-success)',
                backgroundImage: 'var(--gradient-success)',
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
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
              {((totals.returned / totals.borrowed) * 100).toFixed(1)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, Math.max(0, (totals.returned / totals.borrowed) * 100))}%`, 
                backgroundColor: 'var(--accent-primary)',
                backgroundImage: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 1s ease-in-out'
              }} 
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>ยอดเรียก</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>{formatCurrency(totals.called)}</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>ยอดเก็บ</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-success)' }}>{formatCurrency(totals.collected)}</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>ยอดเบิกเงิน</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-warning)' }}>{formatCurrency(totals.withdrawn)}</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>ยอดยืมเงิน</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-secondary)' }}>{formatCurrency(totals.borrowed)}</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>ยอดคืนเงิน</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-success)' }}>{formatCurrency(totals.returned)}</p>
        </div>
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
