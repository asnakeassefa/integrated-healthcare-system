const jwt = require('jsonwebtoken')
require('dotenv').config()

async function generateTokens(user,role) {
  const accessTokenSecret = process.env.APP_SECRET
  const refreshTokenSecret = process.env.REFRESH_SECRET

  const accessToken = jwt.sign({ userId: user._id, Role:user.role}, accessTokenSecret, { expiresIn: '1d' })
  const refreshToken = jwt.sign({ userId: user._id}, refreshTokenSecret, { expiresIn: '7d' })

  return { accessToken, refreshToken }
}

module.exports = generateTokens
