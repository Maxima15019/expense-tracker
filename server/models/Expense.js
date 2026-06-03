const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'],
        message: '{VALUE} is not a supported expense category',
      },
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      maxlength: [100, 'Description cannot be more than 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
