// models/expenseModel.js

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expenseType: {
        type: String,
        enum: ['other', 'pay'],
        required: true
    },
    expenseAmount: {
        type: String,
    },
    description: {
        type: String,
    },
    image:{
        type:String,
    },
    employeeIds:String,
    date: {
        type: Date,
        default: Date.now, // Assign the current date as the default value
      },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
