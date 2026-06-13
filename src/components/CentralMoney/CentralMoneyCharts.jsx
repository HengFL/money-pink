import React, { useState, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';
import { formatCurrency } from '../../utils/dataProcessor';

export const CentralMoneyCharts = ({ data }) => {
  const { timelineData, members } = data;
   const [selectedMetric, setSelectedMetric] = useState('ยอดเรียก');
  const [popupData, setPopupData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const popupRef = useRef(null);

  const getProgressStyle = (percent) => {
    if (percent === 0) return { color: '#4b5563', bg: 'none' };
    if (percent > 0 && percent < 50) return { color: '#b91c1c', bg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' };
    if (percent >= 50 && percent < 75) return { color: '#c2410c', bg: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)' };
    if (percent >= 75 && percent < 100) return { color: '#b45309', bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' };
    if (percent >= 100) return { color: '#15803d', bg: 'linear-gradient(135deg, #10b981 0%, #15803d 100%)' };
    return { color: '#4b5563', bg: 'none' };
  };

  const handleCapture = () => {
    if (popupRef.current) {
      // Temporarily hide buttons for capture
      const buttons = popupRef.current.querySelectorAll('.no-capture');
      buttons.forEach(btn => btn.style.display = 'none');

      html2canvas(popupRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `central-money-summary-${popupData.label}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore buttons
        buttons.forEach(btn => btn.style.display = 'flex');
      });
    }
  };

  const handleCopy = () => {
    if (popupRef.current) {
      const buttons = popupRef.current.querySelectorAll('.no-capture');
      buttons.forEach(btn => btn.style.display = 'none');

      html2canvas(popupRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
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
          // Restore buttons
          buttons.forEach(btn => btn.style.display = 'flex');
        }, 'image/png');
      });
    }
  };

  const metricMap = {
    'ยอดเรียก': 'called',
    'ยอดเก็บ': 'collected',
    'ยอดค้าง': 'outstanding',
    'ยอดเบิกเงิน': 'withdrawn',
    'ยอดยืมเงิน': 'borrowed',
    'ยอดคืนเงิน': 'returned',
    'ยอดค้างคืน': 'outstandingReturn',
    'ทั้งหมด': 'all'
  };

  const selectedMetricKey = metricMap[selectedMetric] || 'collected';

  const runningTotals = {};
  members.forEach(m => {
    runningTotals[m.name] = { called: 0, collected: 0, outstanding: 0, withdrawn: 0, borrowed: 0, returned: 0, outstandingReturn: 0 };
  });

  const chartData = timelineData.map(item => {
    const row = { name: item.displayTime };
    let totalForMetric = 0;
    
    // Process Lines and Bars (Members)
    members.forEach(m => {
       if (item[m.name]) {
         runningTotals[m.name].called += (item[m.name].called || 0);
         runningTotals[m.name].collected += (item[m.name].collected || 0);
         runningTotals[m.name].outstanding += (item[m.name].outstanding || 0);
         runningTotals[m.name].withdrawn += (item[m.name].withdrawn || 0);
         runningTotals[m.name].borrowed += (item[m.name].borrowed || 0);
         runningTotals[m.name].returned += (item[m.name].returned || 0);
         runningTotals[m.name].outstandingReturn += (item[m.name].outstandingReturn || 0);
       }
       
       // Stacked Bar values for this member
       row[`${m.name}_called`] = runningTotals[m.name].called;
       row[`${m.name}_collected`] = runningTotals[m.name].collected;
       row[`${m.name}_outstanding`] = runningTotals[m.name].outstanding;
       row[`${m.name}_borrowed`] = runningTotals[m.name].borrowed;
       row[`${m.name}_returned`] = runningTotals[m.name].returned;
       row[`${m.name}_outstandingReturn`] = runningTotals[m.name].outstandingReturn;

       let metricVal = 0;
       if (selectedMetricKey === 'all') {
         metricVal = runningTotals[m.name].called + runningTotals[m.name].withdrawn + runningTotals[m.name].borrowed;
       } else {
         metricVal = runningTotals[m.name][selectedMetricKey];
       }
       totalForMetric += metricVal;
    });
    
    row.totalTrend = totalForMetric;
    
    return row;
  });

  const memberColors = [
    '#db2777', // Pink (Brand)
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#f97316', // Orange
  ];

  const series = [];
  members.filter(m => m.name !== 'ตัวแทน').forEach(member => {
    series.push({
      name: `${member.name} ยอดเก็บ`,
      group: member.name,
      type: 'bar',
      data: chartData.map(d => d[`${member.name}_collected`] || 0),
      color: '#10b981'
    });
    series.push({
      name: `${member.name} ยอดค้าง`,
      group: member.name,
      type: 'bar',
      data: chartData.map(d => d[`${member.name}_outstanding`] || 0),
      color: '#ef4444'
    });
  });

  series.push({
    name: 'ยอดรวม',
    type: 'line',
    data: chartData.map(d => d.totalTrend),
    color: '#db2777'
  });

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      fontFamily: 'inherit',
      events: {
        click: function(event, chartContext, config) {
          if (config.dataPointIndex !== undefined && config.dataPointIndex !== -1) {
            const data = chartData[config.dataPointIndex];
            if (data) {
              setPopupData({
                label: data.name,
                rowData: data
              });
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: series.map(s => s.type === 'line' ? 2 : 0),
      curve: 'straight'
    },
    markers: {
      size: series.map(s => s.type === 'line' ? 5 : 0),
      colors: ['#ffffff'],
      strokeColors: series.map(s => s.color || '#db2777'),
      strokeWidth: 2,
    },
    xaxis: {
      categories: chartData.map(d => d.name),
      labels: { style: { colors: '#9d174d', fontWeight: 500 } },
      axisBorder: { show: true, color: '#9d174d' },
      axisTicks: { show: true, color: '#9d174d' }
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: (value) => `฿${value}`,
        style: { colors: '#9d174d', fontWeight: 500 }
      },
      axisBorder: { show: true, color: '#9d174d' },
      axisTicks: { show: true, color: '#9d174d' }
    },
    grid: {
      borderColor: '#fbcfe8',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: function (y) { if(typeof y !== "undefined") { return  "฿" + y.toFixed(0); } return y; } }
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        borderRadius: 2
      }
    }
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>เส้นแนวโน้ม (รวม):</span>
          <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', fontWeight: '500' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'inline-block' }}></span>
            ยอดรวม{selectedMetric !== 'ทั้งหมด' ? ` (${selectedMetric})` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: '0.875rem', backgroundColor: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>สีกราฟแท่ง (Stacked):</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-success)', display: 'inline-block', borderRadius: '2px' }}></span> ยอดเก็บ
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-danger)', display: 'inline-block', borderRadius: '2px' }}></span> ยอดค้าง
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="bg-card animate-fade-in" style={{ position: 'relative', zIndex: 50, animationDelay: '0.6s', marginTop: '0', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0, color: 'var(--text-secondary)' }}>ตัวชี้วัดแนวโน้ม</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>เส้นแนวโน้ม:</span>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
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
            <option value="ทั้งหมด" style={{ color: '#000' }}>ทั้งหมด</option>
            <option value="ยอดเรียก" style={{ color: '#000' }}>ยอดเรียก</option>
            <option value="ยอดเก็บ" style={{ color: '#000' }}>ยอดเก็บ</option>
            <option value="ยอดค้าง" style={{ color: '#000' }}>ยอดค้าง</option>
            <option value="ยอดเบิกเงิน" style={{ color: '#000' }}>ยอดเบิกเงิน</option>
            <option value="ยอดยืมเงิน" style={{ color: '#000' }}>ยอดยืมเงิน</option>
            <option value="ยอดคืนเงิน" style={{ color: '#000' }}>ยอดคืนเงิน</option>
            <option value="ยอดค้างคืน" style={{ color: '#000' }}>ยอดค้างคืน</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ height: '320px', width: '100%' }}>
          <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
        </div>
        <CustomLegend />
      </div>
    </div>
      
      {/* Popup Modal */}
      {popupData && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
          onClick={() => setPopupData(null)}
        >
           <div 
            ref={popupRef}
            style={{ backgroundColor: '#f1f5f9', padding: '0.7rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: '95%', maxWidth: '420px', maxHeight: '92vh', overflowY: 'auto', position: 'relative', animation: 'scaleIn 0.2s ease-out', border: '1px solid var(--border-color)' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.4rem' }} className="no-capture">
              <button 
                onClick={handleCopy}
                title="Copy Image"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <i className="fa-regular fa-copy" style={{ fontSize: '14px' }}></i>
              </button>
              <button 
                onClick={handleCapture}
                title="Capture Screenshot"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <i className="fa-solid fa-camera" style={{ fontSize: '14px' }}></i>
              </button>
              <button 
                onClick={() => setPopupData(null)}
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-secondary)', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.borderColor = 'var(--accent-danger)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem', marginBottom: '0.5rem', paddingRight: '2.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#15803d', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CENTRAL MONEY (เงินกลาง)</h3>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                ข้อมูลประจำ: <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{popupData.label}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {members.filter(m => m.name !== 'ตัวแทน').map(m => {
                const mCalled = popupData.rowData[`${m.name}_called`];
                const mCollected = popupData.rowData[`${m.name}_collected`];
                const mOutstanding = popupData.rowData[`${m.name}_outstanding`];
                const mBorrowed = popupData.rowData[`${m.name}_borrowed`];
                const mReturned = popupData.rowData[`${m.name}_returned`];
                
                if (mCalled === undefined && mCollected === undefined && mBorrowed === undefined) return null;
                                return (
                  <div key={m.name} style={{ paddingBottom: '0.4rem', borderBottom: '1px dashed var(--border-color)' }}>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', display: 'inline-block' }}></span>
                      {m.name}
                    </p>
                    {mCalled > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem', fontSize: '0.8rem', paddingLeft: '0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)' }}><span style={{ color: '#db2777', fontWeight: 'bold', display: 'block', fontSize: '0.6rem', marginBottom: '1px', opacity: 0.75 }}>ยอดเรียก</span><span style={{fontWeight:'700', color:'#db2777'}}>{formatCurrency(mCalled)}</span></div>
                        {mCollected !== undefined && <div style={{ background: '#f1f5f9', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)' }}><span style={{ color: '#15803d', fontWeight: 'bold', display: 'block', fontSize: '0.6rem', marginBottom: '1px', opacity: 0.75 }}>ยอดเก็บ</span><span style={{fontWeight:'700', color:'#15803d'}}>{formatCurrency(mCollected)}</span></div>}
                        {mOutstanding !== undefined && <div style={{ background: '#f1f5f9', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)' }}><span style={{ color: mOutstanding === 0 ? '#94a3b8' : '#dc2626', fontWeight: 'bold', display: 'block', fontSize: '0.6rem', marginBottom: '1px', opacity: 0.75 }}>ยอดค้าง</span><span style={{fontWeight:'700', color: mOutstanding === 0 ? '#94a3b8' : '#dc2626'}}>{formatCurrency(mOutstanding)}</span></div>}
                      </div>
                    )}
                    {(mBorrowed > 0 || mReturned > 0) && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem', fontSize: '0.8rem', paddingLeft: '0.75rem' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ color: '#6d28d9', fontWeight: 'bold', display: 'block', fontSize: '0.6rem', marginBottom: '1px', opacity: 0.75 }}>ยอดยืม</span>
                          <span style={{fontWeight:'700', color:'#6d28d9'}}>{formatCurrency(mBorrowed)}</span>
                        </div>
                        <div style={{ background: '#f1f5f9', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ color: '#1d4ed8', fontWeight: 'bold', display: 'block', fontSize: '0.6rem', marginBottom: '1px', opacity: 0.75 }}>ยอดคืน</span>
                          <span style={{fontWeight:'700', color:'#1d4ed8'}}>{formatCurrency(mReturned)}</span>
                        </div>
                        <div style={{ background: '#f1f5f9', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ color: (popupData.rowData[`${m.name}_outstandingReturn`] || 0) === 0 ? '#94a3b8' : '#ea580c', fontWeight: 'bold', display: 'block', fontSize: '0.6rem', marginBottom: '1px', opacity: 0.75 }}>ยอดค้างคืน</span>
                          <span style={{fontWeight:'700', color: (popupData.rowData[`${m.name}_outstandingReturn`] || 0) === 0 ? '#94a3b8' : '#ea580c'}}>{formatCurrency(popupData.rowData[`${m.name}_outstandingReturn`] || 0)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '0.4rem 0.7rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>ยอดรวม (เส้นแนวโน้ม):</span>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{formatCurrency(popupData.rowData.totalTrend)}</span>
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};
