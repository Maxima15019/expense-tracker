import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Percent,
  ListCollapse,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import ExpenseCard from '../components/dashboard/ExpenseCard';
import ExpenseForm from '../components/forms/ExpenseForm';

const categories = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];

const Dashboard = () => {
  const {
    expenses,
    loading,
    filters,
    budget,
    analytics,
    updateFilters,
    resetFilters,
    deleteExpense,
  } = useExpenses();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Stats derivations
  const totalSpent = analytics?.totalSpending || 0;
  const budgetUsagePercent = Math.min(((totalSpent / budget) * 100), 100).toFixed(0);
  const avgTransaction = expenses.length > 0 ? (totalSpent / expenses.length) : 0;
  const totalTransactionsCount = expenses.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    resetFilters();
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit(expense);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'danger':
        return <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
  };

  const getInsightClass = (type) => {
    switch (type) {
      case 'danger':
        return 'border-red-500/20 bg-red-500/5 text-red-200';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/5 text-amber-200';
      case 'success':
        return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200';
      default:
        return 'border-indigo-500/20 bg-indigo-500/5 text-indigo-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Upper Section: Welcome Header & Quick Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100 tracking-tight margin-0">
            Financial Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time breakdown of your expenditures and budget utilization.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Expense</span>
        </button>
      </div>

      {/* Stats Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Spent */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Expenditures</span>
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-100 mt-4 font-mono">
            ${totalSpent.toFixed(2)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">For currently filtered period</p>
        </div>

        {/* Stat 2: Budget Progress */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Budget Utilized</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-100 mt-4 font-mono">
            {budgetUsagePercent}%
          </h2>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                Number(budgetUsagePercent) >= 90
                  ? 'bg-gradient-to-r from-red-500 to-rose-600'
                  : Number(budgetUsagePercent) >= 75
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${budgetUsagePercent}%` }}
            />
          </div>
        </div>

        {/* Stat 3: Avg Transaction */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Average Size</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-100 mt-4 font-mono">
            ${avgTransaction.toFixed(2)}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Per individual bill</p>
        </div>

        {/* Stat 4: Transaction Count */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Count</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <ListCollapse className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-100 mt-4 font-mono">
            {totalTransactionsCount}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Recorded transactions</p>
        </div>
      </div>

      {/* Main Grid: Charts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category breakdown pie chart */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-200">Category Proportions</h3>
            <p className="text-xs text-slate-500">Distribution of expenditures by type</p>
          </div>
          <div className="my-6">
            <CategoryPieChart breakdown={analytics?.categoryBreakdown || {}} />
          </div>
        </div>

        {/* Monthly spending bar chart */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-200">Monthly Spending Trend</h3>
            <p className="text-xs text-slate-500">Monthly cash flow changes (last 6 months)</p>
          </div>
          <div className="my-6">
            <MonthlyBarChart trends={analytics?.monthlyTrends || []} />
          </div>
        </div>
      </div>

      {/* Smart AI spending suggestions */}
      {analytics?.insights && analytics.insights.length > 0 && (
        <div className="glass-panel border border-indigo-500/10 rounded-3xl p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-md font-bold font-heading text-slate-200">AI-Inspired Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.insights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start gap-3 text-sm ${getInsightClass(
                  insight.type
                )}`}
              >
                {getInsightIcon(insight.type)}
                <span dangerouslySetInnerHTML={{ __html: insight.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Management Center: Toolbar & List */}
      <div className="glass-panel rounded-3xl p-6 space-y-6">
        {/* Header & Filter Controls Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/40">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-200">Transactions List</h3>
            <p className="text-xs text-slate-500">Search and filter your history</p>
          </div>
          {/* Quick Filters Reset */}
          {(filters.category !== 'All' || filters.search || filters.startDate || filters.endDate) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium self-start md:self-center transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Filters Toolbar */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Search box */}
          <div className="lg:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search descriptions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-600 glass-input text-xs"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => { setLocalSearch(''); updateFilters({ search: '' }); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-slate-200 glass-input text-xs appearance-none cursor-pointer focus:ring-0"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="lg:col-span-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilters({ startDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-slate-200 glass-input text-xs focus:ring-0"
              title="Start Date"
            />
          </div>

          {/* End Date */}
          <div className="lg:col-span-2">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilters({ endDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-slate-200 glass-input text-xs focus:ring-0"
              title="End Date"
            />
          </div>

          {/* Sort selector */}
          <div className="lg:col-span-2">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-slate-200 glass-input text-xs appearance-none cursor-pointer focus:ring-0"
            >
              <option value="date_desc" className="bg-slate-900 text-slate-250">Latest Date</option>
              <option value="date_asc" className="bg-slate-900 text-slate-250">Oldest Date</option>
              <option value="amount_desc" className="bg-slate-900 text-slate-250">Highest Amount</option>
              <option value="amount_asc" className="bg-slate-900 text-slate-250">Lowest Amount</option>
            </select>
          </div>
        </form>

        {/* Expenses List */}
        <div className="space-y-3 relative min-h-32">
          {loading && expenses.length === 0 ? (
            // Skeleton Loaders
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-slate-800/20 border border-slate-800/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            // Beautiful Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-center mb-4">
                <FolderOpen className="w-7 h-7 text-indigo-400" />
              </div>
              <h4 className="text-md font-bold font-heading text-slate-200">No transactions found</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                We couldn't find any expenses matching your criteria. Try adjustments to search terms or register a new transaction.
              </p>
              <button
                onClick={handleCreateClick}
                className="mt-5 px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/30 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                Create Transaction
              </button>
            </motion.div>
          ) : (
            // Animate list items
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {expenses.map((expense) => (
                  <ExpenseCard
                    key={expense._id}
                    expense={expense}
                    onEdit={handleEditClick}
                    onDelete={deleteExpense}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal (Add / Edit) */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setExpenseToEdit(null);
        }}
        expenseToEdit={expenseToEdit}
      />
    </motion.div>
  );
};

export default Dashboard;
