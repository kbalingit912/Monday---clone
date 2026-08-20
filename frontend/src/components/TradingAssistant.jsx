import { useState } from 'react';
import { TradingJournal } from './TradingJournal';

export function TradingAssistant() {
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#f9fafb' }}>
      {/* Tab Bar */}
      <div style={{
        padding: '0 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '0'
      }}>
        <button
          onClick={() => setActiveTab('analyzer')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'analyzer' ? '#2563eb' : 'transparent',
            color: activeTab === 'analyzer' ? '#ffffff' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'analyzer' ? 'none' : '2px solid transparent'
          }}
        >
          📊 XAU/USD Analyzer
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'journal' ? '#2563eb' : 'transparent',
            color: activeTab === 'journal' ? '#ffffff' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'journal' ? 'none' : '2px solid transparent'
          }}
        >
          📔 Trading Journal
        </button>
      </div>


      {/* Content Area */}
      {activeTab === 'analyzer' ? (
        <div style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#ffffff'
        }}>
          <style>{`
            iframe {
              filter: invert(1) hue-rotate(180deg) brightness(1.1);
              background-color: #ffffff !important;
            }
          `}</style>
          <iframe
            src="https://claude-production-382b.up.railway.app/"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '0px',
              display: 'block',
              filter: 'invert(1) hue-rotate(180deg) brightness(1.1)'
            }}
            title="XAU/USD Analyzer - Trading Assistant"
            allowFullScreen
          />
        </div>
      ) : (
        <TradingJournal />
      )}

    </div>
  );
}
