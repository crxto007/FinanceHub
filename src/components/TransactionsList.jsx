import { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable, EditableSelect } from './Editable';

export function TransactionsList() {
  const { data, updateTransaction, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reviewed, setReviewed] = useState(new Set());

  const transactions = [...data.transactions]
    .filter(t => {
      if (filter !== 'all' && t.category !== filter) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const categories = [...new Set(data.transactions.map(t => t.category))];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toggleReviewed = (id) => {
    setReviewed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transactions to Review</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white w-40"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">All</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 6).map(t => (
          <div
            key={t.id}
            className={`flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-all
              ${reviewed.has(t.id) ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleReviewed(t.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${reviewed.has(t.id) ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}
              >
                {reviewed.has(t.id) && <Check size={14} className="text-white" />}
              </button>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(t.date)} • <EditableSelect value={t.category} onChange={(v) => updateTransaction(t.id, { category: v })} options={categories} />
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
              </p>
              <p className={`text-xs ${t.status === 'pending' ? 'text-yellow-600' : 'text-gray-400'}`}>
                {t.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {transactions.length > 6 && (
        <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
          View all {transactions.length} transactions
        </button>
      )}
    </div>
  );
}