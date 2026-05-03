import React, { useState } from 'react';
import { RealEstateView } from './components/RealEstateView';
import { CentralMoneyView } from './components/CentralMoneyView';
import { Home, Landmark } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('real-estate');

  return (
    <div style={{ minHeight: '100vh', padding: '0 0.75rem', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column' }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '800', 
          background: 'var(--gradient-primary)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          margin: 0,
          letterSpacing: '-0.025em',
          textShadow: '0 4px 12px rgba(236, 72, 153, 0.15)'
        }}>
          Money Pink
        </h1>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('real-estate')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.875rem',
            background: activeTab === 'real-estate' ? 'rgba(255,255,255,0.9)' : 'var(--bg-card)', 
            color: activeTab === 'real-estate' ? 'var(--accent-info)' : 'var(--text-primary)', 
            border: activeTab === 'real-estate' ? '1.5px solid var(--accent-info)' : '1px solid var(--border-color)', 
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: activeTab === 'real-estate' ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'var(--shadow-sm)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <Home size={18} />
          REAL ESTATE
        </button>
        <button 
          onClick={() => setActiveTab('central-money')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.875rem',
            background: activeTab === 'central-money' ? 'rgba(255,255,255,0.9)' : 'var(--bg-card)', 
            color: activeTab === 'central-money' ? 'var(--accent-success)' : 'var(--text-primary)', 
            border: activeTab === 'central-money' ? '1.5px solid var(--accent-success)' : '1px solid var(--border-color)', 
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: activeTab === 'central-money' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'var(--shadow-sm)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <Landmark size={18} />
          CENTRAL MONEY
        </button>
        

      </div>

      <div style={{ display: activeTab === 'real-estate' ? 'block' : 'none' }}>
        <RealEstateView />
      </div>
      <div style={{ display: activeTab === 'central-money' ? 'block' : 'none' }}>
        <CentralMoneyView />
      </div>
      
      <footer style={{ marginTop: 'auto', paddingTop: '1rem', paddingBottom: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', letterSpacing: '0.5px' }}>
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
