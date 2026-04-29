import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { AIAdvisor } from './components/AIAdvisor';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Goals } from './components/Goals';
import { CashFlow } from './components/CashFlow';
import { Accounts } from './components/Accounts';
import { Investments } from './components/Investments';
import { Categories } from './components/Categories';
import { Recurrings } from './components/Recurrings';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

function AppContent() {
  const { currentPage, sidebarOpen } = useFinance();
  const [showAI, setShowAI] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'goals': return <Goals />;
      case 'cashflow': return <CashFlow />;
      case 'accounts': return <Accounts />;
      case 'investments': return <Investments />;
      case 'categories': return <Categories />;
      case 'recurrings': return <Recurrings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>

        {/* AI Advisor Toggle Button */}
        <button
          onClick={() => setShowAI(!showAI)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all z-20"
        >
          {showAI ? (
            <span className="text-white text-xl">×</span>
          ) : (
            <MessageSquare size={24} className="text-white" />
          )}
        </button>

        {/* AI Advisor Panel */}
        <div
          className={`fixed bottom-20 right-6 w-96 h-[500px] transition-all duration-300 z-20 ${
            showAI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <AIAdvisor onClose={() => setShowAI(false)} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}