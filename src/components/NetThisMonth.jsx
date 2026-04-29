import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export function NetThisMonth() {
  const { data } = useFinance();
  const { budget } = data;

  const income = budget.income;
  const expenses = budget.spent;
  const net = budget.net;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Net This Month</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ArrowUpRight size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${income.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ArrowDownRight size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Net</span>
          <span className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {net >= 0 ? '+' : ''}${net.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-red-500 rounded-full"
          style={{ width: `${Math.min((expenses / income) * 100, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {((expenses / income) * 100).toFixed(0)}% of income spent
      </p>
    </div>
  );
}