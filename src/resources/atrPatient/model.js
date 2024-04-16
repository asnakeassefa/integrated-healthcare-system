const mongoose = require('mongoose')
// Define the User Schema
const PatientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  atrNumber: {
    type: String,
    unique: true,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  sex:{
    type: String,
    required: true,
  },
  phoneNumber:{
    type:String,
    required:true,
  },
  subCity:{
    type:String,
    required:true
  },
  kebele:{
    type:String,
    required:true,
  },
  houseNumber:{
    type:String,
    required:true,
  },
  
})

// Create the User model
const Patient = mongoose.model('Patient', PatientSchema)

module.exports = Patient
