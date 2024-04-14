const mongoose = require('mongoose')
// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId, // corrected 'types' to 'Types'
    ref: 'Role', // corrected 'role' to 'Role'
    required: true,
  },
})

// Create the User model
const User = mongoose.model('User', UserSchema)

module.exports = User
