import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon, Wallet, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../context/ExpenseContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const { analytics, budget } = useExpenses();
  const [isLightMode, setIsLightMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
      setIsLightMode(true);
      document.body.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLightMode(true);
    }
  };

  const budgetUsagePercent = ((analytics?.totalSpending || 0) / budget) * 100;
  const isBudgetWarning = budgetUsagePercent >= 80;

  return (
    <header className="h-20 px-6 border-b border-slate-800/40 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      {/* Left section: Hamburger / Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-block font-heading text-lg font-semibold tracking-wide bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
          Financial Control Center
        </span>
      </div>

      {/* Right section: Quick Budget Stats, Theme Toggle, User Avatar */}
      <div className="flex items-center gap-6">
        {/* Quick Budget Display (hidden on mobile) */}
        {user && (
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
            <div className={`p-1.5 rounded-lg ${isBudgetWarning ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Used of Budget</p>
              <p className={`text-xs font-semibold font-mono ${isBudgetWarning ? 'text-red-400' : 'text-emerald-400'}`}>
                ${analytics?.totalSpending?.toFixed(0) || 0} / ${budget}
              </p>
            </div>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 border border-transparent hover:border-slate-800 transition-all shadow-sm"
          title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* User Profile Info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user.name}</p>
              <p className="text-[10px] text-slate-500">Premium Account</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold font-heading shadow-md shadow-indigo-500/20 border border-indigo-400/20">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
