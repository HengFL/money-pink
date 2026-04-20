import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Charts = ({ data }) => {
  const { timelineData, members } = data;
  const [selectedMetric, setSelectedMetric] = useState('ต้นทุน');

  const metricMap = {
    'ต้นทุน': 'cost',
    'ยอดจ่าย': 'paid',
    'ค้างจ่าย': 'outstandingPay',
    'ค้างรับ': 'outstandingReceive'
  };

  const selectedMetricKey = metricMap[selectedMetric] || 'cost';

  const runningTotals = {};
  members.forEach(m => {
    runningTotals[m.name] = 0;
  });

  const chartData = timelineData.map(item => {
    const row = { name: item.displayTime };
    members.forEach(m => {
       const currentValue = item[m.name] ? item[m.name][selectedMetricKey] : 0;
       runningTotals[m.name] += currentValue;
       row[m.name] = runningTotals[m.name];
    });
    return row;
  });

  const memberColors = [
    'var(--accent-primary)',
    'var(--accent-success)',
    'var(--accent-danger)',
    'var(--accent-secondary)',
    '#a855f7',
    '#f97316',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, display: 'inline-block' }}></span>
              {entry.name}: {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card animate-fade-in" style={{ animationDelay: '0.6s', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>กราฟแสดงแนวโน้มตามสมาชิก</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ข้อมูล:</span>
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
            <option value="ต้นทุน" style={{ color: '#000' }}>ต้นทุน</option>
            <option value="ยอดจ่าย" style={{ color: '#000' }}>ยอดจ่าย</option>
            <option value="ค้างจ่าย" style={{ color: '#000' }}>ค้างจ่าย</option>
            <option value="ค้างรับ" style={{ color: '#000' }}>ค้างรับ</option>
          </select>
        </div>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {members.map((member, index) => (
              <Line 
                key={member.name}
                type="monotone" 
                dataKey={member.name} 
                stroke={memberColors[index % memberColors.length]} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
