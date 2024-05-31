const mongoose = require('mongoose')
const User = require('../user/model')
const Patient = require('../atrPatient/model')
const Drug = require('../drug/model')
const { type } = require('os')
// Define the Staff Schema
const VisitSchema = new mongoose.Schema({
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
  drugs:{
    type:Array,
    require:true,
  },
  otherDrug:{
    type:Array,
  },
  visitDate:{
    type:Date,
    required:true,
  },
  reason:{
    type:String,
    required:true,
    enum:['start','refill','switch'],
  },
  inout:{
    type:String,
    required:true,
    enum:['start','refill'],
  },
  serviceDelivery:{
    type:String,
  },
  onTime:{
    type:Boolean,
    required:true,
    default:true,
  },
  nextAppointmentDate:{
    type:Date,
    required:true,
  },
  remarks:{
    type:String,
  },

})

// Create the Staff model
const Visit = mongoose.model('Visit', VisitSchema)

module.exports = Visit