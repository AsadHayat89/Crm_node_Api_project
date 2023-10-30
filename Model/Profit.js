const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
  totalEarning: String,
  employeeCnic: Number,
  employeeBonus: String,
  companyProfit:String,
  date: {
    type: Date,
    default: Date.now, // Assign the current date as the default value
  },
});

const Profit = mongoose.model('Profit', profitSchema);

module.exports = Profit;
