const mongoose = require('mongoose')
// Define the User Schema
const EmergencyPatientSchema = new mongoose.Schema({
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
  drug:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Drug',
    require:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the User model
const EmergencyPatient = mongoose.model('EmergencyPatient', EmergencyPatientSchema)
module.exports = EmergencyPatient
