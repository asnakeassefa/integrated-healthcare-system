import mongoose, { Schema } from 'mongoose'
import UserInterface from './interface'

// Define the User Schema
const UserSchema = new Schema({
  userId:{
    type:String,
    required:true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  sex:{
    type:String,
    required:true,
  },
  weight:{
    type:Number,
    required:true,
  },
  otherTritment:{
    type:Array,
    required:true,
  },
  iskid:{
    type:Boolean,
    required:true,
  },
})

// Create the User model
const User = mongoose.model<UserInterface>('User', UserSchema)

export default User
