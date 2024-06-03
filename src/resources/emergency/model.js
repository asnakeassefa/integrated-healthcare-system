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
