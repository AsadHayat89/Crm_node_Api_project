const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  cnic: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: String,
  email: String,
  phone: String,
  noOfProperty: Number,
  noOfSold: Number,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
