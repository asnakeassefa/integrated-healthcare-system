const { count } = require('console')
const mongoose = require('mongoose')

// Drug model for hospital
// Define the Drug Schema
const DrugSchema = new mongoose.Schema({
  drugName: {
    type:String,
    unique:true,
    required:true,
  },
  dose: {
    type:Number,
    required:true,
  },
  batch: {
    type:Array,
    required:true,
  },
  manufacturer: {
    type:String,
    required:true,
  },
  country: {
    type:String,
    required:true,
  },
  combination: {
    type:Boolean,
    default:true,
  },
})

// presave for the batch has to contain( batch number, expiry date, quantity)
DrugSchema.pre('save', async function(next) {
  const drug = this
  if(drug.batch.length > 0){
    drug.batch.forEach(batch => {
      if(!batch.batchNumber || !batch.expireDate || !batch.quantity){
        throw new Error('Batch has to contain batch number, expiry date and quantity')
      }
    })
  }
  next()
})
// Create the User model
const Drug = mongoose.model('Drug', DrugSchema)

module.exports = Drug
