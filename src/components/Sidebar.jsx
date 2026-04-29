import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  Receipt,
  Target,
  TrendingUp,
  Wallet,
  PiggyBank,
  Tags,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  X,
  CreditCard,
  Building2,
  LineChart
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'cashflow', label: 'Cash flow', icon: TrendingUp },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'investments', label: 'Investments', icon: PiggyBank },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'recurrings', label: 'Recurrings', icon: RefreshCw }
];

export function Sidebar() {
  const { currentPage, setCurrentPage, theme, toggleTheme, sidebarOpen, setSidebarOpen, data } = useFinance();
  const { accounts, investments } = data;

  const creditCards = accounts.filter(a => a.type === 'credit_card');
  const depository = accounts.filter(a => a.type !== 'checking' || a.type === 'savings');
  const totalAssets = () => {
    const dep = accounts.filter(a => a.type !== 'credit_card').reduce((s, a) => s + a.balance, 0);
    const inv = investments.reduce((s, i) => s + i.balance, 0);
    return dep + inv;
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col overflow-hidden
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">💰</span> FinanceHub
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${currentPage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Accounts</h3>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <CreditCard size={14} />
              <span>Credit Cards</span>
            </div>
            {creditCards.map(card => (
              <div key={card.id} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">{card.name}</span>
                <span className={`text-sm font-medium ${card.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${card.balance.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Building2 size={14} />
              <span>Depository</span>
            </div>
            {depository.map(acc => (
              <div key={acc.id} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">{acc.name}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  ${acc.balance.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <LineChart size={14} />
              <span>Investments</span>
            </div>
            {investments.map(inv => (
              <div key={inv.id} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">{inv.name}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  ${inv.balance.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Balance</span>
              <span className="text-lg font-bold text-blue-600">${totalAssets().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}