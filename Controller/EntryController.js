const Entity = require('../Model/Entry');

// Create a new entity
const createEntity = async (req, res) => {
  try {
    const newEntity = await Entity.create(req.body);
    res.status(201).json({status:"success",responce:newEntity});
  } catch (error) {
    res.status(500).json({status:"error", error: 'Internal Server Error' });
  }
};

// Get all entities
const getAllEntities = async (req, res) => {
  try {
    const entities = await Entity.find();
    res.status(200).json({status:"success",responce:entities});
  } catch (error) {
    res.status(500).json({ status:"error",error: 'Internal Server Error' });
  }
};

// Other controller functions...

module.exports = {
  createEntity,
  getAllEntities,
  // Other functions...
};
