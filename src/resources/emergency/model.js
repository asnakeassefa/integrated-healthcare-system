const mongoose = require('mongoose')
const User = require('../user/model')
// Define the User Schema
const EmergencyPatientSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  fullName: {
    type: String,
    required: true,
  },
  patientRegularHospital:{
    type:String,
    required:true,
  },
  cardNumber:{
    type:String,
    required:true,
  },
  drugs:{
    type:Array,
    require:true,
  },
  visitDate:{
    type:Date,
    required:true,
  },
})

// Create the User model
const EmergencyPatient = mongoose.model('EmergencyPatient', EmergencyPatientSchema)
module.exports = EmergencyPatient
