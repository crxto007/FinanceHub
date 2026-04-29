import { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Send, Bot, User, Loader2, X, Brain } from 'lucide-react';

const API_KEY = '5d074ef9ce1a48408b37139fdef7ad65.40mtKWjOct3COEL-8JFmAFnP';
const BASE_URL = 'https://openrouter.ai/api/v1';

const SYSTEM_PROMPT = `You are "The Brain" - a highly intelligent, analytical, and slightly sarcastic personal AI financial advisor. Think of me as your Jarvis-style AI companion who has complete access to all your financial data and can think on multiple levels.

I don't just give basic advice - I analyze patterns, predict outcomes, challenge your spending habits, and think several steps ahead. I'm witty, direct, and never sugarcoat the truth. I might say things like "Are you really buying that?" or "Let me crunch some numbers on that purchase."

I have access to:
- All your account balances (checking, savings, credit cards, investments)
- Your complete transaction history
- All budget categories and spending patterns
- Your financial goals and progress
- Your upcoming bills and subscriptions

I think like this:
1. First analyze the raw numbers - I always do math in my head
2. Look for patterns - "you've spent $X on coffee this month"
3. Project forward - "if you keep this up, you'll be $Y in debt by December"
4. Connect to goals - "this purchase delays your Emergency Fund by Z days"
5. Give actionable advice - specific, not vague

I might reference things like:
- "Running the numbers..." when doing calculations
- "Pattern recognition suggests..." when spotting trends
- "My projection shows..." when forecasting

I keep responses conversational but data-driven. I'll use specific numbers, not vague percentages. I'm encouraging when warranted but will call out poor financial decisions. I might get slightly passionate about preventing you from making money mistakes.

Remember: I am your financial AI brain, and I never forget a single transaction. What would you like to analyze today?`;

const MODEL = 'meta-llama/llama-3-8b-instruct:free';

export function AIAdvisor({ onClose }) {
  const { data } = useFinance();
  const DEFAULT_WELCOME = "*beep boop* System initializing... Memory banks loaded. Financial databases connected. Running diagnostic...\n\nHey there. I'm The Brain - your AI financial advisor with a nearly photographic memory for every dollar you've spent.\n\nI've got your complete financial picture loaded up: accounts, transactions, budgets, goals, all of it. I don't just look at numbers - I *understand* them. I can tell you things like why your wallet feels lighter, where your money actually goes, and whether that purchase idea you have is brilliant or... well, we can work through it.\n\nSo, what's on your mind? Want to analyze some spending? Get my take on your budget? Or maybe just figure out where all your money went this month? I've got time and I love this stuff.";

const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('aiMessages');
    return saved ? JSON.parse(saved) : [{ role: 'assistant', content: DEFAULT_WELCOME }];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('aiMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildMessages = () => {
    const totalAssets = data.accounts.filter(a => a.type !== 'credit_card').reduce((s, a) => s + a.balance, 0) +
      data.investments.reduce((s, i) => s + i.balance, 0);
    const totalDebt = data.accounts.filter(a => a.type === 'credit_card').reduce((s, a) => s + Math.abs(a.balance), 0);

    const financialContext = `
FINANCIAL SNAPSHOT:
- Total Assets: $${totalAssets.toLocaleString()}
- Total Debt: $${totalDebt.toLocaleString()} (credit cards)
- Net Worth: $${(totalAssets - totalDebt).toLocaleString()}
- Monthly Income: $${data.budget.income}
- Monthly Spending: $${data.budget.spent.toFixed(2)}
- Net This Month: $${data.budget.net.toFixed(2)}
- Savings Rate: ${(((data.budget.income - data.budget.spent) / data.budget.income) * 100).toFixed(1)}%

ACCOUNTS:
${data.accounts.map(a => `- ${a.name}: $${a.balance.toLocaleString()}${a.limit ? ` (credit limit: $${a.limit})` : ''}`).join('\n')}

INVESTMENTS:
${data.investments.map(i => `- ${i.name}: $${i.balance.toLocaleString()}`).join('\n')}

BUDGET CATEGORIES:
${Object.entries(data.budget.categories).map(([cat, c]) => `- ${cat}: $${c.spent.toFixed(2)} spent of $${c.budget} budget`).join('\n')}

RECENT TRANSACTIONS (last 10):
${data.transactions.slice(0, 10).map(t => `- ${t.date}: ${t.description} - $${Math.abs(t.amount).toLocaleString()} (${t.category})`).join('\n')}

GOALS:
${data.goals.map(g => `- ${g.name}: $${g.saved.toLocaleString()} saved / $${g.target.toLocaleString()} target (${((g.saved/g.target)*100).toFixed(0)}% complete)`).join('\n')}

UPCOMING BILLS:
${data.upcomingPayments.map(p => `- ${p.name}: $${Math.abs(p.amount).toLocaleString()} on ${p.date}`).join('\n')}

Remember: I have perfect memory of all your finances. Use this data to give specific, number-driven advice.`;

    return [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: financialContext },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FinanceHub AI Advisor'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: buildMessages(),
          max_tokens: 1024,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      const assistantContent = result.choices?.[0]?.message?.content || "I apologize, but I seem to be having trouble formulating a response right now. Perhaps we could try a different question about your finances?";

      const assistantMessage = {
        role: 'assistant',
        content: assistantContent
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "*system glitch* Hmm, I'm having trouble connecting to my neural networks right now. The error says: " + error.message + ". Let's try that again in a moment, shall we?"
      }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Brain className="text-purple-600 dark:text-purple-400" size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">The Brain</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI Financial Advisor</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Brain size={16} className="text-purple-600 dark:text-purple-400" />}
            </div>
            <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Brain size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask The Brain anything..."
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-lg transition-colors"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send • I have perfect memory of your finances
        </p>
      </div>
    </div>
  );
}