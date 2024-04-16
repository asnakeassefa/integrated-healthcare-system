const Drug = require('./model');

// Controller to add a new drug
const addDrug = async (req, res) => {
  try {
    const { drugName, amount } = req.body;
    const newDrug = new Drug({ drugName, amount });
    await newDrug.save();
    res.status(201).json(newDrug);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all drugs
const getAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a drug by its ID
const getDrugById = async (req, res) => {
  const { id } = req.params;
  try {
    const drug = await Drug.findById(id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }
    res.json(drug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDrug,
  getAllDrugs,
  getDrugById
};
