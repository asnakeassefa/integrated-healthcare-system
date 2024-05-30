const mongoose = require('mongoose')

// Drug model for hospital
// Define the Drug Schema
const DrugSchema = new mongoose.Schema({
  drugName: {
    type:String,
    unique:true,
    required:true,
  },
  dose: {
    type:Number,
    required:true,
  },
  amount: {
    type:Number,
    required:true,
  },
  expireDate: {
    type: Date,
    required:true,
  },
})

// Create the User model
const Drug = mongoose.model('Drug', DrugSchema)

module.exports = Drug
