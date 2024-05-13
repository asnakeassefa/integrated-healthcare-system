const Patient = require('./model').Patient
const LastVisit = require('../visit/model')
const patientCount = require('./model').PatientCountModel
// register patient
const registerPatient = async (req, res) => {
  try {
    var {
      fullName,
      atrNumber,
      birthDate,
      sex,
      severityLevel,
      phoneNumber,
      subCity,
      kebele,
      houseNumber,
      visitDate,
      nextAppointmentDate,
      supporterName,
      supporterWereda,
      supporterKebele,
      supporterPhone,
      previousExposure,
      PatientStatus,
      additionalNote,
    } = req.body
    // Check if the user already exists
    const existingUser = await Patient.findOne({ atrNumber })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    if (!atrNumber) {
      var pCount = await patientCount.findOne({ name: 'PatientCount' })
      atrNumber = 'T' + (1 + pCount.userCount).toString()
    }
    // Create a new user
    const newUser = new Patient({
      fullName,
      atrNumber,
      birthDate,
      sex,
      severityLevel,
      phoneNumber,
      subCity,
      kebele,
      houseNumber,
      visitDate,
      nextAppointmentDate,
      supporterName,
      supporterWereda,
      supporterKebele,
      supporterPhone,
      previousExposure,
      PatientStatus,
      additionalNote,
    })

    // Save the user to the database
    await newUser.save()
    var pCount = await patientCount.findOne({ name: 'PatientCount' })
    pCount.userCount += 1
    await pCount.save()
    res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// getAllPatients

const getAllPatients = async (req, res) => {
  try {
    // Fetch all patients from the database and add lastvisit date
    const patients = await Patient.find()

    res.status(200).json({ patients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// getPatient
const getPatient = async (req, res) => {
  try {
    const { atrId } = req.params
    // Find the patient by ID
    const patient = await Patient.findOne({ atrNumber: atrId })
    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }
    res.status(200).json({ patient })
  } catch (error) {
    console.error('Error fetching patient:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// update patient information by atrNumber
const updatePatient = async (req, res) => {
  try {
    const { atrNumber } = req.params
    const {
      fullName,
      birthDate,
      severityLevel,
      phoneNumber,
      subCity,
      kebele,
      houseNumber,
      visitDate,
      nextAppointmentDate,
      supporterName,
      supporterWereda,
      supporterKebele,
      supporterPhone,
      previousExposure,
      PatientStatus,
      additionalNote,
    } = req.body

    const patient = await Patient.findOne({ atrNumber })
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }
    if (fullName) patient.fullName = fullName
    if (birthDate) patient.birthDate = birthDate
    if (severityLevel) patient.severityLevel = severityLevel
    if (phoneNumber) patient.phoneNumber = phoneNumber
    if (subCity) patient.subCity = subCity
    if (kebele) patient.kebele = kebele
    if (houseNumber) patient.houseNumber = houseNumber
    if (visitDate) patient.visitDate = visitDate
    if (nextAppointmentDate) patient.nextAppointmentDate = nextAppointmentDate
    if (supporterName) patient.supporterName = supporterName
    if (supporterWereda) patient.supporterWereda = supporterWereda
    if (supporterKebele) patient.supporterKebele = supporterKebele
    if (supporterPhone) patient.supporterPhone = supporterPhone
    if (previousExposure) patient.previousExposure = previousExposure
    if (PatientStatus) patient.PatientStatus = PatientStatus
    if (additionalNote) patient.additionalNote = additionalNote

    await patient.save()

    res.status(200).json({ message: 'Patient updated successfully', patient })
  } catch (error) {
    console.error('Error updating patient:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}



module.exports = { registerPatient, getAllPatients, getPatient, updatePatient}
