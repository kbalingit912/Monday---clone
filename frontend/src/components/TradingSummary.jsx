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

      {/* Trade Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        {trades.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
            No trades recorded yet. Start by adding your first trade!
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Session</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Direction</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Entry Price</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Exit Price</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Stop Loss</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Take Profit</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Lots</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Risk Ratio</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Risk %</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>P/L</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Return %</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Notes</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, idx) => (
                <tr key={trade.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={{ padding: '12px', color: '#1f2937' }}>{trade.date}</td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>{trade.session || '—'}</td>
                  <td style={{ padding: '12px', color: '#1f2937' }}>{trade.direction}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>${trade.entryPrice}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>${trade.exitPrice}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>{trade.stopLoss || '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>{trade.takeProfit || '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>{trade.positionSize}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>{trade.riskRatio || '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#1f2937' }}>{trade.riskPercent || '—'}%</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: parseFloat(trade.pnl) > 0 ? '#10b981' : '#ef4444' }}>
                    ${trade.pnl}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: parseFloat(trade.returnPercent) > 0 ? '#10b981' : '#ef4444' }}>
                    {trade.returnPercent > 0 ? '+' : ''}{trade.returnPercent}%
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={trade.tradingNotes}>
                    {trade.tradingNotes || '—'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: 0
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
