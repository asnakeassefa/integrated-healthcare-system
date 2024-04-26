const mongoose = require('mongoose')
// Define the Staff Schema
const PharmacySchema = new mongoose.Schema({
  order:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Order',
    required:true,
  },
  pharmacist:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  quantity:{
    type:Number,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },

  // I want created at and updated at property here
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the Staff model
const Pharmacy = mongoose.model('Pharmacy', PharmacySchema)

module.exports = Pharmacy
