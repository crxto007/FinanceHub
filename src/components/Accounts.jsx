import { Plus, CreditCard, Building2, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Editable, EditableSelect } from './Editable';

export function Accounts() {
  const { data, updateAccount } = useFinance();

  const creditCards = data.accounts.filter(a => a.type === 'credit_card');
  const depository = data.accounts.filter(a => a.type !== 'credit_card');

  const totalDebt = creditCards.reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const totalBalance = depository.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="text-gray-500 dark:text-gray-400">{data.accounts.length} linked accounts</p>
        </div>
        <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Plus size={16} />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <CreditCard size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Credit Cards</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{creditCards.length} cards</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-2">-${totalDebt.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total outstanding balance</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Depository Accounts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{depository.length} accounts</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-2">${totalBalance.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total available balance</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Accounts</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.accounts.map(account => (
            <div key={account.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    {account.type === 'credit_card' ? (
                      <CreditCard size={20} style={{ color: account.color }} />
                    ) : (
                      <Building2 size={20} style={{ color: account.color }} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${account.balance < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                    ${account.balance.toLocaleString()}
                  </p>
                  {account.limit && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${Math.abs(account.balance).toLocaleString()} of ${account.limit.toLocaleString()} limit
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}