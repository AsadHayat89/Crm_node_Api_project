const Deal = require('../Model/Deal');
const fs = require('fs');
const Profit=require('../Model/Profit');
const path = require('path');
// Create a new deal
const createDeal = async (req, res) => {
  try {
   
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
        const deal = new Deal(req.body);
        const newDeal = deal.save().then(
          result=>{
              if(result){
                
                const profitbody={
                  totalEarning:req.body.actualPrice,
                  employeeCnic:req.body.employeeId,
                  employeeBonus: req.body.employeeProfit,
                  companyProfit:req.body.companyProfit
                };

                const profit = new Profit(profitbody);
                const newProfit =  profit.save().then(
                  result=>{
                    if(result){
                      res.status(200).json({status:"success",responce:deal});

                    }
                  }
                );
                

                
              }
              else{
                res.status(400).json({status:"error",error:"Data inserted failed"});
              }
          }
        );
            
      }
    );
   
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const directryPath = () => {
  const outputDirectory = path.join(__dirname, '../images/Deal');
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

// Get a list of all deals
const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.status(200).json({status:"success",responce:deals});
  } catch (err) {
    res.status(500).json({status:"error", error: err.message });
  }
};

// Get a single deal by ID
const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.status(200).json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a deal by ID
const updateDeal = async (req, res) => {
  try {
    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedDeal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.status(200).json(updatedDeal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a deal by ID
const deleteDeal = async (req, res) => {
  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);

    if (!deletedDeal) {
      return res.status(404).json({ status: "error", error: 'Deal not found' });
    }

    res.status(200).json({ status: "success",responce:'success' });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
};
