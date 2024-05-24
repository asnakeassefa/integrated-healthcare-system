const mongoose = require('mongoose')
const LastVisit = require('../visit/model')
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
  dateEligible: {
    type:Date,
  },
  sex: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
  },
  severityLevel: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  subCity: {
    type: String,
    required: true,
  },
  kebele: {
    type: String,
    required: true,
  },
  houseNumber: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
    default: null,
  },
  nextAppointmentDate: {
    type: Date,
    default: null,
  },
  supporterName: {
    type: String,
    default: null,
  },
  supporterWereda: {
    type: String,
    default: null,
  },
  supporterKebele: {
    type: String,
    default: null,
  },
  supporterHouseNumber: {
    type: String,
    default: null,
  },
  supporterPhone: {
    type: String,
    default: null,
  },
  previousExposure: {
    type: String,
    default: null,
  },
  patientStatus: {
    type: String,
    default: null,
  },
  sideEffect: {
    type: String,
    default: null,
  },
  concomitantDisease: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const PatientCount = new mongoose.Schema({
  name: {
    type: String,
    default: 'PatientCount',
  },
  userCount: {
    type: Number,
    initial: 0,
    required: true,
  },
})

// Create the User model
const Patient = mongoose.model('Patient', PatientSchema)
const PatientCountModel = mongoose.model('PatientCount', PatientCount)
module.exports = { Patient, PatientCountModel }
