const Customer = require('../Model/Customer');
const fs = require('fs');
const path = require('path');

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    // Check if a customer with the provided CNIC already exists
   
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
        Customer.findOne({ cnic: req.body.cnic }).then(
          existingEmployee => {
            if (existingEmployee) {
              return res.status(400).json({status:"error", error: 'Cutomer with the provided CNIC already exists' });
            }

            // If no employee with the CNIC exists, create a new employee
            const employee = new Customer(req.body);
            employee.save().then(
              result => {
                res.status(200).json({status:"success",responce:result});
                

              }
            );

          }
        );
      }
    );
   
   
   
   
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const directryPath = () => {
    const outputDirectory = path.join(__dirname, '../images/CustomerImages');
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
  
// Get a list of all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({status:"success",responce:customers});
  } catch (err) {
    res.status(500).json({status:"error", error: err.message });
  }
};

// Get a single customer by CNIC
const getCustomerByCNIC = async (req, res) => {
  try {
    const cnic = req.body.cnic; // Assuming you pass CNIC as a parameter
    const customer = await Customer.findOne({ cnic });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a customer by CNIC
const updateCustomer = async (req, res) => {
  try {
    const cnic = req.params.cnic; // Assuming you pass CNIC as a parameter
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a customer by CNIC
const deleteCustomer = async (req, res) => {
  try {
    const cnic = req.params.id; // Assuming you pass CNIC as a parameter
    console.log("data we recived: "+req.params.id);
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ status: "error",error: 'Customer not found' });
    }

    res.status(200).json({ status: "success",responce:'success' });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerByCNIC,
  updateCustomer,
  deleteCustomer,
};
