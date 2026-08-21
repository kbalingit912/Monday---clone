import { useState, useEffect } from 'react';
import { PullNewsBrief } from './PullNewsBrief';
import { TradingJournal } from './TradingJournal';
import { TradingSummary } from './TradingSummary';
import { tradingTradesAPI } from '../api';

export function TradingAssistant() {
  const [showNewsBrief, setShowNewsBrief] = useState(false);
  const [activeTab, setActiveTab] = useState('analyzer');
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load trades from backend on mount
  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      setLoading(true);
      const response = await tradingTradesAPI.getAll();
      setTrades(response.data || []);
    } catch (error) {
      console.error('Error loading trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrade = async (newTrade) => {
    try {
      await tradingTradesAPI.create(newTrade);
      setTrades([newTrade, ...trades]);
    } catch (error) {
      console.error('Error saving trade:', error);
      alert('Failed to save trade');
    }
  };

  const handleDeleteTrade = async (id) => {
    try {
      await tradingTradesAPI.delete(id);
      setTrades(trades.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Failed to delete trade');
    }
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

      // Calculate P/L correctly for SHORT positions
      let pnl = parseFloat(row['P/L $']);
      if (!pnl || isNaN(pnl)) {
        const direction = row['Direction'] || '';
        if (direction === 'Short') {
          pnl = (entry - exit) * lots;
        } else {
          pnl = (exit - entry) * lots;
        }
      }

      const trade = {
        id: Date.now() + Math.random(),
        date: row['Date'] || new Date().toISOString().split('T')[0],
        session: row['Session'] || '',
        direction: row['Direction'] || '',
        entryPrice: entry.toString(),
        stopLoss: row['Stop Loss'] || '',
        takeProfit: row['Take Profit'] || '',
        exitPrice: exit.toString(),
        positionSize: lots.toString(),
        riskAmount: row['Risk $'] || '',
        pnl: pnl.toFixed(2),
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
        <button
          onClick={() => setActiveTab('summary')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'summary' ? '#2563eb' : 'transparent',
            color: activeTab === 'summary' ? '#ffffff' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
            borderBottom: activeTab === 'summary' ? 'none' : '2px solid transparent'
          }}
        >
          📊 Trading Summary
        </button>
      </div>

      {/* Analyzer Toolbar */}
      {activeTab === 'analyzer' && (
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
        </div>
      )}

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
      ) : activeTab === 'journal' ? (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '24px', backgroundColor: '#f9fafb' }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
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
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                📥 Import CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          <TradingJournal onAddTrade={handleAddTrade} />
        </div>
      ) : (
        <TradingSummary trades={trades} onDeleteTrade={handleDeleteTrade} />
      )}

      {/* News Brief Modal */}
      {showNewsBrief && <PullNewsBrief onClose={() => setShowNewsBrief(false)} />}
    </div>
  );
}
