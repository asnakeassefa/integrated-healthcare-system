const bcrypt = require('bcrypt')
const user = require('./model')
const generateTokens = require('../../utils/generateToken')

const UserRole = require('../role/model')
const { log } = require('console')
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
    const { username, name, password, role } = req.body
    
    // check if user already exists
    const existingUser = await user.findOne({ username: username })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const Role = await UserRole.findOne({ name: role })
    if (!Role) {
      return res.status(404).json({ error: 'Role not found' })
    }
    // salting and hashing password
    const hashedPassword = await bcrypt.hash(password, 10)
    // console.log(hashedPassword)
    if (hashedPassword == null) {
      // console.error(hashedPassword)
      return res.status(500).json({ error: 'Failed to hash password' })
    }
    const newUser = new user({
      username,
      name,
      hashedPassword,
      Role,
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
    const targetUser = await user.findOne({ username: username })
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
    const { accessToken, refreshToken } = await generateTokens(targetUser)

    res.status(200).json({ id, targetName, accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  signup,
  login,
  addRole,
}