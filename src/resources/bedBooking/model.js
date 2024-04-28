const mongoose = require('mongoose')
// Define the Staff Schema
const BookBedSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the Staff model
const BookBed = mongoose.model('BookBed', BookBedSchema)

module.exports = BookBed
