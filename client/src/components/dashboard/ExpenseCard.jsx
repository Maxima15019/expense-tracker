import React from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Car,
  ShoppingBag,
  CreditCard,
  Film,
  Activity,
  HelpCircle,
  Edit2,
  Trash2,
  Calendar
} from 'lucide-react';

const categoryConfig = {
  Food: { icon: Utensils, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  Travel: { icon: Car, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  Shopping: { icon: ShoppingBag, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  Bills: { icon: CreditCard, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  Entertainment: { icon: Film, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  Health: { icon: Activity, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  Others: { icon: HelpCircle, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { _id, amount, category, description, date } = expense;
  const config = categoryConfig[category] || categoryConfig.Others;
  const Icon = config.icon;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-panel hover:bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between gap-4 group hover:scale-[1.01] hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Left side: Icon & Details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Category Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${config.color} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase mb-1.5 ${config.color}`}>
            {category}
          </span>
          <h4 className="font-medium text-slate-100 truncate text-sm sm:text-base group-hover:text-white transition-colors">
            {description}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>

      {/* Right side: Amount & Controls */}
      <div className="flex items-center gap-6 shrink-0">
        {/* Cost Display */}
        <span className="font-heading text-lg sm:text-xl font-bold text-slate-100 font-mono tracking-tight">
          -${amount.toFixed(2)}
        </span>

        {/* CRUD Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-500/20 hover:text-indigo-400 border border-slate-700/50 hover:border-indigo-500/30 transition-all text-slate-400"
            title="Edit Expense"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all text-slate-400"
            title="Delete Expense"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;
