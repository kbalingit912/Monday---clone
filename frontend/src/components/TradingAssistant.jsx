export function TradingAssistant() {
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#f9fafb' }}>
      <iframe
        src="https://claude-production-382b.railway.app"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
        }}
        title="XAU/USD Analyzer - Trading Assistant"
        allowFullScreen
      />
    </div>
  );
}
