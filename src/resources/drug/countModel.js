const mongoose = require('mongoose')

// Drug model for hospital
// Define the Drug Schema
const DispencedDrug = new mongoose.Schema({
  drugName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
})

// Create the User model
const Dispenced = mongoose.model('DispencedDrug', DispencedDrug)

module.exports = Dispenced
