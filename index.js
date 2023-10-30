const express = require('express');
const router = express();
const mongoose = require("mongoose");
var multer = require('multer');
const path = require('path');


const AuthController=require('./Controller/AuthController');
const employeeController=require('./Controller/EmployeeController');
const customerController=require('./Controller/CutomerController');
const profitController=require('./Controller/ProfitController');
const DealController=require('./Controller/DealController');
const expenseController=require('./Controller/ExpensesController');

mongoose.connect("mongodb+srv://Asad:Asad123@cluster0.nfme4lh.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true , family: 4})
.then(() => {
  console.log('Connected to MongoDB');
  // Additional code here if needed
})
.catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
});

router.get('/',(req,res)=>{
    res.send("Ok");
});

router.use('/images', express.static(path.join(__dirname, 'images/')));


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      files: 2, // maximum 5 files
    },
  });



// User Credientials
router.post('/api/signup', upload.array(), AuthController.SignUP);

router.post('/api/login', upload.array(), AuthController.Login);

router.get('/api/profile', AuthController.Profile);

router.post('/api/GetUserByMail',upload.any(), AuthController.GetUserByEmail);


// Ewmployee Credientials
router.post('/api/Addemployee', upload.single("image"), employeeController.createEmployee);

router.get('/api/employees',upload.any(), employeeController.getAllEmployees);

router.get('/api/getEmployeeById', upload.any(), employeeController.getEmployeeById);

router.put('/api/employee/:id', upload.any(),employeeController.updateEmployee);

router.delete('/api/employee/:id', employeeController.deleteEmployee);


// Cutomer Credientials
router.post('/api/Addcutomer', upload.single("image"), customerController.createCustomer);

router.get('/api/Customer',upload.any(), customerController.getAllCustomers);

router.get('/api/getCustomerById', upload.any(), customerController.getCustomerByCNIC);

router.put('/api/Customer/:id', upload.any(),customerController.updateCustomer);

router.delete('/api/Customer/:id', customerController.deleteCustomer);



// Routes for Profit CRUD operations
router.post('/api/AddProfit', upload.any(), profitController.createProfit);

router.get('/api/Profit', profitController.getAllProfits);

router.get('/:id', profitController.getProfitById);

router.put('/:id', profitController.updateProfit);

router.delete('/:id', profitController.deleteProfit);

router.get('/api/getMonthlyProfit',profitController.getMonthlyProfit);

router.post('/api/getEmployeeBounusTotal',upload.any(),profitController.getProfitByEmployeeAndDate);


router.post('/api/expenses',upload.any(), expenseController.createExpense);

router.get('/api/expenses/total/current-month', expenseController.getTotalExpensesForCurrentMonth);

router.get('/api/expenses', expenseController.getAllExpenses);
router.get('/expenses/:id', expenseController.getExpenseById);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);



router.post('/api/deals',upload.single("image"), DealController.createDeal);

// Get a list of all Deals
router.get('/api/deals', DealController.getAllDeals);

// Get a single Deal by ID
router.get('/api/deals/:id', DealController.getDealById);

// Update a Deal by ID
router.put('/api/deals/:id', DealController.updateDeal);

// Delete a Deal by ID
router.delete('/api/deals/:id', DealController.deleteDeal);


const port = process.env.PORT || 3000;

router.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
