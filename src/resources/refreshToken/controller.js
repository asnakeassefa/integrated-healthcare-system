const User = require('../user/model')
const jwt = require('jsonwebtoken')
const generateTokens = require('../../utils/generateToken')
require('dotenv').config()

const refresh = async (req, res, next) => {

    const refreshTokenSecret = process.env.REFRESH_SECRET;
    try {
      const oldRefreshToken = req.body.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({ message: 'Missing refresh token' });
      }
      const decoded = jwt.verify(oldRefreshToken, refreshTokenSecret);
      const userId = decoded.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
      const {accessToken,refreshToken} = await generateTokens(user);

      res.json({ accessToken, refreshToken });
    } catch (err) {
      return res.status(401).json({ message: 'error:Invalid refresh token' });
    }
  }

module.exports = {refresh}
  