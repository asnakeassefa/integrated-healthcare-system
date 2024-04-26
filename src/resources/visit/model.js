const mongoose = require('mongoose')
// Define the Staff Schema
const LastVisitSchema = new mongoose.Schema({
  Patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Patient',
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
const LastVisit = mongoose.model('LastVisit', LastVisitSchema)

module.exports = LastVisit