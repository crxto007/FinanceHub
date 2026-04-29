import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function CategoriesBreakdown() {
  const { data, updateBudget } = useFinance();

  const categories = Object.entries(data.budget.categories)
    .map(([name, cat]) => ({
      name,
      spent: cat.spent,
      budget: cat.budget,
      icon: cat.icon,
      color: cat.color,
      percentage: Math.min((cat.spent / cat.budget) * 100, 100)
    }))
    .sort((a, b) => b.spent - a.spent);

  const getBarColor = (cat) => {
    if (cat.percentage > 100) return '#DC2626';
    if (cat.percentage > 90) return '#F59E0B';
    return cat.color;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Categories</h3>

      <div className="space-y-4">
        {categories.slice(0, 8).map(cat => (
          <div key={cat.name} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ${cat.spent.toLocaleString()} / $<Editable value={cat.budget} onChange={(v) => updateBudget(cat.name, { budget: v })} type="number" className="inline-flex items-center text-sm font-medium" />
                </span>
                <span className={`text-sm font-medium ${cat.percentage > 100 ? 'text-red-600' : cat.percentage > 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(cat.percentage, 100)}%`, backgroundColor: getBarColor(cat) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}