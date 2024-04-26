// add visitHistory
const LastVisit = require('./model')

// update LastVisit data to include visitHistory
const updateLastVisit = async (req, res) => {
  try {
    const { PatientId, visitDate } = req.body

    // Check if required fields are provided
    if (!PatientId || !visitDate) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }
    const nextVisitDate = new Date(visitDate)
    nextVisitDate.setDate(nextVisitDate.getDate() + 30)
    // update the visitData and nextAppointmentData
    const lastVisit = LastVisit.findOneAndUpdate(
      { Patient: PatientId },
      { visitDate: visitDate, nextAppointmentData: nextVisitDate },
      { new: true },
    )

    return res.status(201).json({ message: 'LastVisit added successfully.', lastVisit: lastVisit })
  } catch (error) {
    console.error('Error adding LastVisit:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

//get all visits

const getVisits = async (req, res) => {
  try {
    const visits = await LastVisit.find()
    return res.status(200).json({ visits })
  } catch (error) {
    console.error('Error fetching visits:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// get patient visit

const getPatientVisit = async (req, res) => {
  try {
    const { PatientId } = req.params

    // Find the patient by ID
    const patient = await LastVisit.find({ Patient: PatientId })

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }
    return res.status(200).json({ patient })
  } catch (error) {
    console.error('Error fetching patients:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
// get all user who passed there appointment date

const getPassedAppointment = async (req, res) => {
  try {
    const currentDate = new Date()
    const users = await LastVisit.find({ nextAppointmentData: { $lt: currentDate } })

    return res.status(200).json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
// get all patient visit

module.exports = {
  updateLastVisit,
  getVisits,
  getPatientVisit,
  getPassedAppointment,
}
