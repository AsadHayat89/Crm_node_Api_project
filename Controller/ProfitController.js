const Profit = require('../Model/Profit');

// Create a new profit entry
const createProfit = async (req, res) => {
  try {
    console.log("reache here");
    const profit = new Profit(req.body);
    const newProfit = await profit.save();
    res.status(201).json(newProfit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const getMonthlyProfit=async(req,res)=>{
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

  try {
    const totalEarnings = await Profit.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalEarning: { $sum: { $toDouble: '$totalEarning' } },
          totalCompanyProfit: { $sum: { $toDouble: '$companyProfit' } }
        }
      }
    ]);

    res.json({status: "success",responce:{
      totalEarning: totalEarnings[0].totalEarning || 0,
      totalCompanyProfit: totalEarnings[0].totalCompanyProfit || 0
    }
    });
  } catch (error) {
    res.status(500).json({ status: "error",error: error.message });
  }
}

// Get a list of all profits
const getAllProfits = async (req, res) => {
  try {
    const profits = await Profit.find();
    res.status(200).json({status:'success',responce:profits});
  } catch (err) {
    res.status(500).json({ status:'error',error: err.message });
  }
};



// Get profits for a given employee by ID, month, and year
const getProfitByEmployeeAndDate = async (req, res) => {
    try {
        console.log("Employee id: "+req.body.employeeId);
        const { employeeId, month, year } = req.body; // Assuming you pass employeeId, month, and year as parameters
     
      // Convert month and year to numeric values
      const numericMonth = parseInt(month);
      const numericYear = parseInt(year);
    
      // Calculate the start and end date of the specified month and year
      const startDate = new Date(numericYear, numericMonth - 1, 1); // Subtract 1 from the month because months are zero-indexed
      const endDate = new Date(numericYear, hx, 0); // The zero day of the next month is the last day of the specified month
        
      const profits = await Profit.find({
        employeeID: employeeId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
  
      res.status(200).json(profits);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Get a single profit by ID
const getProfitById = async (req, res) => {
  try {
    const profit = await Profit.findById(req.params.id);

    if (!profit) {
      return res.status(404).json({ error: 'Profit entry not found' });
    }

    res.status(200).json(profit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a profit entry by ID
const updateProfit = async (req, res) => {
  try {
    const updatedProfit = await Profit.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProfit) {
      return res.status(404).json({ error: 'Profit entry not found' });
    }

    res.status(200).json(updatedProfit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a profit entry by ID
const deleteProfit = async (req, res) => {
  try {
    const deletedProfit = await Profit.findByIdAndDelete(req.params.id);

    if (!deletedProfit) {
      return res.status(404).json({ error: 'Profit entry not found' });
    }

    res.status(204).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProfit,
  getAllProfits,
  getProfitById,
  updateProfit,
  deleteProfit,
  getProfitByEmployeeAndDate,
  getMonthlyProfit,
};
