const bcrypt = require('bcrypt')
const User = require('./model')
const generateTokens = require('../../utils/generateToken')
const UserRole = require('../role/model')
require('dotenv').config()

const addRole = async (req, res, next) => {
  try {
    const { name } = req.body
    const newRole = new Role({ name })
    await newRole.save()
    res.status(201).json(newRole)
  } catch (error) {
    console.error('Error adding Role:', error)
    res.status(500).json({ error: 'Failed to add role' })
  }
}

const signup = async (req, res, next) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to add order.' })
    }
    const { username, name, password, roleName } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ username: username })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const role = await UserRole.findOne({ name: roleName })
    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }
    // salting and hashing password
    const hashedPassword = await bcrypt.hash(password, 10)
    // console.log(hashedPassword)
    if (hashedPassword == null) {
      // console.error(hashedPassword)
      return res.status(500).json({ error: 'Failed to hash password' })
    }
    const newUser = new User({
      username,
      name,
      hashedPassword,
      role,
    })

    await newUser.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Error adding User:', error)
    res.status(500).json({ error: 'Failed to adding user' })
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const targetUser = await User.findOne({ username: username }).populate('role')
    // log(targetUser)
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }
    const validPassword = await bcrypt.compare(password, targetUser.hashedPassword)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    targetName = targetUser.name
    id = targetUser._id
    role = targetUser.role.name
    const { accessToken, refreshToken } = await generateTokens(targetUser)

    res.status(200).json({ id, targetName, role, accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  signup,
  login,
  // addRole,
}
