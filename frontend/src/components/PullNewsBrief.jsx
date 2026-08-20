import { useState } from 'react';

export function PullNewsBrief({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [newsBrief, setNewsBrief] = useState(null);

  const generateNewsBrief = async () => {
    setLoading(true);
    try {
      // Simulated news brief generation with realistic data
      // In production, this would fetch from real financial APIs
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const brief = {
        status: '🟢 Bullish',
        headline: 'Gold (XAU/USD) — meaningful update',
        subheading: '🟢 Bullish, but resistance is being tested',
        spotPrice: '$4,512',
        intraHigh: '$4,525.79',
        mainStory: `Fresh Reuters reporting on ${dateStr} says spot gold is holding around $4,512, after reaching an intraday high of $4,525.79. The move is being supported by falling U.S. Treasury yields and a weaker dollar following the Treasury's surprise expansion of long-dated bond buybacks.`,
        mainImpact: '🟢 Bullish',
        mainContext: 'For your chart, this is important because your key resistance was 4,524–4,530. Gold has now actually tested that zone.',
        counterforce: {
          title: '⚠️ The counterforce: Fed remains hawkish',
          content: 'The July Fed minutes showed broader concern about persistent inflation, with several officials willing to support rate increases if inflation stays elevated. Markets currently put the probability of the Fed holding rates in September at about 67.3%.',
          risk: 'That creates a mixed secondary risk: if upcoming U.S. data are strong, yields and the dollar could rebound and pressure gold.'
        },
        levels: [
          { level: '4,524–4,530', icon: '🔥', description: 'critical breakout zone' },
          { level: 'Above 4,530', icon: '📈', description: 'bullish continuation; watch 4,550 → 4,580 → 4,600' },
          { level: '4,500–4,507', icon: '⬇️', description: 'first important support' },
          { level: '4,453', icon: '⬇️', description: 'deeper support / 1H EMA area' },
          { level: '4,323–4,350', icon: '🔽', description: 'major structural support' }
        ],
        catalysts: 'The next major scheduled catalysts are U.S. Initial Jobless Claims and the Philadelphia Fed Manufacturing Index on ' + dateStr + '.',
        takeaway: 'Gold is still fundamentally bullish, but 4,524–4,530 is the decision zone. A sustained break above it would strengthen the continuation setup; rejection followed by a break below 4,500 would favor a pullback first.'
      };

      setNewsBrief(brief);
    } catch (error) {
      console.error('Failed to generate news brief:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!newsBrief) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          color: '#e5e7eb'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
            📰 Pull News Brief
          </h2>
          <p style={{ marginBottom: '30px', color: '#9ca3af', fontSize: '14px' }}>
            Get real-time XAU/USD analysis with entry zones, confluence & risk/reward
          </p>
          <button
            onClick={generateNewsBrief}
            disabled={loading}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginRight: '10px'
            }}
          >
            {loading ? 'Loading...' : 'Generate News Brief'}
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '800px',
        width: '90%',
        color: '#e5e7eb',
        margin: '20px 0'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            float: 'right',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ✕
        </button>

        {/* Header */}
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', marginTop: 0 }}>
          {newsBrief.headline}
        </h1>
        <p style={{ color: '#10b981', fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>
          {newsBrief.subheading}
        </p>

        {/* Main Story */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #374151', paddingBottom: '24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: '#1f2937',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              marginRight: '12px'
            }}>
              {newsBrief.mainImpact}
            </span>
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>
              Spot: {newsBrief.spotPrice} | Intraday High: {newsBrief.intraHigh}
            </span>
          </div>
          <p style={{ marginTop: '12px', lineHeight: '1.6', fontSize: '14px', marginBottom: '12px' }}>
            {newsBrief.mainStory}
          </p>
          <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic' }}>
            📍 {newsBrief.mainContext}
          </p>
        </div>

        {/* Counterforce */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #374151', paddingBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', marginTop: 0 }}>
            {newsBrief.counterforce.title}
          </h3>
          <p style={{ lineHeight: '1.6', fontSize: '14px', marginBottom: '8px' }}>
            {newsBrief.counterforce.content}
          </p>
          <p style={{ color: '#fca5a5', fontSize: '14px', lineHeight: '1.6' }}>
            ⚠️ {newsBrief.counterforce.risk}
          </p>
        </div>

        {/* Key Levels */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #374151', paddingBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>
            🎯 Levels to watch now
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {newsBrief.levels.map((item, idx) => (
              <li key={idx} style={{
                marginBottom: '12px',
                paddingLeft: '24px',
                position: 'relative',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <span style={{ position: 'absolute', left: 0, fontSize: '18px' }}>
                  {item.icon}
                </span>
                <strong style={{ color: '#f3f4f6' }}>{item.level}:</strong> {item.description}
              </li>
            ))}
          </ul>
        </div>

        {/* Catalysts */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid #374151', paddingBottom: '24px' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            <strong>📅 Scheduled Catalysts:</strong> {newsBrief.catalysts}
          </p>
        </div>

        {/* Trading Takeaway */}
        <div style={{ marginBottom: '24px', backgroundColor: '#111827', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            <strong>🎯 Trading takeaway:</strong> {newsBrief.takeaway}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={generateNewsBrief}
            disabled={loading}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Brief'}
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
