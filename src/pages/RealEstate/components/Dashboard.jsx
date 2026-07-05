import React, { useRef, useState } from 'react';
import { SummaryCards } from './SummaryCards';
import { MemberCard } from './MemberCard';
import { Charts } from './Charts';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';

export const Dashboard = ({ data, availableYears, selectedYear, onYearChange, availableMembers, selectedMember, onMemberChange, onRefresh }) => {
  const { totals, members, growth } = data;
  const summaryAreaRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [memberViewMode, setMemberViewMode] = useState('list');

  const realEstateMetrics = [
    { key: 'cost', label: 'ต้นทุน', color: '#db2777' },
    { key: 'paid', label: 'ยอดจ่าย', color: '#15803d' },
    { key: 'outstandingPay', label: 'ค้างจ่าย', color: '#dc2626' },
    { key: 'income', label: 'รายได้', color: '#1d4ed8' },
    { key: 'received', label: 'ยอดรับ', color: '#0e7490' },
    { key: 'outstandingReceive', label: 'ค้างรับ', color: '#ea580c' }
  ];

  const handleCapture = () => {
    if (summaryAreaRef.current) {
      const buttons = summaryAreaRef.current.querySelectorAll('.no-capture');
      buttons.forEach(btn => btn.style.display = 'none');

      html2canvas(summaryAreaRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          const animatedElements = clonedDoc.querySelectorAll('.animate-fade-in');
          animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '1';
          });
          const titles = clonedDoc.querySelectorAll('.capture-title');
          titles.forEach(el => {
            el.style.background = 'transparent';
            el.style.WebkitBackgroundClip = 'initial';
            el.style.WebkitTextFillColor = 'initial';
            el.style.color = '#3b82f6';
          });
        }
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `summary-report.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        buttons.forEach(btn => btn.style.display = 'flex');
      });
    }
  };

  const handleCopy = () => {
    if (summaryAreaRef.current) {
      const buttons = summaryAreaRef.current.querySelectorAll('.no-capture');
      buttons.forEach(btn => btn.style.display = 'none');

      html2canvas(summaryAreaRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          const animatedElements = clonedDoc.querySelectorAll('.animate-fade-in');
          animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '1';
          });
          const titles = clonedDoc.querySelectorAll('.capture-title');
          titles.forEach(el => {
            el.style.background = 'transparent';
            el.style.WebkitBackgroundClip = 'initial';
            el.style.WebkitTextFillColor = 'initial';
            el.style.color = '#3b82f6';
          });
        }
      }).then(canvas => {
        canvas.toBlob(blob => {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              setToast({ show: true, message: 'คัดลอกรูปภาพลง Clipboard สำเร็จ' });
              setTimeout(() => setToast({ show: false, message: '' }), 2000);
            }).catch(err => {
              console.error('Failed to copy image: ', err);
              setToast({ show: true, message: 'ไม่สามารถคัดลอกรูปภาพได้' });
              setTimeout(() => setToast({ show: false, message: '' }), 2000);
            });
          } catch (e) {
            console.error('ClipboardItem not supported or error: ', e);
            setToast({ show: true, message: 'เบราว์เซอร์ของคุณไม่สนับสนุนการคัดลอกรูปภาพโดยตรง' });
            setTimeout(() => setToast({ show: false, message: '' }), 2000);
          }
          buttons.forEach(btn => btn.style.display = 'flex');
        }, 'image/png');
      });
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-md) 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div ref={summaryAreaRef} style={{ position: 'relative', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.4rem' }} className="no-capture">
          <button 
            onClick={handleCopy}
            title="Copy Image"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <i className="fa-regular fa-copy" style={{ fontSize: '14px' }}></i>
          </button>
          <button 
            onClick={handleCapture}
            title="Capture Screenshot"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <i className="fa-solid fa-camera" style={{ fontSize: '14px' }}></i>
          </button>
          <button 
            onClick={onRefresh}
            title="รีเฟรชใหม่"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <i className="fa-solid fa-arrows-rotate" style={{ fontSize: '14px' }}></i>
          </button>
        </div>

        <header style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
        <h1 className="capture-title" style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: 'var(--spacing-md)', background: 'var(--gradient-info)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', textShadow: '0 2px 10px rgba(59, 130, 246, 0.2)', letterSpacing: '0.5px' }}>
          REAL ESTATE (อสังหาริมทรัพย์)
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {availableYears.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ปี:</span>
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
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

        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <i className="fa-solid fa-chart-pie" style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }}></i>
          ภาพรวมข้อมูลยอดเงิน
        </h2>
        <SummaryCards totals={totals} growth={growth} />
      </div>
      
      {toast.show && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '2rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            backgroundColor: '#15803d', 
            color: 'white', 
            padding: '0.6rem 1.2rem', 
            borderRadius: 'var(--radius-full)', 
            boxShadow: 'var(--shadow-xl)', 
            zIndex: 100000, 
            fontSize: '0.9rem',
            fontWeight: '600',
            animation: 'scaleIn 0.2s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
          {toast.message}
        </div>
      )}
      
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: 'var(--spacing-xl)' }}>
        <i className="fa-solid fa-chart-line" style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }}></i>
        กราฟภาพรวมแนวโน้ม
      </h2>
      <Charts data={data} />

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', margin: 0 }}>
            <i className="fa-solid fa-user-group" style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem' }}></i>
            รายการสมาชิก
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', backgroundColor: 'var(--bg-hover)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
              {members.length} ท่าน
            </span>
          </h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setMemberViewMode('list')}
              style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', background: memberViewMode === 'list' ? 'var(--bg-hover)' : 'transparent', color: memberViewMode === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' }}
            >
              <i className="fa-solid fa-list" style={{ marginRight: '0.3rem' }}></i> รายการ
            </button>
            <button 
              onClick={() => setMemberViewMode('chart')}
              style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', background: memberViewMode === 'chart' ? 'var(--bg-hover)' : 'transparent', color: memberViewMode === 'chart' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' }}
            >
              <i className="fa-solid fa-chart-pie" style={{ marginRight: '0.3rem' }}></i> กราฟ
            </button>
          </div>
        </div>
        
        {memberViewMode === 'list' ? (
          <div className="grid grid-cols-1 gap-md">
            {members.map((member, index) => (
              <MemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md animate-fade-in">
            {realEstateMetrics.map(metric => (
              <div key={metric.key} className="bg-card" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: metric.color, marginBottom: '0.75rem', textAlign: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                  {metric.label}
                </h3>
                <div style={{ display: 'flex', width: '100%', flex: 1, alignItems: 'center' }}>
                  <div style={{ width: '50%', minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem 1rem 0.5rem 0.5rem', borderRight: '1px dashed var(--border-color)' }}>
                    <ReactApexChart 
                      options={{
                        chart: { type: 'donut', fontFamily: 'inherit' },
                        stroke: { show: true, width: 1, colors: ['#ffffff'] },
                        labels: members.map(m => m.name),
                        colors: ['#db2777', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#14b8a6', '#6366f1', '#ec4899'],
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                name: { fontSize: '0.75rem', color: 'var(--text-secondary)' },
                                value: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', formatter: (val) => `฿${Number(val).toLocaleString()}` },
                                total: { 
                                  show: true, 
                                  label: `รวม`,
                                  fontSize: '0.75rem',
                                  formatter: (w) => `฿${w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString()}` 
                                }
                              }
                            }
                          }
                        },
                        dataLabels: { enabled: false },
                        tooltip: { y: { formatter: (val) => `฿${val.toLocaleString()}` } },
                        legend: { show: false }
                      }}
                      series={members.map(m => m.totals[metric.key] || 0)}
                      type="donut"
                      height={180}
                      width="100%"
                    />
                  </div>
                  <div style={{ width: '50%', maxHeight: '180px', overflowY: 'auto', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {members.map((m, i) => {
                      const colors = ['#db2777', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#14b8a6', '#6366f1', '#ec4899'];
                      const val = m.totals[metric.key] || 0;
                      return (
                        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[i % colors.length], flexShrink: 0 }}></span>
                          <span style={{ color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.name}>{m.name}</span>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>฿{val.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
