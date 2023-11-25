// models/Deal.js
const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: ['Build', 'UnBuild'],
  },
  property: {
    type: String,
    enum: ['House', 'Villa', 'Plaza', 'Shop'],
  },
  propertySize: String,
  rooms: String,
  employeeProfit:String,
  companyProfit:String,
  bedroom: String,
  bathroom: String,
  employeeCnic: Number,
  employeeName: String,
  customerCnic: Number,
  customerName: String,
  actualPrice: String,
  soldPrice: String,
  description: String,
  image:String,
  fileNumber: String,
  location: String,

  date: {
    type: Date,
    default: Date.now, // Assign the current date as the default value
  },
});

module.exports = mongoose.model('Deal', dealSchema);
