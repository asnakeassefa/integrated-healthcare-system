const mongoose = require('mongoose')
const User = require('../user/model')
const Patient = require('../atrPatient/model')
const Drug = require('../drug/model')
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
  drug:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Drug',
    require:true,
  },
  otherDrug:{
    type:Array,
  },
  pillNumber:{
    type:Number,
    required:true,
  },
  visitDate:{
    type:Date,
    required:true,
  },
  nextAppointmentDate:{
    type:Date,
    required:true,
  },
})

// Create the Staff model
const Visit = mongoose.model('Visit', VisitSchema)

module.exports = Visit