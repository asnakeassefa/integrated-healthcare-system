// add visitHistory
const User = require('../user/model')
const Patient = require('../atrPatient/model')
const Drug = require('../drug/model')
const Visit = require('./model')
const LastVisit = require('../visit/model')

// Controller function to create a visit history
const createVisit = async (req, res) => {
  try {
    const { userId, patientId, drugId, otherDrug, pillNumber, visitDate } = req.body
    // Check if required fields are provided
    if (!userId || !patientId || !drugId || !pillNumber || !visitDate) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }

    // Find the user by userId
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Find the patient by patientId
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    // Find the drug by drugId
    const drug = await Drug.findById(drugId)
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found.' })
    }
    const nextVisitDate = new Date(visitDate)
    nextVisitDate.setDate(nextVisitDate.getDate() + 30)

    const visit = new Visit({
      user: user._id,
      patient: patient._id,
      drug: drug._id,
      otherDrug: otherDrug,
      pillNumber: pillNumber,
      visitDate: visitDate,
      nextAppointmentDate: nextVisitDate,
    })

    patient.visitDate = visitDate
    patient.nextAppointmentDate = nextVisitDate
    await patient.save()
    await visit.save()
    // update the visitData and nextAppointmentData
    return res.status(201).json({ message: 'Visit history created successfully.', visit: visit })
  } catch (error) {
    console.error('Error creating visit:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get all visitHistory

const getVisits = async (req, res) => {
  try {
    const visits = await Visit.find().populate('user').populate('patient').populate('drug')
    return res.status(200).json({ visits })
  } catch (error) {
    console.error('Error getting visits:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get visit history by patientId

const getVisitHistoriesByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params
    const visitHistories = await Visit.find({ patient: patientId })
      .populate('user')
      .populate('patient')
      .populate('drug')
    return res.status(200).json({ visitHistories })
  } catch (error) {
    console.error('Error getting visit histories:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get upcoming appointments within the next 2 days
const getUpcomingAppointments = async (req, res) => {
  try {
    // get data from user
    const { days } = req.params
    const today = new Date()
    const twoDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + parseInt(days))
    const patients = await Patient.find({
      nextAppointmentDate: { $gte: today, $lt: twoDaysLater },
    })
    res.status(200).json({ patients })
  } catch (error) {
    console.error('Error geting patients data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createVisit, getVisits, getVisitHistoriesByPatientId, getUpcomingAppointments }
