// controllers/expenseController.js
const Expense = require('../Model/Expenses');

// Create Expense
exports.createExpense = async (req, res) => {
    try {
        console.log("reach here");
        const expense = new Expense(req.body);
        const result = await expense.save();
        res.json({status:'success',responce:result});
    } catch (err) {
        console.log('err '+err);
        res.status(500).json({ status:'error', error: err.message });
    }
};

// Get total expenses for the current month
exports.getTotalExpensesForCurrentMonth = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

        const totalExpenses = await Expense.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $toDouble: "$expenseAmount" // Convert string to double
                        }
                    }
                }
            }
        ]);

        if (totalExpenses.length > 0) {
            res.json({ status: "success",responce:totalExpenses[0].total });
        } else {
            res.json({status: "success",responce:{ totalExpenses: 0} });
        }
    } catch (err) {
        res.status(500).json({status: "error",error: err.message });
    }
};


// Get all Expenses
exports.getAllExpenses = async (req, res) => {
    try {
        console.log("asdf");
        const expenses = await Expense.find();
        res.json({status: "success",responce:expenses});
    } catch (err) {
        res.status(500).json({ status: "success",error: err.message });
    }
};

// Get a specific Expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an Expense by ID
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an Expense by ID
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
