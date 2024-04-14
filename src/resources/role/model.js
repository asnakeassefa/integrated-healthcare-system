const mongoose = require('mongoose')

// Define the Staff Schema
const RoleSchema = new mongoose.Schema({
  name:{
    type:String,
    unique:true,
    reqired:true,
  },
})

// Create the Staff model
const Role = mongoose.model('Role', RoleSchema)

module.exports = Role
