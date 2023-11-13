// controllers/expenseController.js
const Expense = require('../Model/Expenses');

// Create Expense
exports.createExpense = async (req, res) => {
    try {
        if(req.file){
            var image = req.file;
            var outputDirectory = directryPath();
            new Promise((resolve, reject) => {
              const ImageName = convertImage(image.originalname);
              const imagePath = path.join(outputDirectory, ImageName);
        
              fs.writeFileSync(imagePath, image.buffer, function (err) {
                reject(err)
              });
        
              resolve(ImageName)
            }).then(
              ImageName => {
                req.body.image = ImageName;
                const expense = new Expense(req.body);
                const result =  expense.save().then(
                  result=>{
                      if(result){
                        res.status(200).json({status:"success",responce:result});
                    
                        
                      }
                      else{
                        res.status(400).json({status:"error",error:"Data inserted failed"});
                      }
                  }
                );
                    
              }
            );
        }
        else{
            console.log("1");
            res.body.image="";
            console.log("2");
            const expense = new Expense(req.body);
            console.log("3");
            const result = await expense.save().then(res=>{
                if(res){
                    res.json({status:'success',responce:result});
                }
                else{
                    res.json({status:'faile',responce:result});
                }
            })
            
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ status:'error', error: err.message });
    }
};

const directryPath = () => {
    const outputDirectory = path.join(__dirname, '../images/Expenses');
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }
  
    return outputDirectory;
  }
  
  const convertImage = (OriginalImage) => {
    console.log("Image data: " + OriginalImage);
    var fil = OriginalImage.split('.')
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/:/g, '-');
    fil[0] += "-" + formattedDate;
    return fil[0] + '.' + fil[1];
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
