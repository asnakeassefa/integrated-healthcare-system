const atrPatients = require('../atrPatient/model')

const getNumberOfPatients = async (req, res) => {
  try {
    const totalPatients = await atrPatients.countDocuments({}) // Count all documents
    res.json({ message: 'Total number of patients:', totalPatients })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching patient count' })
  }
}

const getNumberOfMenAndWomen = async (req, res) => {
  try {
    const [menCount, womenCount] = await Promise.all([
      atrPatients.countDocuments({ sex: 'Male' }),
      atrPatients.countDocuments({ sex: 'Female' }),
    ])
    res.json({ message: 'Number of male and female patients:', men: menCount, women: womenCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching patient counts by sex' })
  }
}

const getSeverePatients = async (req, res) => {
  try {
    // find severePatients using the 'severeLevel' which can be between 0 to 3
    const severePatients = await atrPatients.find({ severeLevel: { $gte: 2 } })
    res.json({ message: 'List of patients with severe condition:', patients: severePatients })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching patients with severe condition' })
  }
}

const getNewRegistrationsThisMonth = async (req, res) => {
  try {
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    const newRegistrations = await atrPatients.find({
      createdAt: { $gte: thisMonth, $lt: nextMonth },
    })
    res.json({ message: 'New registrations this month:', patients: newRegistrations })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching new registrations (this month)' })
  }
}

const getNewRegistrationsThisYear = async (req, res) => {
  try {
    const today = new Date()
    const thisYearStart = new Date(today.getFullYear(), 0, 1) // Set to January 1st of the current year

    const newRegistrations = await atrPatients.find({
      createdAt: { $gte: thisYearStart }, // Only specify the starting point of the year
    })
    res.json({ message: 'New registrations this year:', patients: newRegistrations })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching new registrations (this year)' })
  }
}

const getNewRegistrationsBySex = async (req, res) => {
  try {
    const { sex } = req.params // Assuming sex is passed as a URL parameter

    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const newRegistrations = await atrPatients.find({
      sex,
      createdAt: { $gte: thisMonth },
    })
    res.json({ message: `New registrations of sex '${sex}' this month:`, patients: newRegistrations })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching new registrations by sex' })
  }
}

const getPatientsByAge = async (req, res) => {
  try {
    const { minAge, maxAge } = req.params // Assuming minAge and maxAge are passed as URL parameters

    const today = new Date()
    const minBirthDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate())
    const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())

    const patientsByAge = await atrPatients.find({
      birthDate: { $gte: minBirthDate, $lt: maxBirthDate },
    })
    res.json({ message: `Patients between ${minAge} and ${maxAge} years old:`, patients: patientsByAge })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching patients by age' })
  }
}

module.exports = {
  getNumberOfPatients,
  getNumberOfMenAndWomen,
  getSeverePatients,
  getNewRegistrationsThisMonth,
  getNewRegistrationsThisYear,
  getNewRegistrationsBySex,
  getPatientsByAge,
}
