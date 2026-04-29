import { Calendar, Clock } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function UpcomingPayments() {
  const { data } = useFinance();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next 2 Weeks</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} />
          <span>Upcoming</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.upcomingPayments.map(payment => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Clock size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{payment.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(payment.date)} • {payment.frequency}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                ${Math.abs(payment.amount).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{payment.account}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
        Manage recurring payments
      </button>
    </div>
  );
}