const Expense = require('../models/Expense');

// @desc    Get all expenses for current user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, sortBy, search, startDate, endDate } = req.query;
    
    // Build query object
    let query = { user: req.user._id };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter (searches description)
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Sorting
    let sortOptions = { date: -1 }; // default to latest
    if (sortBy) {
      if (sortBy === 'amount_desc') {
        sortOptions = { amount: -1 };
      } else if (sortBy === 'amount_asc') {
        sortOptions = { amount: 1 };
      } else if (sortBy === 'date_asc') {
        sortOptions = { date: 1 };
      } else if (sortBy === 'date_desc') {
        sortOptions = { date: -1 };
      }
    }

    const expenses = await Expense.find(query).sort(sortOptions);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  try {
    if (!amount || !category || !description) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this expense' });
    }

    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category || expense.category;
    expense.description = description || expense.description;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};
