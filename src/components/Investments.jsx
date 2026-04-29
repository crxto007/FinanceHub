import { useState, useEffect } from 'react';
import { Plus, TrendingUp, PieChart } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function Investments() {
  const { data, updateInvestment } = useFinance();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.monthlyData && data.investments) {
      const total = data.investments.reduce((sum, i) => sum + i.balance, 0);
      setChartData(data.monthlyData.map((m, i) => ({
        month: m.month,
        value: total + i * 200 + 300
      })));
    }
  }, [data.monthlyData, data.investments]);

  const totalInvested = data.investments.reduce((sum, i) => sum + i.balance, 0);
  const topPerformer = [...data.investments].sort((a, b) => b.balance - a.balance)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Investments</h1>
          <p className="text-gray-500 dark:text-gray-400">{data.investments.length} investment accounts</p>
        </div>
        <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Plus size={16} />
          Add Investment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <PieChart size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Total Invested</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">All accounts</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-2">${totalInvested.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp size={14} />
            <span>+12.4% this year</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Top Performer</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Best account</p>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{topPerformer?.name}</p>
          <p className="text-2xl font-bold text-green-600">${topPerformer?.balance.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Avg Monthly Gain</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">All time</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-2">+$1,247</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Based on current growth rate</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Value Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} dot={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Accounts</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.investments.map(inv => (
            <div key={inv.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${inv.color}20` }}
                  >
                    <span className="text-xl" style={{ color: inv.color }}>📈</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{inv.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Investment Account</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white group">
                    $<Editable value={inv.balance} onChange={(v) => updateInvestment(inv.id, { balance: v })} type="number" className="inline-flex items-center text-lg font-bold" />
                  </p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp size={12} />
                    <span>+8.5%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}