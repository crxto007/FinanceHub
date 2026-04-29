import { Target, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function GoalsSection() {
  const { data, updateGoal } = useFinance();

  const getProgressColor = (saved, target) => {
    const percentage = (saved / target) * 100;
    if (percentage >= 75) return '#10B981';
    if (percentage >= 50) return '#3B82F6';
    if (percentage >= 25) return '#F59E0B';
    return '#DC2626';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals</h3>
        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Plus size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {data.goals.map(goal => {
          const percentage = Math.min((goal.saved / goal.target) * 100, 100);
          const remaining = goal.target - goal.saved;

          return (
            <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{goal.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Target: ${goal.target.toLocaleString()} • Deadline: {formatDate(goal.deadline)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold" style={{ color: getProgressColor(goal.saved, goal.target) }}>
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="h-2.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: goal.color }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ${goal.saved.toLocaleString()} saved
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ${remaining.toLocaleString()} to go
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-2">
        <Plus size={16} />
        Add new goal
      </button>
    </div>
  );
}