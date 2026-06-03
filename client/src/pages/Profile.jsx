import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Wallet, Download, Settings, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const { expenses, budget, updateBudget } = useExpenses();
  const [budgetVal, setBudgetVal] = useState(budget.toString());
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setBudgetVal(budget.toString());
  }, [budget]);

  const handleBudgetSave = (e) => {
    e.preventDefault();
    const parsed = parseFloat(budgetVal);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    setUpdating(true);
    try {
      updateBudget(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Convert expenses to CSV format and trigger download
  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) {
      toast.error('You do not have any recorded expenses to export');
      return;
    }

    try {
      const headers = ['Date', 'Category', 'Description', 'Amount ($)'];
      const rows = expenses.map((e) => [
        new Date(e.date).toISOString().split('T')[0],
        e.category,
        `"${e.description.replace(/"/g, '""')}"`, // Escape quotes
        e.amount.toFixed(2),
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `expenseflow_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Expense report downloaded successfully!');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('An error occurred during export');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100 tracking-tight margin-0">
          User Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal budget preferences and data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center">
            {/* Visual glow backdrop */}
            <div className="absolute -top-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold font-heading text-2xl shadow-xl shadow-indigo-500/10 border border-indigo-400/20 mt-4">
              {user?.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>

            <h3 className="text-xl font-bold font-heading text-slate-100 mt-5">{user?.name}</h3>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mt-1">Premium Account</p>

            <div className="w-full space-y-4 mt-8 text-left border-t border-slate-800/40 pt-6">
              {/* Field 1: Name */}
              <div className="flex items-center gap-3.5 text-sm text-slate-350">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Full Name</p>
                  <p className="truncate font-medium text-slate-200">{user?.name}</p>
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="flex items-center gap-3.5 text-sm text-slate-350">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Email Address</p>
                  <p className="truncate font-medium text-slate-200">{user?.email}</p>
                </div>
              </div>

              {/* Field 3: Registered At */}
              <div className="flex items-center gap-3.5 text-sm text-slate-350">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Member Since</p>
                  <p className="truncate font-medium text-slate-200">
                    {user?.createdAt ? formatDate(user.createdAt) : 'May 2026'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Banner Card */}
          <div className="glass-panel border-emerald-500/10 bg-emerald-500/5 rounded-3xl p-5 flex gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Session Secure</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Your authentication details are fully encrypted via JWT (JSON Web Tokens) and stored securely locally.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Data Utilities */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preferences Box */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/40 mb-6">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold font-heading text-slate-200">Budget Preferences</h3>
            </div>

            <form onSubmit={handleBudgetSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Monthly Spend Limit ($)
                </label>
                <p className="text-xs text-slate-500">
                  Define your maximum target spending per calendar month. This is used in dashboard progress meters.
                </p>
                <div className="relative max-w-sm mt-3">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium">
                    <Wallet className="w-5 h-5" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 font-mono glass-input text-base"
                    placeholder="1000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4 shadow-md shadow-indigo-600/10"
              >
                <Save className="w-4 h-4" />
                <span>Save preferences</span>
              </button>
            </form>
          </div>

          {/* Backup Box */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/40 mb-4">
              <Download className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold font-heading text-slate-200">Data Portability</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export your complete database of transaction statements into an offline spreadsheet. This will include dates, descriptions, categories, and exact dollar costs.
            </p>
            <div className="mt-6 flex flex-col xs:flex-row gap-3">
              <button
                onClick={handleExportCSV}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-600/10"
              >
                <Download className="w-4 h-4" />
                <span>Export History (.CSV)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
