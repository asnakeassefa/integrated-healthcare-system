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
    // Create the visit with the user, patient, and drug
    // Save the visit to the database
    // check if patient had visit history
    // const visitedPatient = await LastVisit.findOne({ Patient: patient })
    
    // if (visitedPatient) {
    //   console.log('patient has visited so update')
      
    //   if (visitedPatient.nextAppointmentDate < visitDate) {
    //     visit.onTime = false
    //   }
    //   const lastVisit = await LastVisit.findOneAndUpdate(
    //     { Patient: patient },
    //     { visitDate: visitDate, nextAppointmentData: nextVisitDate },
    //     { new: true },
    //   )
    // } else {
    //   console.log('patient has not visited so create')
    //   const lastVisit = await LastVisit({
    //     Patient: patient,
    //     visitDate: visitDate,
    //     nextAppointmentDate: nextVisitDate,
    //   })
      
    //   // here in visit
    //   await lastVisit.save()
    //   console.log('last visit:', lastVisit)
    // }

    patient.visitDate = visitDate
    patient.nextAppointmentDate = nextVisitDate
    await patient.save();
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
    const visits = await Visit.find()
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
    return res.status(200).json({ visitHistories })
  } catch (error) {
    console.error('Error getting visit histories:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = { createVisit, getVisits, getVisitHistoriesByPatientId }
