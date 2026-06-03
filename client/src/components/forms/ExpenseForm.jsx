import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, DollarSign, Calendar, FileText, LayoutGrid } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];

const ExpenseForm = ({ isOpen, onClose, expenseToEdit }) => {
  const { addExpense, updateExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync state with edit target
  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description);
      // Format date string to YYYY-MM-DD for HTML input
      const formattedDate = new Date(expenseToEdit.date).toISOString().split('T')[0];
      setDate(formattedDate);
    } else {
      // Set defaults for new expense
      setAmount('');
      setCategory('Food');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]); // Today's date
    }
  }, [expenseToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;

    setSubmitting(true);
    const expenseData = {
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
    };

    try {
      if (expenseToEdit) {
        await updateExpense(expenseToEdit._id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 350 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative z-10 glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-850">
              <h3 className="text-lg font-bold font-heading text-slate-100">
                {expenseToEdit ? 'Edit Transaction' : 'New Expenditure'}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <DollarSign className="w-5 h-5" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 placeholder-slate-600 glass-input text-base font-mono"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Description
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <FileText className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    maxLength={100}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g., Groceries, Uber, Electric Bill"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-slate-100 placeholder-slate-600 glass-input text-sm"
                  />
                </div>
              </div>

              {/* Two columns: Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Category
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                      <LayoutGrid className="w-4 h-4" />
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-150 glass-input text-sm appearance-none cursor-pointer focus:ring-0"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-slate-150 glass-input text-sm focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-2xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-md shadow-indigo-500/20 text-sm flex items-center gap-2 hover:scale-[1.02]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{expenseToEdit ? 'Save Changes' : 'Add Expense'}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseForm;
