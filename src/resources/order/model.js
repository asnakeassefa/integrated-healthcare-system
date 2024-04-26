const mongoose = require('mongoose')
// Define the Staff Schema
const OrderSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Patient',
    required:true,
  },
  drug:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Drug',
    require:true,
  },
  completed:{
    type:Boolean,
    default:false,
  },

  // I want created at and updated at property here
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the Staff model
const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
