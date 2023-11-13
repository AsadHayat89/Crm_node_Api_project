const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Size: { type: String },
  PriceRange: { type: String },
  Location: { type: String, required: true },
});

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
