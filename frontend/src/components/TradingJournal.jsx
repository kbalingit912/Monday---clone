import { useState } from 'react';

export function TradingJournal() {
  const [trades, setTrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [importing, setImporting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    symbol: 'XAU/USD',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    notes: '',
    outcome: 'pending'
  });

  const handleAddTrade = () => {
    if (!formData.entryPrice || !formData.exitPrice) {
      alert('Please fill in entry and exit prices');
      return;
    }

    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const size = parseFloat(formData.positionSize) || 1;
    const pnl = (exit - entry) * size;

    const newTrade = {
      id: Date.now(),
      ...formData,
      pnl: pnl.toFixed(2),
      returnPercent: ((pnl / (entry * size)) * 100).toFixed(2)
    };

    setTrades([newTrade, ...trades]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      symbol: 'XAU/USD',
      entryPrice: '',
      exitPrice: '',
      positionSize: '',
      notes: '',
      outcome: 'pending'
    });
    setShowForm(false);
  };

  const handleDeleteTrade = (id) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const importedTrades = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });

      // Skip empty trade rows
      if (!row['Date'] && !row['Entry'] && !row['Exit']) continue;

      const entry = parseFloat(row['Entry']) || 0;
      const exit = parseFloat(row['Exit']) || 0;
      const lots = parseFloat(row['Lots']) || 1;
      const pnl = parseFloat(row['P/L $']) || (exit - entry) * lots;

      const trade = {
        id: Date.now() + Math.random(),
        tradeNum: row['Trade #'] || '',
        date: row['Date'] || new Date().toISOString().split('T')[0],
        symbol: 'XAU/USD',
        session: row['Session'] || '',
        direction: row['Direction'] || '',
        setup: row['Setup'] || '',
        entryPrice: entry.toString(),
        stopLoss: row['Stop Loss'] || '',
        takeProfit: row['Take Profit'] || '',
        exitPrice: exit.toString(),
        positionSize: lots.toString(),
        riskAmount: row['Risk $'] || '',
        pnl: pnl.toFixed(2),
        rMultiple: row['R-Multiple'] || '',
        result: row['Result'] || '',
        timeframe: row['Timeframe'] || '',
        marketCondition: row['Market Condition'] || '',
        entryReason: row['Entry Reason'] || '',
        exitReason: row['Exit Reason'] || '',
        emotionBefore: row['Emotion Before'] || '',
        emotionAfter: row['Emotion After'] || '',
        ruleFollowed: row['Rule Followed?'] || '',
        lesson: row['Lesson'] || '',
        notes: `${row['Entry Reason'] || ''} → ${row['Exit Reason'] || ''}`,
        returnPercent: entry > 0 ? ((pnl / (entry * lots)) * 100).toFixed(2) : '0'
      };

      if (entry > 0 || exit > 0) {
        importedTrades.push(trade);
      }
    }

    return importedTrades;
  };

  const handleCSVImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result;
        const importedTrades = parseCSV(csv);
        setTrades([...importedTrades, ...trades]);
        alert(`✅ Successfully imported ${importedTrades.length} trades!`);
        event.target.value = ''; // Reset file input
      } catch (error) {
        alert('❌ Error importing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

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

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          {showForm ? '✕ Cancel' : '+ Add Trade'}
        </button>

        <label style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'inline-block'
        }}>
          📥 Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Trade Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            New Trade Entry
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Entry Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                placeholder="e.g., 4512.50"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Exit Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                placeholder="e.g., 4525.00"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                Position Size
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.positionSize}
                onChange={(e) => setFormData({ ...formData, positionSize: e.target.value })}
                placeholder="e.g., 1.0"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
              Trade Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Entry reasons, technical levels, market conditions..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '80px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            onClick={handleAddTrade}
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ✓ Save Trade
          </button>
        </div>
      )}

      {/* Trade History */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Trade History</h3>

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
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${parseFloat(trade.pnl) > 0 ? '#10b981' : '#ef4444'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                      {trade.symbol}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                      {new Date(trade.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: parseFloat(trade.pnl) > 0 ? '#10b981' : '#ef4444'
                    }}>
                      ${trade.pnl}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: parseFloat(trade.returnPercent) > 0 ? '#10b981' : '#ef4444'
                    }}>
                      {trade.returnPercent > 0 ? '+' : ''}{trade.returnPercent}%
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', fontSize: '13px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af' }}>Entry</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>${trade.entryPrice}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#9ca3af' }}>Exit</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>${trade.exitPrice}</p>
                  </div>
                </div>

                {trade.notes && (
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#4b5563',
                    marginBottom: '12px'
                  }}>
                    {trade.notes}
                  </div>
                )}

                <button
                  onClick={() => handleDeleteTrade(trade.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: 0
                  }}
                >
                  Delete Trade
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
