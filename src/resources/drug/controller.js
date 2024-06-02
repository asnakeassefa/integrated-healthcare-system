const e = require('cors')
const Drug = require('./model')
const DrugDispenced = require('./countModel')
// Controller to add a new drug
const addDrug = async (req, res) => {
  try {
    const { drugName, dose, amount, expireDate } = req.body

    // Check if required fields are provided
    if ((!drugName || !dose || !amount, !expireDate)) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }

    // check if drug already exists
    const drugExists = await Drug.findOne({ drugName })
    if (drugExists) {
      return res.status(400).json({ message: 'Drug already exists' })
    }

    const newDrug = new Drug({ drugName, dose, amount, expireDate })
    await newDrug.save()
    res.status(201).json(newDrug)
  } catch (error) {
    res.status(400).json({ message: 'Server error' })
  }
}

// Controller to get all drugs
const getAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.find()
    // return message and drugs
    res.json({ message: 'All drugs', drugs: drugs })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// Controller to get a drug by its ID
const getDrugById = async (req, res) => {
  const { id } = req.params
  try {
    const drug = await Drug.findById(id)
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' })
    }
    res.json(drug)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateDrug = async (req, res) => {
  const { id } = req.params
  const { amount, expireDate } = req.body
  try {
    const drug = await Drug.findOne({ _id: id })
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' })
    }
    if (amount) drug.amount = amount
    if (expireDate) drug.expireDate = expireDate
    await drug.save()
    res.json({ message: 'Drug updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteDrug = async (req, res) => {
  const { id } = req.params
  try {
    const drug = await Drug.findByIdAndDelete(id)
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' })
    }
    res.json({ message: 'Drug deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// controller to get drugs that are about to expire

const upcomingExpireDate = async (req, res) => {
  try {
    const { days } = req.params
    const drugs = await Drug.find()
    const today = new Date()
    const upcomingExpireDate = drugs.filter((drug) => {
      const expireDate = new Date(drug.expireDate)
      const timeDiff = expireDate.getTime() - today.getTime()
      const daysDiff = timeDiff / (1000 * 3600 * 24)
      return daysDiff <= days
    })
    res.json(upcomingExpireDate)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// get drugs count which is dipensed with in the last n days and sum the amount
const getDispencedDrugCount = async (req, res) => {
  try {
    const { days } = req.params
    const drugs = await DrugDispenced.find()
    const today = new Date()
    const dispencedDrugs = drugs.filter((drug) => {
      const timeDiff = today.getTime() - drug.date.getTime()
      const daysDiff = timeDiff / (1000 * 3600 * 24)
      return daysDiff <= days
    })
    const totalAmount = dispencedDrugs.reduce((acc, drug) => acc + drug.amount, 0)
    res.json({ totalAmount })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// get total drug dispenced count
const getTotalDispencedDrugCount = async (req, res) => {
  try {
    const drugs = await DrugDispenced.find()
    const totalAmount = drugs.reduce((acc, drug) => acc + drug.amount, 0)
    res.json({ totalAmount })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// get total durgs dispenced of one drug type in this month

const getTotalDispenceByName = async (req, res) => {
  try {
    const { startDate, endDate, drugName } = req.body
    if (!drugName){
      return res.status(400).send('Please provide drugName.')
    }
    if (!startDate || !endDate) {
      return res.status(400).send('Please provide both startDate and endDate.')
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send('Invalid date format.')
    }

    try {
      const result = await DrugDispenced.aggregate([
        {
          $match: {
            drugName: drugName,
            date: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
          },
        },
      ])

      const totalAmount = result.length > 0 ? result[0].totalAmount : 0
      res.json({ totalAmount })
    } catch (err) {
      console.error('Error calculating total dispensed Amoxilly:', err)
      res.status(500).send('Internal server error')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// get all drug dispenced with name and amount for n days

const getDrugsDispenced = async (req, res) => {
  try {
    const { days } = req.params
    const drugs = await DrugDispenced.find()
    const today = new Date()
    const dispencedDrugs = drugs.filter((drug) => {
      const timeDiff = today.getTime() - drug.date.getTime()
      const daysDiff = timeDiff / (1000 * 3600 * 24)
      return daysDiff <= days
    })
    res.json(dispencedDrugs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// get all drugs dispence by name with sum of amount for n days

const getDrugsDispencedByName = async (req, res) => {
  try {
    const { days } = req.params
    const drugs = await DrugDispenced.find()
    const today = new Date()
    const dispencedDrugs = drugs.filter((drug) => {
      const timeDiff = today.getTime() - drug.date.getTime()
      const daysDiff = timeDiff / (1000 * 3600 * 24)
      return daysDiff <= days
    })

    const dispencedDrugsByName = dispencedDrugs.reduce((acc, drug) => {
      if (acc[drug.drugName]) {
        acc[drug.drugName] += drug.amount
      } else {
        acc[drug.drugName] = drug.amount
      }
      return acc
    }, {})

    res.json(dispencedDrugsByName)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


module.exports = {
  addDrug,
  getAllDrugs,
  getDrugById,
  deleteDrug,
  updateDrug,
  upcomingExpireDate,
  getDispencedDrugCount,
  getTotalDispencedDrugCount,
  getTotalDispenceByName,
  getDrugsDispenced,
  getDrugsDispencedByName
}
