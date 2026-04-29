import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function SpendingCard() {
  const { data, updateBudgetIncome } = useFinance();
  const { budget } = data;

  const spent = budget.spent || 0;
  const income = budget.income || 2800;
  const percentage = Math.min((spent / income) * 100, 100);
  const remaining = income - spent;

  const chartData = [
    { name: 'Spent', value: spent },
    { name: 'Remaining', value: Math.max(0, income - spent) }
  ];

  const getColor = () => {
    if (percentage > 100) return '#DC2626';
    if (percentage > 90) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Spending</h3>
        <span className={`text-sm font-medium ${percentage > 100 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="relative flex items-center justify-center h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={getColor()} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">${spent.toLocaleString()}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">of ${income.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
          <p className={`text-lg font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toLocaleString()} {remaining < 0 ? 'over' : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white group">
            $<Editable value={income} onChange={updateBudgetIncome} type="number" className="inline-flex items-center text-lg font-semibold" prefix="$" />
          </p>
        </div>
      </div>
    </div>
  );
}