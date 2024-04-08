import mongoose, { Schema } from 'mongoose'
import RoleInterface from './interface'

// Define the Staff Schema
const RoleSchema = new Schema({
  roleId:{
    type:String,
    required:true,
  },
  roleName:{
    type:String,
    reqired:true,
  },
})

// Create the Staff model
const Role = mongoose.model<RoleInterface>('Role', RoleSchema)

export default Role
