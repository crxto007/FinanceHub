import { Plus, Clock, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable } from './Editable';

export function Recurrings() {
  const { data, updateUpcoming } = useFinance();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  };

  const totalMonthly = data.upcomingPayments.reduce((sum, p) => {
    const amount = Math.abs(p.amount);
    if (p.frequency === 'Weekly') return sum + (amount * 4);
    if (p.frequency === 'Yearly') return sum + (amount / 12);
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recurring Payments</h1>
          <p className="text-gray-500 dark:text-gray-400">{data.upcomingPayments.length} active subscriptions</p>
        </div>
        <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Plus size={16} />
          Add Recurring
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Total</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">All recurring payments</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mb-2">${totalMonthly.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Per month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Next Payment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Due soonest</p>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {data.upcomingPayments[0]?.name}
          </p>
          <p className="text-2xl font-bold text-red-600">
            ${Math.abs(data.upcomingPayments[0]?.amount || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {getDaysUntil(data.upcomingPayments[0]?.date)} days from now
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Recurring Payments</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.upcomingPayments.map(payment => {
            const daysUntil = getDaysUntil(payment.date);
            const isUrgent = daysUntil <= 7 && daysUntil >= 0;

            return (
              <div key={payment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isUrgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <Clock size={20} className={isUrgent ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{payment.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.frequency} • {payment.account}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white group">
                      $<Editable value={Math.abs(payment.amount)} onChange={(v) => updateUpcoming(payment.id, { amount: -v })} type="number" className="inline-flex items-center text-lg font-bold" />
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </span>
                      <span className={`text-xs font-medium ${isUrgent ? 'text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full' : 'text-gray-400'}`}>
                        {daysUntil > 0 ? `${daysUntil} days` : 'Today'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}