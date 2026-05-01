import React, { useState } from 'react';
import { RealEstateView } from './components/RealEstateView';
import { CentralMoneyView } from './components/CentralMoneyView';
import { Home, Landmark } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('real-estate');

  return (
    <div style={{ minHeight: '100vh', padding: '0 0.75rem', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column' }}>
      <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, #f472b6, #db2777)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          Money Pink
        </h1>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('real-estate')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.875rem',
            backgroundColor: activeTab === 'real-estate' ? '#fff' : 'var(--bg-card)', 
            color: activeTab === 'real-estate' ? 'var(--accent-info)' : 'var(--text-primary)', 
            border: activeTab === 'real-estate' ? '2px solid var(--accent-info)' : '1px solid var(--border-color)', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'real-estate' ? '0 0 10px rgba(59, 130, 246, 0.2)' : 'none'
          }}
        >
          <Home size={18} />
          REAL ESTATE
        </button>
        <button 
          onClick={() => setActiveTab('central-money')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '0.875rem',
            backgroundColor: activeTab === 'central-money' ? '#fff' : 'var(--bg-card)', 
            color: activeTab === 'central-money' ? 'var(--accent-success)' : 'var(--text-primary)', 
            border: activeTab === 'central-money' ? '2px solid var(--accent-success)' : '1px solid var(--border-color)', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'central-money' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none'
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
