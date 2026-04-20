import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Charts = ({ data }) => {
  const { timelineData, members } = data;
  const [selectedMetric, setSelectedMetric] = useState('ยอดจ่าย');

  const metricMap = {
    'ต้นทุน': 'cost',
    'ยอดจ่าย': 'paid',
    'ค้างจ่าย': 'outstandingPay',
    'ค้างรับ': 'outstandingReceive',
    'ทั้งหมด': 'all'
  };

  const selectedMetricKey = metricMap[selectedMetric] || 'cost';

  const runningTotals = {};
  members.forEach(m => {
    runningTotals[m.name] = { cost: 0, paid: 0, outstandingPay: 0, outstandingReceive: 0 };
  });

  const chartData = timelineData.map(item => {
    const row = { name: item.displayTime };
    
    // Process Lines and Bars (Members)
    members.forEach(m => {
       if (item[m.name]) {
         runningTotals[m.name].cost += (item[m.name].cost || 0);
         runningTotals[m.name].paid += (item[m.name].paid || 0);
         runningTotals[m.name].outstandingPay += (item[m.name].outstandingPay || 0);
         runningTotals[m.name].outstandingReceive += (item[m.name].outstandingReceive || 0);
       }
       
       // Stacked Bar values for this member
       row[`${m.name}_cost`] = runningTotals[m.name].cost;
       row[`${m.name}_paid`] = runningTotals[m.name].paid;
       row[`${m.name}_outstandingPay`] = runningTotals[m.name].outstandingPay;
       row[`${m.name}_outstandingReceive`] = runningTotals[m.name].outstandingReceive;

       // Line value for this member (based on selected metric)
       if (selectedMetricKey === 'all') {
         row[m.name] = runningTotals[m.name].cost + runningTotals[m.name].paid + runningTotals[m.name].outstandingPay + runningTotals[m.name].outstandingReceive;
       } else {
         row[m.name] = runningTotals[m.name][selectedMetricKey];
       }
    });
    
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
            const mCost = payload.find(p => p.dataKey === `${m.name}_cost`);
            const mPaid = payload.find(p => p.dataKey === `${m.name}_paid`);
            const mOutPay = payload.find(p => p.dataKey === `${m.name}_outstandingPay`);
            const mOutRec = payload.find(p => p.dataKey === `${m.name}_outstandingReceive`);
            
            if (!mLine && !mCost) return null;
            
            return (
              <div key={m.name} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border-color)' }}>
                <p style={{ fontWeight: 'bold', color: mLine?.color || 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: mLine?.color || 'var(--text-primary)', display: 'inline-block' }}></span>
                  {m.name}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.75rem', paddingLeft: '1rem' }}>
                  {mCost && <div><span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>■</span> ต้นทุน: ฿{mCost.value.toLocaleString()}</div>}
                  {mPaid && <div><span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>■</span> ยอดจ่าย: ฿{mPaid.value.toLocaleString()}</div>}
                  {mOutPay && <div><span style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>■</span> ค้างจ่าย: ฿{mOutPay.value.toLocaleString()}</div>}
                  {mOutRec && <div><span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>■</span> ค้างรับ: ฿{mOutRec.value.toLocaleString()}</div>}
                </div>
                {mLine && <p style={{ fontSize: '0.85rem', margin: '4px 0 0 1rem', fontWeight: '600' }}>รวมเส้น ({selectedMetric}): ฿{mLine.value.toLocaleString()}</p>}
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
    // We only need the payload items that come from the Lines (which represent members)
    const linePayload = payload.filter(entry => !entry.dataKey.includes('_'));
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>เส้นแนวโน้ม (สมาชิก):</span>
          {linePayload.map((entry, index) => (
            <span key={`item-${index}`} style={{ color: entry.color, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', fontWeight: '500' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: entry.color, display: 'inline-block' }}></span>
              {entry.value}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: '0.875rem', backgroundColor: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>สีกราฟแท่ง (Stacked):</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-primary)', display: 'inline-block', borderRadius: '2px' }}></span> ต้นทุน
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-success)', display: 'inline-block', borderRadius: '2px' }}></span> ยอดจ่าย
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-danger)', display: 'inline-block', borderRadius: '2px' }}></span> ค้างจ่าย
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--accent-secondary)', display: 'inline-block', borderRadius: '2px' }}></span> ค้างรับ
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
            <option value="ต้นทุน" style={{ color: '#000' }}>ต้นทุน</option>
            <option value="ยอดจ่าย" style={{ color: '#000' }}>ยอดจ่าย</option>
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
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `฿${value}`} />
            <Tooltip trigger="click" content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} wrapperStyle={{ zIndex: 9999, pointerEvents: 'auto' }} />
            <Legend content={<CustomLegend />} />
            
            {/* Grouped Stacked Bars for Members */}
            {members.map((member) => (
              <React.Fragment key={`bars-${member.name}`}>
                <Bar dataKey={`${member.name}_cost`} stackId={member.name} fill="var(--accent-primary)" opacity={0.6} legendType="none" />
                <Bar dataKey={`${member.name}_paid`} stackId={member.name} fill="var(--accent-success)" opacity={0.6} legendType="none" />
                <Bar dataKey={`${member.name}_outstandingPay`} stackId={member.name} fill="var(--accent-danger)" opacity={0.6} legendType="none" />
                <Bar dataKey={`${member.name}_outstandingReceive`} stackId={member.name} fill="var(--accent-secondary)" opacity={0.6} legendType="none" radius={[4, 4, 0, 0]} />
              </React.Fragment>
            ))}
            
            {/* Lines for Members */}
            {members.map((member, index) => (
              <Line 
                key={`line-${member.name}`}
                type="monotone" 
                dataKey={member.name} 
                stroke={memberColors[index % memberColors.length]} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
