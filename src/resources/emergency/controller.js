const EmergencyPatient = require('./model')
const Drug = require('../drug/model')
const DispencedDrug = require('../drug/countModel')
const User = require('../user/model')
// register patient
const registerEmergencyPatient = async (req, res) => {
  try {
    var {
      fullName,
      patientRegularHospital,
      cardNumber,
      visitDate,
      drugs,
    } = req.body

    if (!fullName || !patientRegularHospital || !cardNumber || !visitDate || !drugs) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    // Find the user by userId
    const user = await User.findOne({ _id: req.userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    // Find the drug by drugId
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
        return res.status(404).json({ message: "only "+ drugAmount + " drugs is available" })
      }
      if (!drug) {
        return res.status(404).json({ message: 'Drug not found.' })
      }
    }
    // Create a new user
    const newPatient = new EmergencyPatient({
      user: user._id,
      fullName,
      patientRegularHospital,
      cardNumber,
      visitDate,
      drugs,
    })

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
    // Save the user to the database
    await newPatient.save()
    
    res.status(201).json({ message: 'Emergency request completed', user: newPatient })
  } catch (error) {
    console.error('Error registering Patient:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// getall Emergency Patients

const getAllEmergencyPatients = async (req, res) => {
  try {
    // Fetch all patients from the database and add lastvisit date
    
    const emergency = await EmergencyPatient.find()
    // only populate user name
    .populate('user','name')
    // const user = new User.findById(emergency.user)
    res.status(200).json({ emergency })
  } catch (error) {
    console.error('Error fetching patients:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


module.exports = { registerEmergencyPatient, getAllEmergencyPatients}
