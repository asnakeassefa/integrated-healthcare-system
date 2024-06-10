const Patient = require('./model').Patient
const LastVisit = require('../visit/model')
const PatientCount = require('./model').PatientCountModel
// register patient
const registerPatient = async (req, res) => {
  try {
    var {
      fullName,
      atrNumber,
      birthDate,
      dateEligible,
      sex,
      weight,
      severityLevel,
      phoneNumber,
      subCity,
      kebele,
      houseNumber,
      visitDate,
      nextAppointmentDate,
      supporterName,
      supporterSubcity,
      supporterWereda,
      supporterHouseNumber,
      supporterKebele,
      supporterPhone,
      previousExposure,
      patientStatus,
      sideEffect,
      concomitantDisease
    } = req.body
    // Check if the user already exists
    const existingUser = await Patient.findOne({ atrNumber })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    if (!atrNumber) {
      var pCount = await PatientCount.findOne({ name: 'PatientCount' })
      if (!pCount) {
        pCount = new PatientCount({ userCount: 0 })
        await pCount.save()
      }
      atrNumber = 'T' + (1 + pCount.userCount).toString()
    }
    if(!phoneNumber){
      return res.status(400).json({ message: 'Phone number is required' })
    }

    if(!weight){
      return res.status(400).json({ message: 'Weight is required' })
    }
    // check if the phone number is valid it is like +251930651099
    if (!phoneNumber.match(/^\+2519[0-9]{8}$/)) {
      return res.status(400).json({ message: 'Invalid phone number' })
    }

    if (!supporterPhone.match(/^\+2519[0-9]{8}$/)) {
      return res.status(400).json({ message: 'Invalid phone number' })
    }
    // Create a new user
    const newUser = new Patient({
      fullName,
      atrNumber,
      birthDate,
      dateEligible,
      sex,
      weight,
      severityLevel,
      phoneNumber,
      subCity,
      kebele,
      houseNumber,
      visitDate,
      nextAppointmentDate,
      supporterName,
      supporterSubcity,
      supporterWereda,
      supporterKebele,
      supporterHouseNumber,
      supporterPhone,
      previousExposure,
      patientStatus,
      sideEffect,
      concomitantDisease
    })

    // Save the user to the database
    await newUser.save()
    var pCount = await PatientCount.findOne({ name: 'PatientCount' })
    pCount.userCount += 1
    await pCount.save()
    res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal server error' })
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
    res.status(500).json({ message: 'Internal server error' })
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
    res.status(500).json({ message: 'Internal server error' })
  }
}

// update patient information by atrNumber
const updatePatient = async (req, res) => {
  try {
    const { atrNumber } = req.params
    const {
      fullName,
      birthDate,
      dateEligible,
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
      patientStatus,
      sideEffect,
      concomitantDisease,
    } = req.body

    const patient = await Patient.findOne({ atrNumber })
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    if(phoneNumber && !phoneNumber.match(/^\+2519[0-9]{8}$/)){
      return res.status(400).json({ message: 'Invalid phone number' })
    }

    if (!supporterPhone.match(/^\+2519[0-9]{8}$/)) {
      return res.status(400).json({ message: 'Invalid phone number' })
    }

    if (fullName) patient.fullName = fullName
    if (birthDate) patient.birthDate = birthDate
    if (dateEligible) patient.dateEligible = dateEligible
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
    if (patientStatus) patient.patientStatus = patientStatus
    if (sideEffect) patient.sideEffect = sideEffect
    if (concomitantDisease) patient.concomitantDisease = concomitantDisease

    await patient.save()

    res.status(200).json({ message: 'Patient updated successfully', patient })
  } catch (error) {
    console.error('Error updating patient:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}



module.exports = { registerPatient, getAllPatients, getPatient, updatePatient}
