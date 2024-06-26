const User = require('../user/model')
const Refresh = require('./model')
const jwt = require('jsonwebtoken')
const generateTokens = require('../../utils/generateToken')
require('dotenv').config()

const refresh = async (req, res, next) => {
  const refreshTokenSecret = process.env.REFRESH_SECRET
  try {
    const {token } = req.body
    if (!token) {
      return res.status(401).json({ message: 'Missing refresh token' })
    }
    const decoded = jwt.verify(token, refreshTokenSecret)
    const userId = decoded.userId

    const user = await User.findById(userId)

    if (!user) {
      return res.status(401).json({ message: "Couldn't get user data with this Id" })
    }

    const { accessToken, refreshToken } = await generateTokens(user)

    res.status(200).json({ accessToken })
  } catch (err) {
    return res.status(401).json({ message: 'error:Invalid refresh token' })
  }
}

module.exports = { refresh }
