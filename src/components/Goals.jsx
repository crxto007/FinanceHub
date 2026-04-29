import { useState } from 'react';
import { Plus, Target, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function Goals() {
  const { data, updateGoal, addGoal } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: '', deadline: '', icon: '🎯' });

  const handleAdd = () => {
    if (!newGoal.name || !newGoal.target) return;
    addGoal({
      ...newGoal,
      target: parseFloat(newGoal.target),
      saved: parseFloat(newGoal.saved) || 0,
      color: '#3B82F6'
    });
    setNewGoal({ name: '', target: '', saved: '', deadline: '', icon: '🎯' });
    setShowAdd(false);
  };

  const getProgressColor = (saved, target) => {
    const percentage = (saved / target) * 100;
    if (percentage >= 75) return '#10B981';
    if (percentage >= 50) return '#3B82F6';
    if (percentage >= 25) return '#F59E0B';
    return '#DC2626';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalSaved = data.goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = data.goals.reduce((sum, g) => sum + g.target, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-500 dark:text-gray-400">{data.goals.length} active goals</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              placeholder="Goal name"
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder="Target amount"
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              value={newGoal.saved}
              onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })}
              placeholder="Already saved"
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Create Goal</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{overallProgress.toFixed(0)}%</span>
        </div>
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ${totalSaved.toLocaleString()} of ${totalTarget.toLocaleString()} total goal target
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.goals.map(goal => {
          const percentage = Math.min((goal.saved / goal.target) * 100, 100);
          const remaining = goal.target - goal.saved;
          const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

          return (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Deadline: {formatDate(goal.deadline)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-semibold" style={{ color: getProgressColor(goal.saved, goal.target) }}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: goal.color }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    $<Editable value={goal.saved} onChange={(v) => updateGoal(goal.id, { saved: v })} type="number" className="inline-flex items-center text-lg font-semibold" />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${goal.target.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Remaining</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${remaining.toLocaleString()}</span>
                </div>
                {daysLeft > 0 && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Days left</span>
                    <span className="text-sm font-medium text-blue-600">{daysLeft} days</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}