import { useState } from 'react';
import { PullNewsBrief } from './PullNewsBrief';

export function TradingAssistant() {
  const [showNewsBrief, setShowNewsBrief] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#f9fafb' }}>
      {/* Button Bar */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setShowNewsBrief(true)}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          📰 Pull News Brief
        </button>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>XAU/USD Trading Analyzer</span>
      </div>

      {/* Iframe Container with color adjustments */}
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

      {/* News Brief Modal */}
      {showNewsBrief && <PullNewsBrief onClose={() => setShowNewsBrief(false)} />}
    </div>
  );
}
