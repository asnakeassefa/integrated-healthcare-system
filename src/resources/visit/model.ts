import mongoose, { Schema } from 'mongoose'
import User from '../users/model'
import Staff from '../staff/model'
import VisitInterface from './interface'


// Define the Staff Schema
const VisitSchema = new Schema({
  visitId: {
    type:String,
    required:true,
  },
  user:{
    type:User,
    require:true,
  },
  staff:{
    type:Staff,
    required:true,
  },
  visitDate:{
    type:Date,
    required:true,
  },
  appointment_date:{
    type:Date,
    required:true,
  },
})

// Create the Staff model
const Visit = mongoose.model<VisitInterface>('Visit', VisitSchema)

export default Visit
