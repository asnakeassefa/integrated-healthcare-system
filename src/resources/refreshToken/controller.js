const User = require('../user/model')
const jwt = require('jsonwebtoken')
const generateTokens = require('../../utils/generateToken')
require('dotenv').config()

const refresh = async (req, res, next) => {

    const refreshTokenSecret = process.env.REFRESH_SECRET;
    try {
      const {oldToken} = req.body;
      if (!oldToken) {
        return res.status(401).json({ message: 'Missing refresh token' });
      }
      const decoded = jwt.verify(oldToken, refreshTokenSecret);
      const userId = decoded.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
      const {accessToken,refreshToken} = await generateTokens(user);

      res.status(200).json({ accessToken});
    } catch (err) {
      return res.status(401).json({ message: 'error:Invalid refresh token' });
    }
  }

module.exports = {refresh}
  