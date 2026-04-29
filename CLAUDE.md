# FinanceHub - Personal Finance Dashboard

A React + Tailwind CSS financial management dashboard with AI-powered advisor.

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS** for styling
- **Recharts** for data visualizations
- **@anthropic-ai/sdk** for Claude AI integration
- **Lucide React** for icons

## Project Structure

```
src/
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── index.css            # Global styles + Tailwind
├── context/
│   └── FinanceContext.jsx  # State management + localStorage persistence
└── components/
    ├── Sidebar.jsx         # Navigation sidebar with accounts
    ├── AIAdvisor.jsx       # Claude AI chat interface
    ├── Dashboard.jsx       # Main dashboard
    ├── SpendingCard.jsx    # Circular progress for monthly spending
    ├── AssetsDebtCards.jsx # Assets/debt summary with mini charts
    ├── TransactionsList.jsx # Recent transactions
    ├── CategoriesBreakdown.jsx # Category spending bars
    ├── NetThisMonth.jsx    # Income vs expenses
    ├── UpcomingPayments.jsx # Next 2 weeks payments
    ├── GoalsSection.jsx    # Goals progress
    ├── Transactions.jsx    # Full transactions page
    ├── Goals.jsx           # Full goals page
    ├── CashFlow.jsx        # Cash flow analytics
    ├── Accounts.jsx        # Accounts management
    ├── Investments.jsx     # Investments tracking
    ├── Categories.jsx      # Budget categories
    ├── Recurrings.jsx      # Recurring payments
    └── Editable.jsx        # Inline editing components
```

## Features

- **Fully editable** - Click any value to edit (budgets, transactions, accounts, goals)
- **localStorage persistence** - All data auto-saves
- **Light/dark theme** toggle with persistence
- **AI Financial Advisor** - Chat with Claude for personalized advice
- **Responsive design** - Mobile, tablet, desktop layouts
- **Real-time calculations** - Net income, savings rate, budget tracking

## Running

```bash
npm install
npm run dev    # Development at http://localhost:5173
npm run build  # Production build
```

## AI Setup

The AI advisor requires ANTHROPIC_API_KEY environment variable or the user must set it in their browser session. Without it, the chat will show an error message.

## Data Persistence

All financial data is stored in localStorage under `financeData` key. Theme preference stored under `theme` key. Chat history stored under `aiMessages` key.