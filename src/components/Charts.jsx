import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Charts = ({ data }) => {
  // Use members data instead of monthly data
  const { members } = data;

  const chartData = members.map(m => ({
    name: m.name,
    ต้นทุน: m.totals.cost,
    ยอดจ่าย: m.totals.paid,
    ค้างจ่าย: m.totals.outstandingPay,
    รายได้: m.totals.income,
    ค้างรับ: m.totals.outstandingReceive
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              {entry.name}: {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card animate-fade-in" style={{ animationDelay: '0.6s', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)' }}>สรุปภาพรวมการเงินแยกตามสมาชิก</h2>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} tickFormatter={(value) => `฿${value}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="ต้นทุน" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ยอดจ่าย" fill="var(--accent-success)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ค้างจ่าย" fill="var(--accent-danger)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ค้างรับ" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
