import React, { useState } from 'react';
import { RealEstateView } from './components/RealEstateView';
import { CentralMoneyView } from './components/CentralMoneyView';

function App() {
  const [activeTab, setActiveTab] = useState('real-estate');

  return (
    <div style={{ minHeight: '100vh', padding: '0 0.25rem', paddingTop: '0.25rem', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: 'var(--spacing-sm)', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('real-estate')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: '700', fontSize: '0.875rem',
            background: activeTab === 'real-estate' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.3)', 
            color: activeTab === 'real-estate' ? '#ffffff' : 'var(--text-primary)', 
            border: activeTab === 'real-estate' ? '1px solid #db2777' : '1px solid rgba(255, 255, 255, 0.5)', 
            borderTop: activeTab === 'real-estate' ? '1px solid #f472b6' : '1px solid rgba(255, 255, 255, 1)',
            borderLeft: activeTab === 'real-estate' ? '1px solid #f472b6' : '1px solid rgba(255, 255, 255, 1)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: activeTab === 'real-estate' ? '0 8px 16px rgba(219, 39, 119, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)'
          }}
        >
          <i className="fa-solid fa-house" style={{ fontSize: '18px' }}></i>
          REAL ESTATE
        </button>
        <button 
          onClick={() => setActiveTab('central-money')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: '700', fontSize: '0.875rem',
            background: activeTab === 'central-money' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.3)', 
            color: activeTab === 'central-money' ? '#ffffff' : 'var(--text-primary)', 
            border: activeTab === 'central-money' ? '1px solid #db2777' : '1px solid rgba(255, 255, 255, 0.5)', 
            borderTop: activeTab === 'central-money' ? '1px solid #f472b6' : '1px solid rgba(255, 255, 255, 1)',
            borderLeft: activeTab === 'central-money' ? '1px solid #f472b6' : '1px solid rgba(255, 255, 255, 1)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: activeTab === 'central-money' ? '0 8px 16px rgba(219, 39, 119, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)'
          }}
        >
          <i className="fa-solid fa-landmark" style={{ fontSize: '18px' }}></i>
          CENTRAL MONEY
        </button>
        

      </div>

      <div style={{ display: activeTab === 'real-estate' ? 'block' : 'none' }}>
        <RealEstateView />
      </div>
      <div style={{ display: activeTab === 'central-money' ? 'block' : 'none' }}>
        <CentralMoneyView />
      </div>
      
      <footer style={{ marginTop: 'auto', paddingTop: '0.5rem', paddingBottom: '0.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', letterSpacing: '0.5px' }}>
        <div>HengFL &copy; 2026</div>
      </footer>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
