const bcrypt = require('bcrypt')
const User = require('./model')
const generateTokens = require('../../utils/generateToken')
const UserRole = require('../role/model')
const { get } = require('http')
const { reset } = require('nodemon')
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
    
    const targetUser = await User.findOne({ username: username }).populate('role').populate('name').populate('username')
    // log(targetUser)
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    if(targetUser.verified == false){
      return res.status(401).json({ error: 'User not verified' })
    }

    const validPassword = await bcrypt.compare(password, targetUser.hashedPassword)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    targetName = targetUser.name
    const targetUsername = targetUser.username
    id = targetUser._id
    role = targetUser.role.name

    const { accessToken, refreshToken } = await generateTokens(targetUser)
    res.status(200).json({ id, targetName,targetUsername, role, accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}

const getusers = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to add order.' })
    }
    const users = await User.find().populate('role')
    const usersList = users.map((user) => {
      return {
        id: user._id,
        name: user.name,
        role: user.role.name,
      }
    })
    res.status(200).json(usersList)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// verify users
const verifyUser = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to verify user.' })
    }
    const { id } = req.body
    const user = await User.findOne({ _id: id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    user.verified = true
    await user.save()
    res.json({ message: 'User verified successfully' })
  } catch (error) {
    console.log('Error verifying user:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// get users who are not verified
const getUnverifiedUsers = async (req, res) => {
  try{
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to verify user.' })
    }
    const users = await User.find({ verified: false })

    // send user without password
    res.status(200).json({unverifiedUsers: users.map(user => {
      return {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role.name,
        verified: user.verified
      }
    }) })
  }catch(error){
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}


// reset password
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body
    const user = await User.findOne({ _id: req.userId})
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // validate password if it is the password is the same as the old password
    const validPassword = await bcrypt.compare(oldPassword, user.hashedPassword)
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Faild to change password' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.hashedPassword = hashedPassword
    await user.save()
  
    res.json({ message: 'Password reset successfully' })

  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
}
module.exports = {
  signup,
  login,
  getusers,
  verifyUser,
  getUnverifiedUsers,
  resetPassword,
  // addRole,
}
