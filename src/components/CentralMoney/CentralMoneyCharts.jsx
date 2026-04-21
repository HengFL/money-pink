import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const CentralMoneyCharts = ({ data }) => {
  const { timelineData, members } = data;
  const [selectedMetric, setSelectedMetric] = useState('ยอดเก็บ');

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
    '#22c55e',
    '#eab308',
    '#ec4899',
    '#0ea5e9',
    '#a855f7',
    '#f97316',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    const [hidden, setHidden] = React.useState(false);

    React.useEffect(() => {
      setHidden(false);
    }, [payload, label]);

    React.useEffect(() => {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.recharts-wrapper')) {
          setHidden(true);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (active && payload && payload.length && !hidden) {
      const rowData = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', maxWidth: '350px', position: 'relative' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setHidden(true); }}
            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', padding: '0 4px', lineHeight: '1', zIndex: 10 }}
          >
            &times;
          </button>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingRight: '1.5rem' }}>{label}</p>
          {members.map(m => {
            const mLine = payload.find(p => p.dataKey === m.name);
            const mCalled = rowData[`${m.name}_called`];
            const mCollected = rowData[`${m.name}_collected`];
            const mOutstanding = rowData[`${m.name}_outstanding`];
            
            if (!mLine && mCalled === undefined && mCollected === undefined) return null;
            
            return (
              <div key={m.name} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-color)' }}>
                <p style={{ fontWeight: 'bold', color: mLine?.color || 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: mLine?.color || 'var(--text-primary)', display: 'inline-block' }}></span>
                  {m.name}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.75rem', paddingLeft: '1rem' }}>
                  {mCalled !== undefined && <div><span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>■</span> ยอดเรียก: ฿{mCalled.toLocaleString()}</div>}
                  {mCollected !== undefined && <div><span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>■</span> ยอดเก็บ: ฿{mCollected.toLocaleString()}</div>}
                  {mOutstanding !== undefined && <div><span style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>■</span> ยอดค้าง: ฿{mOutstanding.toLocaleString()}</div>}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
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
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `฿${value}`} />
            <Tooltip trigger="click" content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} wrapperStyle={{ zIndex: 9999, pointerEvents: 'auto' }} />
            <Legend content={<CustomLegend />} />
            
            {/* Grouped Stacked Bars for Members */}
            {members.map((member, index) => (
              <React.Fragment key={`bars-${member.name}`}>
                <Bar 
                  dataKey={`${member.name}_collected`} 
                  stackId={member.name} 
                  fill="var(--accent-success)" 
                  stroke="none"
                  fillOpacity={0.9} 
                  legendType="none" 
                />
                <Bar 
                  dataKey={`${member.name}_outstanding`} 
                  stackId={member.name} 
                  fill="var(--accent-danger)" 
                  stroke="none"
                  fillOpacity={0.9} 
                  legendType="none" 
                  radius={[4, 4, 0, 0]} 
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
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
