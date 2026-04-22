import React, { useState, useEffect } from 'react';
import { RealEstateView } from './components/RealEstateView';
import { CentralMoneyView } from './components/CentralMoneyView';
import { Home, Landmark, Download } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('real-estate');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed
    const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isAppStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      alert('สำหรับการติดตั้งบน iOS (iPhone/iPad):\n1. แตะไอคอน "Share" (แชร์) ที่แถบเมนูด้านล่างของ Safari\n2. เลื่อนลงมาแล้วเลือก "Add to Home Screen" (เพิ่มไปยังหน้าจอโฮม)');
    } else {
      alert('แอปนี้อาจจะถูกติดตั้งไว้แล้ว หรือเบราว์เซอร์ของคุณไม่รองรับการติดตั้งอัตโนมัติ ให้ลองหาเมนู "Install" หรือ "Add to Home Screen" ในตัวเลือกของเบราว์เซอร์ครับ');
    }
  };

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
      
      <footer style={{ marginTop: 'auto', paddingTop: '2rem', paddingBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', letterSpacing: '0.5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        {!isStandalone && (
          <button 
            onClick={handleInstallClick}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: '600', 
              backgroundColor: 'transparent', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--text-primary)', cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.875rem'
            }}
            title="Add to Desktop / Home Screen"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <Download size={16} />
            ติดตั้งแอป (Shortcut)
          </button>
        )}
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
