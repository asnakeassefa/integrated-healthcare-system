import mongoose, { Schema } from 'mongoose'
import StaffInterface from './interface'

// Define the Staff Schema
const StaffSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    require:true,
  }
})

// Create the Staff model
const Staff = mongoose.model<StaffInterface>('Staff', StaffSchema)

export default Staff
