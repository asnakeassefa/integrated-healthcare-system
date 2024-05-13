const EmergencyPatient = require('./model')
// register patient
const registerEmergencyPatient = async (req, res) => {
  try {
    var {
      fullName,
      patientRegularHospital,
      cardNumber,
      drug,
    } = req.body
    // Create a new user
    const newPatient = new EmergencyPatient({
      fullName,
      patientRegularHospital,
      cardNumber,
      drug,
    })

    // Save the user to the database
    await newPatient.save()
    res.status(201).json({ message: 'Emergency request completed', user: newPatient })
  } catch (error) {
    console.error('Error registering Patient:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// getall Emergency Patients

const getAllEmergencyPatients = async (req, res) => {
  try {
    // Fetch all patients from the database and add lastvisit date
    const emergency = await EmergencyPatient.find()

    res.status(200).json({ emergency })
  } catch (error) {
    console.error('Error fetching patients:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


module.exports = { registerEmergencyPatient, getAllEmergencyPatients}
