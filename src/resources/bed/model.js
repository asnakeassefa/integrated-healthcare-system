const mongoose = require('mongoose')
// Define the Staff Schema
const BedSchema = new mongoose.Schema({
  room:{
    type:String,
    require:true,
  },
  bedNumber:{
    type:String,
    default:false,
  },
})


// Create the Staff model
const Bed = mongoose.model('Bed', BedSchema)

module.exports = Bed
