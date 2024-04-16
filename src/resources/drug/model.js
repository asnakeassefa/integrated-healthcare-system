const mongoose = require('mongoose')

// Drug model for hospital
// Define the Drug Schema
const DrugSchema = new mongoose.Schema({
  drugName: {
    type:String,
    unique:true,
    required:true,
  },
  amount: {
    type:Number,
    required:true,
  },
})

// Create the User model
const User = mongoose.model('User', UserSchema)

module.exports = User
