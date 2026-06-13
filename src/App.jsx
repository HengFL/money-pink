import React, { useState } from 'react';
import { RealEstateView } from './pages/RealEstate/RealEstateView';
import { CentralMoneyView } from './pages/CentralMoney/CentralMoneyView';

function App() {
  const [activeTab, setActiveTab] = useState('real-estate');

  return (
    <div style={{ minHeight: '100vh', padding: '0 var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(255, 255, 255, 0.4)', 
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          padding: '0.35rem', 
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 4px 10px rgba(0,0,0,0.03)'
        }}>
          <button 
            onClick={() => setActiveTab('real-estate')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: '700', fontSize: '0.875rem',
              background: activeTab === 'real-estate' ? 'var(--gradient-primary)' : 'transparent', 
              color: activeTab === 'real-estate' ? '#ffffff' : 'var(--text-secondary)', 
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeTab === 'real-estate' ? '0 4px 12px rgba(219, 39, 119, 0.3)' : 'none',
              position: 'relative'
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: '15px', color: activeTab === 'real-estate' ? '#ffffff' : 'var(--text-muted)' }}></i>
            REAL ESTATE
          </button>
          
          <button 
            onClick={() => setActiveTab('central-money')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: '700', fontSize: '0.875rem',
              background: activeTab === 'central-money' ? 'var(--gradient-primary)' : 'transparent', 
              color: activeTab === 'central-money' ? '#ffffff' : 'var(--text-secondary)', 
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeTab === 'central-money' ? '0 4px 12px rgba(219, 39, 119, 0.3)' : 'none',
              position: 'relative'
            }}
          >
            <i className="fa-solid fa-landmark" style={{ fontSize: '15px', color: activeTab === 'central-money' ? '#ffffff' : 'var(--text-muted)' }}></i>
            CENTRAL MONEY
          </button>
        </div>
      </div>

      <div style={{ display: activeTab === 'real-estate' ? 'block' : 'none', width: '100%' }}>
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
