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
        gap: '12px'
      }}>
        <button
          onClick={() => setShowNewsBrief(true)}
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          📰 Pull News Brief
        </button>
      </div>

      {/* Iframe Container */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <iframe
          src="https://claude-production-382b.up.railway.app/"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '0px',
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
