import { useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function Categories() {
  const { data, updateBudget } = useFinance();
  const [newCat, setNewCat] = useState({ name: '', budget: '', icon: '📁', color: '#3B82F6' });

  const categories = Object.entries(data.budget.categories);

  const totalBudget = categories.reduce((sum, [, c]) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, [, c]) => sum + c.spent, 0);

  const getStatusColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return '#DC2626';
    if (percentage > 90) return '#F59E0B';
    return '#10B981';
  };

  const handleAddCategory = () => {
    if (!newCat.name || !newCat.budget) return;
    updateBudget(newCat.name, {
      budget: parseFloat(newCat.budget),
      spent: 0,
      icon: newCat.icon,
      color: newCat.color
    });
    setNewCat({ name: '', budget: '', icon: '📁', color: '#3B82F6' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">{categories.length} budget categories</p>
        </div>
        <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalBudget.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly allocation</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSpent.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Categories</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Budgeted: ${totalBudget.toLocaleString()}</span>
              <span className="text-gray-500 dark:text-gray-400">Spent: ${totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map(([name, cat]) => {
            const percentage = Math.min((cat.spent / cat.budget) * 100, 100);
            const remaining = cat.budget - cat.spent;

            return (
              <div key={name} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${cat.spent.toLocaleString()} of $<Editable value={cat.budget} onChange={(v) => updateBudget(name, { budget: v })} type="number" className="inline-flex items-center text-sm font-medium" />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remaining >= 0 ? `${remaining.toLocaleString()} left` : `${Math.abs(remaining).toLocaleString()} over`}
                    </p>
                    <p className="text-xs" style={{ color: getStatusColor(cat.spent, cat.budget) }}>
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: getStatusColor(cat.spent, cat.budget) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}