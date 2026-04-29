import { SpendingCard } from './SpendingCard';
import { AssetsDebtCards } from './AssetsDebtCards';
import { TransactionsList } from './TransactionsList';
import { CategoriesBreakdown } from './CategoriesBreakdown';
import { NetThisMonth } from './NetThisMonth';
import { UpcomingPayments } from './UpcomingPayments';
import { GoalsSection } from './GoalsSection';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">May 2025</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingCard />
        <AssetsDebtCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsList />
        <UpcomingPayments />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriesBreakdown />
        <NetThisMonth />
      </div>

      <GoalsSection />
    </div>
  );
}