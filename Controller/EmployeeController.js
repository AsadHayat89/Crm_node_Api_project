const { request } = require('express');
const Employee = require('../Model/Employee');
const fs = require('fs');
const path = require('path');

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    // Check if an employee with the provided CNIC already exists
    console.log("image");
    var image = req.file;
    var outputDirectory = directryPath();
    console.log("image2");
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
        Employee.findOne({ cnic: req.body.cnic }).then(
          existingEmployee => {
            if (existingEmployee) {
              return res.status(400).json({ status:"error",error: 'Employee with the provided CNIC already exists' });
            }

            // If no employee with the CNIC exists, create a new employee
            const employee = new Employee(req.body);
            employee.save().then(
              result => {
                if (result) {
                  res.status(200).json({status:"success",responce:result});
                }
                else {
                  res.status(200).json({status:"error", error: "Data not saved" });
                }

              }
            );

          }
        );
      }
    );


  } catch (err) {
    res.status(400).json({status:"error", error: err.message });
  }
};

const directryPath = () => {
  const outputDirectory = path.join(__dirname, '../images/EmployeeImage');
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

// Get a list of all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({status:"success",responce:employees});
  } catch (err) {
    res.status(400).json({status:"error", error: err.message });
  }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
  try {

    const employee = await Employee.findOne({ cnic: req.body.cnic });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ status: "error", error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ status: "error", error: 'Employee not found' });
    }
    res.status(200).json({ status: "success",responce:'success' });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
