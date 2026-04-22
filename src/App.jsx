import React, { useState } from 'react';
import { RealEstateView } from './components/RealEstateView';
import { CentralMoneyView } from './components/CentralMoneyView';
import { Home, Landmark } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('real-estate');

  return (
    <div style={{ minHeight: '100vh', padding: '0 1.5rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('real-estate')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: '600', 
            backgroundColor: activeTab === 'real-estate' ? 'var(--accent-primary)' : 'var(--bg-card)', 
            color: activeTab === 'real-estate' ? '#fff' : 'var(--text-primary)', 
            border: '1px solid var(--border-color)', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'real-estate' ? '0 4px 6px -1px rgba(59, 130, 246, 0.5)' : 'none'
          }}
        >
          <Home size={18} />
          REAL ESTATE
        </button>
        <button 
          onClick={() => setActiveTab('central-money')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: '600', 
            backgroundColor: activeTab === 'central-money' ? 'var(--accent-success)' : 'var(--bg-card)', 
            color: activeTab === 'central-money' ? '#fff' : 'var(--text-primary)', 
            border: '1px solid var(--border-color)', cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'central-money' ? '0 4px 6px -1px rgba(16, 185, 129, 0.5)' : 'none'
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
      
      <footer style={{ marginTop: 'auto', paddingTop: '2rem', paddingBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', letterSpacing: '0.5px' }}>
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
