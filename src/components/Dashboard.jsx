import React from 'react';
import { SummaryCards } from './SummaryCards';
import { MemberCard } from './MemberCard';
import { Charts } from './Charts';

export const Dashboard = ({ data, availableYears, selectedYear, onYearChange, availableMembers, selectedMember, onMemberChange }) => {
  const { totals, members } = data;

  return (
    <div style={{ padding: 'var(--spacing-xl) 0', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          Investment Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>ระบบสรุปผลการลงทุนและสถานะการเงินของสมาชิก</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {availableYears.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ปีที่ลงทุน:</span>
              <select 
                value={selectedYear} 
                onChange={(e) => onYearChange(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="All" style={{ color: '#000' }}>ทั้งหมด</option>
                {availableYears.map(year => (
                  <option key={year} value={year} style={{ color: '#000' }}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {availableMembers && availableMembers.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>สมาชิก:</span>
              <select 
                value={selectedMember} 
                onChange={(e) => onMemberChange(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="All" style={{ color: '#000' }}>ทั้งหมด</option>
                {availableMembers.map(member => (
                  <option key={member} value={member} style={{ color: '#000' }}>{member}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      <SummaryCards totals={totals} />
      
      <Charts data={data} />

      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          รายละเอียดสมาชิก
          <span style={{ fontSize: '0.875rem', fontWeight: 'normal', backgroundColor: 'var(--bg-hover)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
            {members.length} ท่าน
          </span>
        </h2>
        
        <div className="grid grid-cols-1 gap-md">
          {members.map((member, index) => (
            <MemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
