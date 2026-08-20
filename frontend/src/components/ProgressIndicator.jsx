export function ProgressIndicator({ completed, total, overdue = 0 }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const remaining = total - completed;

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{completed} / {total} done</h3>
          <p className="text-sm text-gray-600">{remaining} remaining</p>
        </div>
        {overdue > 0 && (
          <div className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
            <span className="text-red-600 font-semibold text-lg">●</span>
            <span className="text-red-700 text-sm font-medium">Due & overdue {overdue}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
