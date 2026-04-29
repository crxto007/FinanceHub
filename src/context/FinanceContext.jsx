import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const defaultData = {
  accounts: [
    { id: 'credit_1', name: 'Chase Credit Card', type: 'credit_card', balance: -1110, limit: 5000, color: '#3B82F6' },
    { id: 'savings_1', name: 'Regular Savings', type: 'savings', balance: 13126, color: '#10B981' },
    { id: 'checking_1', name: 'Total Checking', type: 'checking', balance: 8035, color: '#3B82F6' },
    { id: 'adyplus_1', name: 'Adv Plus Banking', type: 'savings', balance: 3109, color: '#10B981' }
  ],
  investments: [
    { id: 'inv_1', name: 'Robinhood', balance: 5010, color: '#8B5CF6' },
    { id: 'inv_2', name: 'Wealthfront', balance: 11986, color: '#3B82F6' },
    { id: 'inv_3', name: 'Coinbase', balance: 1080, color: '#F59E0B' }
  ],
  transactions: [
    { id: 't1', date: '2025-05-07', description: 'Lemonade Insurance', amount: -376.35, category: 'Insurance', status: 'pending', merchant: 'CAR' },
    { id: 't2', date: '2025-05-07', description: 'Trader Joe\'s', amount: -45.52, category: 'Groceries', status: 'completed', merchant: 'CAR' },
    { id: 't3', date: '2025-05-06', description: 'Trader Joe\'s', amount: -87.22, category: 'Groceries', status: 'completed', merchant: 'CAR' },
    { id: 't4', date: '2025-05-05', description: 'Shell Gas Station', amount: -52.30, category: 'Transportation', status: 'completed', merchant: 'CAR' },
    { id: 't5', date: '2025-05-04', description: 'Netflix', amount: -15.99, category: 'Subscriptions', status: 'completed', merchant: 'CAR' },
    { id: 't6', date: '2025-05-03', description: 'Amazon', amount: -125.00, category: 'Shopping', status: 'completed', merchant: 'CAR' },
    { id: 't7', date: '2025-05-02', description: 'Starbucks', amount: -8.45, category: 'Food & Drink', status: 'completed', merchant: 'CAR' },
    { id: 't8', date: '2025-05-01', description: 'Rent Payment', amount: -1984, category: 'Rent', status: 'completed', merchant: 'CAR' },
    { id: 't9', date: '2025-05-01', description: 'Electric Bill', amount: -138, category: 'Utilities', status: 'completed', merchant: 'CAR' },
    { id: 't10', date: '2025-04-30', description: 'Target', amount: -89.99, category: 'Shops', status: 'completed', merchant: 'CAR' },
    { id: 't11', date: '2025-04-29', description: 'Paycheck Deposit', amount: 2800, category: 'Income', status: 'completed', merchant: 'CAR' },
    { id: 't12', date: '2025-04-28', description: 'Spotify', amount: -9.99, category: 'Subscriptions', status: 'completed', merchant: 'CAR' }
  ],
  budget: {
    income: 2800,
    spent: 3369.24,
    net: -569.24,
    period: 'monthly',
    categories: {
      'Home': { budget: 2022, spent: 2022, icon: '🏠', color: '#DC2626' },
      'Rent': { budget: 1984, spent: 1984, icon: '🏢', color: '#F97316' },
      'Utilities': { budget: 138, spent: 138, icon: '⚡', color: '#10B981' },
      'Car & Transportation': { budget: 731, spent: 731, icon: '🚗', color: '#3B82F6' },
      'Car': { budget: 731, spent: 731, icon: '🚙', color: '#8B5CF6' },
      'Transportation': { budget: 10, spent: 10, icon: '🚌', color: '#EC4899' },
      'Entertainment': { budget: 213, spent: 213, icon: '🎭', color: '#DC2626' },
      'Shopping': { budget: 204, spent: 204, icon: '🛍️', color: '#F59E0B' },
      'Shops': { budget: 134, spent: 134, icon: '🏪', color: '#DC2626' },
      'Clothing': { budget: 70, spent: 70, icon: '👕', color: '#F59E0B' },
      'Food & Drink': { budget: 198, spent: 198, icon: '🍽️', color: '#F59E0B' },
      'Subscriptions': { budget: 35, spent: 35, icon: '📱', color: '#10B981' }
    }
  },
  goals: [
    { id: 'goal1', name: 'Emergency Fund', icon: '🎯', target: 10000, saved: 4000, deadline: '2025-12-31', color: '#10B981' },
    { id: 'goal2', name: 'Vacation Fund', icon: '🏖️', target: 3000, saved: 1500, deadline: '2025-08-31', color: '#3B82F6' },
    { id: 'goal3', name: 'New Laptop', icon: '💻', target: 2000, saved: 800, deadline: '2025-11-30', color: '#8B5CF6' }
  ],
  upcomingPayments: [
    { id: 'up1', date: '2025-05-15', name: 'Audible', amount: -14.99, frequency: 'Monthly', account: 'Chase Credit Card' },
    { id: 'up2', date: '2025-05-21', name: 'Hulu', amount: -7.99, frequency: 'Monthly', account: 'Chase Credit Card' },
    { id: 'up3', date: '2025-05-28', name: 'Netflix', amount: -15.99, frequency: 'Monthly', account: 'Chase Credit Card' }
  ],
  monthlyData: [
    { month: 'Nov', income: 2800, expenses: 3100 },
    { month: 'Dec', income: 2800, expenses: 3400 },
    { month: 'Jan', income: 2800, expenses: 2950 },
    { month: 'Feb', income: 2800, expenses: 3200 },
    { month: 'Mar', income: 2800, expenses: 3350 },
    { month: 'Apr', income: 2800, expenses: 3369 }
  ]
};

export function FinanceProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('financeData');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const updateTransaction = (id, updates) => {
    setData(d => ({
      ...d,
      transactions: d.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
    recalculateBudget();
  };

  const addTransaction = (transaction) => {
    setData(d => ({
      ...d,
      transactions: [...d.transactions, { ...transaction, id: `t${Date.now()}` }]
    }));
    recalculateBudget();
  };

  const deleteTransaction = (id) => {
    setData(d => ({
      ...d,
      transactions: d.transactions.filter(t => t.id !== id)
    }));
    recalculateBudget();
  };

  const updateAccount = (id, updates) => {
    setData(d => ({
      ...d,
      accounts: d.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  };

  const updateInvestment = (id, updates) => {
    setData(d => ({
      ...d,
      investments: d.investments.map(i => i.id === id ? { ...i, ...updates } : i)
    }));
  };

  const updateBudget = (category, updates) => {
    setData(d => ({
      ...d,
      budget: {
        ...d.budget,
        categories: {
          ...d.budget.categories,
          [category]: { ...d.budget.categories[category], ...updates }
        }
      }
    }));
  };

  const updateBudgetIncome = (income) => {
    setData(d => ({
      ...d,
      budget: { ...d.budget, income, net: income - d.budget.spent }
    }));
  };

  const updateGoal = (id, updates) => {
    setData(d => ({
      ...d,
      goals: d.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const deleteGoal = (id) => {
    setData(d => ({
      ...d,
      goals: d.goals.filter(g => g.id !== id)
    }));
  };

  const addGoal = (goal) => {
    setData(d => ({
      ...d,
      goals: [...d.goals, { ...goal, id: `goal${Date.now()}` }]
    }));
  };

  const updateUpcoming = (id, updates) => {
    setData(d => ({
      ...d,
      upcomingPayments: d.upcomingPayments.map(u => u.id === id ? { ...u, ...updates } : u)
    }));
  };

  const recalculateBudget = () => {
    setData(d => {
      const spent = d.transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const categories = { ...d.budget.categories };
      Object.keys(categories).forEach(cat => {
        categories[cat].spent = d.transactions
          .filter(t => t.category === cat)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      });
      return {
        ...d,
        budget: { ...d.budget, spent, net: d.budget.income - spent, categories }
      };
    });
  };

  const totalAssets = () => {
    const depository = d.accounts.filter(a => a.type !== 'credit_card').reduce((sum, a) => sum + a.balance, 0);
    const investments = d.investments.reduce((sum, i) => sum + i.balance, 0);
    return depository + investments;
  };

  const totalDebt = () => {
    return d.accounts.filter(a => a.type === 'credit_card').reduce((sum, a) => sum + Math.abs(a.balance), 0);
  };

  const value = {
    data,
    setData,
    theme,
    toggleTheme,
    currentPage,
    setCurrentPage,
    sidebarOpen,
    setSidebarOpen,
    updateTransaction,
    addTransaction,
    deleteTransaction,
    updateAccount,
    updateInvestment,
    updateBudget,
    updateBudgetIncome,
    updateGoal,
    deleteGoal,
    addGoal,
    updateUpcoming,
    recalculateBudget,
    totalAssets: () => {
      const depository = data.accounts.filter(a => a.type !== 'credit_card').reduce((sum, a) => sum + a.balance, 0);
      const investments = data.investments.reduce((sum, i) => sum + i.balance, 0);
      return depository + investments;
    },
    totalDebt: () => data.accounts.filter(a => a.type === 'credit_card').reduce((sum, a) => sum + Math.abs(a.balance), 0)
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}