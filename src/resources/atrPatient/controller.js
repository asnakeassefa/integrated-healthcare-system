const Patient = require('./model')
const LastVisit = require('../visit/model')
// register patient
const registerPatient = async (req, res) => {
  try {
    const { fullName, atrNumber, birthDate, sex,severityLevel, phoneNumber, subCity, kebele, houseNumber,visitDate,nextAppointmentDate } = req.body

    // Check if the user already exists
    const existingUser = await Patient.findOne({ atrNumber })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
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
    })

    // Save the user to the database
    await newUser.save()

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

    // const lastVisit = await LastVisit.findOne({ Patient: patient._id })
    // // console.log('last visit:', lastVisit.visitDate, lastVisit.nextAppointmentDate)
    // var visitDate = null
    // var nextAppointmentDate = null
    // if (lastVisit) {
    //   visitDate = lastVisit.visitDate
    //   nextAppointmentDate = lastVisit.nextAppointmentDate
    // }

    // If patient found, return it
    res.status(200).json({ patient})
  } catch (error) {
    console.error('Error fetching patient:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
module.exports = { registerPatient, getAllPatients, getPatient }
