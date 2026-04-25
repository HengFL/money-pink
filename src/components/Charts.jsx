import React, { useState, useRef } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { Camera } from 'lucide-react';

export const Charts = ({ data }) => {
  const { timelineData, members } = data;
   const [selectedMetric, setSelectedMetric] = useState('ยอดจ่าย');
  const [popupData, setPopupData] = useState(null);
  const popupRef = useRef(null);

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
        link.download = `real-estate-summary-${popupData.label}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore buttons
        buttons.forEach(btn => btn.style.display = 'flex');
      });
    }
  };

  const metricMap = {
    'ต้นทุน': 'cost',
    'ยอดจ่าย': 'paid',
    'ค้างจ่าย': 'outstandingPay',
    'รายได้': 'income',
    'ยอดรับ': 'received',
    'ค้างรับ': 'outstandingReceive',
    'ทั้งหมด': 'all'
  };

  const selectedMetricKey = metricMap[selectedMetric] || 'cost';

  const runningTotals = {};
  members.forEach(m => {
    runningTotals[m.name] = { cost: 0, paid: 0, outstandingPay: 0, outstandingReceive: 0, income: 0, received: 0 };
  });

  const chartData = timelineData.map(item => {
    const row = { name: item.displayTime };
    let totalForMetric = 0;
    
    // Process Lines and Bars (Members)
    members.forEach(m => {
       if (item[m.name]) {
         runningTotals[m.name].cost += (item[m.name].cost || 0);
         runningTotals[m.name].paid += (item[m.name].paid || 0);
         runningTotals[m.name].outstandingPay += (item[m.name].outstandingPay || 0);
         runningTotals[m.name].outstandingReceive += (item[m.name].outstandingReceive || 0);
         runningTotals[m.name].income += (item[m.name].income || 0);
         runningTotals[m.name].received += (item[m.name].received || 0);
       }
       
       // Stacked Bar values for this member
       row[`${m.name}_cost`] = runningTotals[m.name].cost;
       row[`${m.name}_paid`] = runningTotals[m.name].paid;
       
       let calculatedUnpaid = runningTotals[m.name].cost - runningTotals[m.name].paid;
       if (calculatedUnpaid < 0) calculatedUnpaid = 0;
       row[`${m.name}_calculatedUnpaid`] = calculatedUnpaid;

       let metricVal = 0;
       if (selectedMetricKey === 'all') {
         metricVal = runningTotals[m.name].cost + runningTotals[m.name].paid + runningTotals[m.name].outstandingPay + runningTotals[m.name].outstandingReceive + runningTotals[m.name].income + runningTotals[m.name].received;
       } else {
         metricVal = runningTotals[m.name][selectedMetricKey];
       }
       totalForMetric += metricVal;
    });
    
    row.totalTrend = totalForMetric;
    
    return row;
  });

  const memberColors = [
    '#22c55e',
    '#eab308',
    '#ec4899',
    '#0ea5e9',
    '#a855f7',
    '#f97316',
  ];

  // Popup Modal is handled at the bottom of the component
  const handleChartClick = (e) => {
    if (!e) return;
    let label = '';
    let rowData = null;
    
    if (e.activePayload && e.activePayload.length) {
      label = e.activeLabel;
      rowData = e.activePayload[0].payload;
    } else if (e.activeTooltipIndex !== undefined && chartData[e.activeTooltipIndex]) {
      label = chartData[e.activeTooltipIndex].name;
      rowData = chartData[e.activeTooltipIndex];
    } else if (e.payload) {
      label = e.payload.name || e.name || '';
      rowData = e.payload;
    } else if (e.name) {
      label = e.name;
      rowData = e;
    }
    
    if (rowData) {
      setPopupData({
        label: label || rowData.name,
        rowData: rowData
      });
    }
  };

  const CustomLegend = () => {
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
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-success)', display: 'inline-block', borderRadius: '2px' }}></span> ยอดจ่าย
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-danger)', display: 'inline-block', borderRadius: '2px' }}></span> ค้างจ่าย
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="bg-card animate-fade-in" style={{ position: 'relative', zIndex: 50, animationDelay: '0.6s', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>กราฟภาพรวม (Combo Chart)</h2>
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
            <option value="ต้นทุน" style={{ color: '#000' }}>ต้นทุน</option>
            <option value="ยอดจ่าย" style={{ color: '#000' }}>ยอดจ่าย</option>
            <option value="รายได้" style={{ color: '#000' }}>รายได้</option>
            <option value="ยอดรับ" style={{ color: '#000' }}>ยอดรับ</option>
            <option value="ค้างจ่าย" style={{ color: '#000' }}>ค้างจ่าย</option>
            <option value="ค้างรับ" style={{ color: '#000' }}>ค้างรับ</option>
          </select>
        </div>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onClick={handleChartClick}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `฿${value}`} />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={() => null} />
            <Legend content={<CustomLegend />} />
            
            {/* Grouped Stacked Bars for Members */}
            {members.map((member, index) => (
              <React.Fragment key={`bars-${member.name}`}>
                <Bar 
                  dataKey={`${member.name}_paid`} 
                  stackId={member.name} 
                  fill="var(--accent-success)" 
                  stroke="none"
                  fillOpacity={0.9} 
                  legendType="none" 
                  onClick={handleChartClick}
                  style={{ cursor: 'pointer' }}
                />
                <Bar 
                  dataKey={`${member.name}_calculatedUnpaid`} 
                  stackId={member.name} 
                  fill="var(--accent-danger)" 
                  stroke="none"
                  fillOpacity={0.9} 
                  legendType="none" 
                  radius={[4, 4, 0, 0]} 
                  onClick={handleChartClick}
                  style={{ cursor: 'pointer' }}
                />
              </React.Fragment>
            ))}
            
            {/* Single Line for Overall Trend */}
            <Line 
              type="monotone" 
              dataKey="totalTrend" 
              stroke="var(--accent-primary)" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, onClick: handleChartClick }}
              onClick={handleChartClick}
              style={{ cursor: 'pointer' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
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
            style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: '90%', maxWidth: '450px', maxHeight: '85vh', overflowY: 'auto', position: 'relative', animation: 'scaleIn 0.2s ease-out', border: '1px solid var(--border-color)' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.5rem' }} className="no-capture">
              <button 
                onClick={handleCapture}
                title="Capture Screenshot"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <Camera size={18} />
              </button>
              <button 
                onClick={() => setPopupData(null)}
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-secondary)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.borderColor = 'var(--accent-danger)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                &times;
              </button>
            </div>
            
            <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', paddingRight: '2.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>REAL ESTATE (อสังหาริมทรัพย์)</div>
              ข้อมูลประจำ: <span style={{ color: 'var(--accent-primary)' }}>{popupData.label}</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {members.map(m => {
                const mCost = popupData.rowData[`${m.name}_cost`];
                const mPaid = popupData.rowData[`${m.name}_paid`];
                const mCalcUnpaid = popupData.rowData[`${m.name}_calculatedUnpaid`];
                
                if (mCost === undefined && mPaid === undefined) return null;
                
                return (
                  <div key={m.name} style={{ paddingBottom: '1rem', borderBottom: '1px dashed var(--border-color)' }}>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'inline-block' }}></span>
                      {m.name}
                    </p>
                    {mCost !== undefined && mCost > 0 && (
                      <div style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ความคืบหน้ายอดจ่าย</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-success)' }}>
                            {((mPaid / mCost) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${Math.min(100, Math.max(0, (mPaid / mCost) * 100))}%`, 
                              backgroundColor: 'var(--accent-success)',
                              backgroundImage: 'var(--gradient-success)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 1s ease-in-out'
                            }} 
                          />
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
                      {mCost !== undefined && <div style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}><span style={{ color: 'var(--text-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>ต้นทุนรวม</span><span style={{fontWeight:'700', color:'var(--text-primary)'}}>฿{mCost.toLocaleString()}</span></div>}
                      {mPaid !== undefined && <div style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}><span style={{ color: 'var(--accent-success)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>ยอดจ่าย</span><span style={{fontWeight:'700', color:'var(--text-primary)'}}>฿{mPaid.toLocaleString()}</span></div>}
                      {mCalcUnpaid !== undefined && <div style={{ background: 'var(--bg-main)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}><span style={{ color: 'var(--accent-danger)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>ค้างจ่าย</span><span style={{fontWeight:'700', color:'var(--text-primary)'}}>฿{mCalcUnpaid.toLocaleString()}</span></div>}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>ยอดรวม (เส้นแนวโน้ม):</span>
              <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--accent-primary)' }}>฿{popupData.rowData.totalTrend.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
