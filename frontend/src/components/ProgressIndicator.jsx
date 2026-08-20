export function ProgressIndicator({ completed, total, overdue = 0 }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const remaining = total - completed;

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>
            {completed} / {total} done
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{remaining} remaining</p>
        </div>
        {overdue > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', paddingLeft: '12px', paddingRight: '12px', paddingTop: '4px', paddingBottom: '4px', borderRadius: '20px' }}>
            <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '18px' }}>●</span>
            <span style={{ color: '#991b1b', fontSize: '14px', fontWeight: '500' }}>Due & overdue {overdue}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
        <div
          style={{
            backgroundColor: '#10b981',
            height: '8px',
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
