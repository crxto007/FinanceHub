import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function AssetsDebtCards() {
  const { data, updateAccount, totalAssets, totalDebt } = useFinance();

  const assetsData = data.monthlyData.map((m, i) => ({ month: m.month, value: 28000 + i * 500 }));
  const debtData = data.monthlyData.map((m, i) => ({ month: m.month, value: 13000 - i * 200 }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Assets</h3>
            <p className="text-2xl font-bold text-green-600">${totalAssets().toLocaleString()}</p>
          </div>
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assetsData}>
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="text-green-500">↑ 2.4%</span> from last month
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Debt</h3>
            <p className="text-2xl font-bold text-red-600">${totalDebt().toLocaleString()}</p>
          </div>
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={debtData}>
                <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <span className="text-green-500">↓ 1.2%</span> from last month
        </p>
      </div>
    </div>
  );
}