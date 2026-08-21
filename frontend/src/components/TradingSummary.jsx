export function TradingSummary({ trades, onDeleteTrade }) {
  const totalPnL = trades.reduce((sum, t) => sum + parseFloat(t.pnl), 0).toFixed(2);
  const winRate = trades.length > 0
    ? ((trades.filter(t => parseFloat(t.pnl) > 0).length / trades.length) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>Total P&L</p>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: totalPnL >= 0 ? '#10b981' : '#ef4444',
            margin: 0
          }}>
            ${totalPnL}
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>Win Rate</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>
            {winRate}%
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>Total Trades</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366f1', margin: 0 }}>
            {trades.length}
          </p>
        </div>
      </div>

      {/* Trade History */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Trade Summary</h3>

        {trades.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            textAlign: 'center',
            color: '#9ca3af',
            borderRadius: '8px'
          }}>
            No trades recorded yet. Start by adding your first trade!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trades.map((trade) => (
              <div
                key={trade.id}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${parseFloat(trade.pnl) > 0 ? '#10b981' : '#ef4444'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: '16px'
                }}
              >
                {/* Header with Trade # and P&L */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    {trade.date}
                  </h4>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: parseFloat(trade.pnl) > 0 ? '#10b981' : '#ef4444'
                    }}>
                      ${trade.pnl}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: parseFloat(trade.returnPercent) > 0 ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {trade.returnPercent > 0 ? '+' : ''}{trade.returnPercent}%
                    </p>
                  </div>
                </div>

                {/* Trade Details Grid - Vertical Format */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '13px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Session</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{trade.session || '—'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Direction</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{trade.direction || '—'}</p>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Entry Price</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>${trade.entryPrice}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Exit Price</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>${trade.exitPrice}</p>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Stop Loss</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{trade.stopLoss || '—'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Take Profit</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{trade.takeProfit || '—'}</p>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Lots/Position Size</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{trade.positionSize}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af', fontWeight: '500' }}>Risk Amount</p>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>${trade.riskAmount || '—'}</p>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTrade(trade.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  🗑️ Delete Trade
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
