const mongoose = require('mongoose')
// Define the User Schema
const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshToken: {
    type: String,
  },
})

// Create the User model
const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)

module.exports = RefreshToken
