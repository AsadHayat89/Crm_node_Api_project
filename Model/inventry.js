// models/Deal.js
const mongoose = require('mongoose');

const InventrySchema = new mongoose.Schema({
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
  contact:String,
  bedroom: String,
  bathroom: String,
  ExpectedPrice: String,
  description: String,
  image:String,
  fileNumber: String,
  location: String,
  date: {
    type: Date,
    default: Date.now, // Assign the current date as the default value
  },
});

module.exports = mongoose.model('Inventry', InventrySchema);
