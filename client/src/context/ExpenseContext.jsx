import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ExpenseContext = createContext();

const initialFilters = {
  category: 'All',
  sortBy: 'date_desc',
  search: '',
  startDate: '',
  endDate: '',
};

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [budget, setLocalBudget] = useState(1000); // Default monthly budget

  // Load user-specific budget from localStorage
  useEffect(() => {
    if (user) {
      const savedBudget = localStorage.getItem(`budget_${user._id}`);
      if (savedBudget) {
        setLocalBudget(Number(savedBudget));
      } else {
        setLocalBudget(1000); // default
      }
    } else {
      setExpenses([]);
      setFilters(initialFilters);
    }
  }, [user]);

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Build query string from filters
      const params = {};
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const { data } = await api.get('/expenses', { params });
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch expenses when filters or user changes
  useEffect(() => {
    fetchExpenses();
  }, [filters, user]);

  // Add expense
  const addExpense = async (expenseData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/expenses', expenseData);
      setExpenses((prev) => [data, ...prev]);
      toast.success('Expense added successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add expense';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update expense
  const updateExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/expenses/${id}`, expenseData);
      setExpenses((prev) =>
        prev.map((item) => (item._id === id ? data : item))
      );
      toast.success('Expense updated successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update expense';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      toast.success('Expense deleted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete expense';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Update user budget
  const updateBudget = (amount) => {
    if (user) {
      localStorage.setItem(`budget_${user._id}`, amount.toString());
      setLocalBudget(amount);
      toast.success(`Monthly budget updated to $${amount}`);
    }
  };

  // Memoized derived calculations for analytics
  const analytics = useMemo(() => {
    // Total spent
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);

    // Breakdown by category
    const byCategory = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Bills: 0,
      Entertainment: 0,
      Health: 0,
      Others: 0,
    });

    // Breakdown by month (for the current calendar year or last 6 months)
    // We'll calculate month-over-month totals based on date
    const monthlyMap = {};
    expenses.forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const key = `${month} ${year}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + item.amount;
    });

    // Convert monthly map to sorted array (latest 6 months)
    const monthlyTrends = Object.entries(monthlyMap)
      .map(([month, amount]) => ({ month, amount }))
      .reverse()
      .slice(-6); // last 6 months

    // Dynamic AI insights based on spending habits
    const insights = [];
    if (total > budget) {
      insights.push({
        type: 'danger',
        message: `You've exceeded your monthly budget by $${(total - budget).toFixed(2)}! Consider pausing non-essential purchases.`,
      });
    } else if (total > budget * 0.8) {
      insights.push({
        type: 'warning',
        message: `Alert: You've used ${(total / budget * 100).toFixed(0)}% of your monthly budget. Tread carefully.`,
      });
    } else {
      insights.push({
        type: 'success',
        message: `Great job! You've saved $${(budget - total).toFixed(2)} of your budget this month. Keep it up!`,
      });
    }

    // Find highest spending category
    let maxCategory = 'Others';
    let maxAmount = 0;
    Object.entries(byCategory).forEach(([cat, amt]) => {
      if (amt > maxAmount) {
        maxAmount = amt;
        maxCategory = cat;
      }
    });

    if (maxAmount > 0) {
      insights.push({
        type: 'info',
        message: `Your highest expenditure is on **${maxCategory}** ($${maxAmount.toFixed(2)}), making up ${(maxAmount / (total || 1) * 100).toFixed(0)}% of your expenses.`,
      });
    }

    // Advice based on bills or entertainment
    if (byCategory.Entertainment > budget * 0.25) {
      insights.push({
        type: 'warning',
        message: 'Your entertainment expense is high this period. Check for unused subscriptions or dine-out habits.',
      });
    }

    return {
      totalSpending: total,
      categoryBreakdown: byCategory,
      monthlyTrends,
      insights,
    };
  }, [expenses, budget]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        filters,
        budget,
        analytics,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        updateFilters,
        resetFilters,
        updateBudget,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
