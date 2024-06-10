// add visitHistory
const User = require('../user/model')
const Patient = require('../atrPatient/model').Patient
const Drug = require('../drug/model')
const Visit = require('./model')
const DispencedDrug = require('../drug/countModel')

// Controller function to create a visit history
const createVisit = async (req, res) => {
  try {
    const { patientId, drugs, dosage,otherDrug, pillNumber,visitDate,remark,daysBeforeNextVisit,reason,inout,serviceDelivery} = req.body
    // Check if required fields are provided
    if (!patientId || !drugs || !visitDate) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }

    // Find the user by userId

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Find the patient by patientId
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    if (!drugs) {
      return res.status(404).json({ message: 'Drugs not found.' })
    }
    // find sum of the drugs from all the batchs and compare with the amount
    for (let i = 0; i < drugs.length; i++) {
      const drug = await Drug.findById(drugs[i]._id)
      if(!drug.batch || drug.batch.length == 0){
        return res.status(404).json({ message: 'drug is not available' })
      }
      var drugAmount = 0
      for(let j=0;j<drug.batch.length;j++){
        drugAmount += drug.batch[j].quantity
      }
      if(drugAmount < drugs[i].amount){
        return res.status(404).json({ message: "only"+ drugAmount + "drugs is available" })
      }
      if (!drug) {
        return res.status(404).json({ message: 'Drug not found.' })
      }
    }
    const today = new Date(visitDate)
    const nextVisitDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + parseInt(daysBeforeNextVisit))
    var ontime = true
    if(patient.visitDate && patient.nextAppointmentDate.toString() != today.toString()){
      ontime = false
    }

    const visit = new Visit({
      user: user._id,
      patient: patient._id,
      drugs: drugs,
      dosage: dosage,
      otherDrug: otherDrug,
      pillNumber: pillNumber,
      visitDate: visitDate,
      nextAppointmentDate: nextVisitDate,
      remarks: remark,
      reason: reason,
      inout: inout,
      onTime: ontime,
      serviceDelivery: serviceDelivery,
    })
    if(patient.visitDate && patient.visitDate.toString() != today.toString()){
      patient.visitDate = visitDate
    }else if(patient.visitDate && patient.visitDate.toString() == today.toString()){
      return res.status(404).json({ message: 'Patient already visited' })
    }

    patient.nextAppointmentDate = nextVisitDate
    for (let i = 0; i < drugs.length; i++) {
      const drug = await Drug.findById(drugs[i]._id)
      if(!drug){
        return res.status(404).json({ message: 'Drug not found.' })
      }
      // get least expiry date from the bach and update the drug
      if(!drug.batch || drug.batch.length == 0){
        return res.status(404).json({ message: 'drug is not available' })
      }
      const batch = drug.batch
      if (batch.length == 0) {
        return res.status(404).json({ message: 'drug is not available' })
      }
      if(!batch[0].expireDate){
        return res.status(404).json({ message: 'drug is not available' })
      }
      let minDate = new Date(batch[0].expireDate)
      for (let j = 1; j < batch.length; j++) {
        const date = new Date(batch[j].expireDate)
        if (date < minDate && batch[j].quantity > drugs[i].amount) {
          minDate = date
        }
      }
      // then update the drug inside the batch
      var newBatch = []
      drug.batch.forEach((batch) => {
        const batchDate = new Date(batch.expireDate)
        if (batchDate.toString() == minDate.toString()) {
          if(batch.quantity < drugs[i].amount){
            return res.status(404).json({ message: 'drug is not available' })
          }
          newBatch.push({ ...batch, quantity: batch.quantity - drugs[i].amount })
        } else{
          newBatch.push(batch)
        }
      })
      const dispenceDrug = new DispencedDrug({
        drugName: drug.drugName,
        amount: drugs[i].amount,
        date: visitDate,
      })
      await dispenceDrug.save()
      drug.batch = newBatch
      await drug.save()
    }
    await patient.save()
    // console.log('drugs:', drugs)
    // console.log('visit:', visit)
    
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
    const visits = await Visit.find().populate('user').populate('patient').populate('drugs')
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
      .populate('drugs')
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
    const daysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + parseInt(days))
    const patients = await Patient.find({
      nextAppointmentDate: { $gte: today, $lt: daysLater },
    })
    res.status(200).json({ patients })
  } catch (error) {
    console.error('Error geting patients data:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// get passed appointments
const getPassedAppointments = async (req, res) => {
  try {
    const today = new Date()
    const patients = await Patient.find({
      nextAppointmentDate: { $lt: today },
    })
    res.status(200).json({ patients })
  } catch (error) {
    console.error('Error geting patients data:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}



module.exports = { createVisit, getVisits, getVisitHistoriesByPatientId, getUpcomingAppointments, getPassedAppointments}
