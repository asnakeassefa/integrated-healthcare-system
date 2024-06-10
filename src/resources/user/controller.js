const bcrypt = require('bcrypt')
const User = require('./model')
const generateTokens = require('../../utils/generateToken')
const UserRole = require('../role/model')
const { log } = require('console')
require('dotenv').config()

const addRole = async (req, res, next) => {
  try {
    // if(req.Role != 'Admin'){
    //   return res.status(403).json({ message: 'You are not authorized to add role.' })
    // }
    const { name } = req.body
    const newRole = new UserRole({ name })
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
    if (!username || !name || !password || !roleName) {
      return res.status(404).json({ error: 'please provide all the required fields' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const existingUser = await User.findOne({ username: username })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }
    if (roleName == 'SuperAdmin') {
      return res.status(403).json({ error: 'You are not allowed to create super admin' })
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

    if (!username || !password) {
      return res.status(404).json({ message: 'please provide all the required fields' })
    }
    const targetUser = await User.findOne({ username: username }).populate('role').populate('name').populate('username')
    // log(targetUser)

    if (!targetUser) {
      return res.status(404).json({ message: 'Invalid Credentials' })
    }

    if (targetUser.verified == false) {
      return res.status(404).json({ message: 'Invalid Credentials' })
    }

    const validPassword = await bcrypt.compare(password, targetUser.hashedPassword)
    if (!validPassword) {
      return res.status(404).json({ message: 'Invalid Credentials' })
    }
    targetName = targetUser.name
    const targetUsername = targetUser.username
    id = targetUser._id
    role = targetUser.role.name

    const { accessToken, refreshToken } = await generateTokens(targetUser)
    res.status(200).json({ id, targetName, targetUsername, role, accessToken, refreshToken })
  } catch (error) {
    res.status(500).json({ message: 'Failed to login' })
  }
}

const getusers = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to add order.' })
    }
    const users = await User.find({ verified: true, rejected: false}).populate('role')
    // return all verified users is true
    const usersList = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role.name,
      }
    })

    res.status(200).json({ message: 'All Verified users', users: usersList })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// verify users
const verifyUser = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to verify user.' })
    }
    const { userId, role } = req.body
    if (!userId) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!role) {
      return res.status(404).json({ message: 'Role is required' })
    }

    const newRole = await UserRole.findOne({ name: role })

    if (!newRole) {
      return res.status(404).json({ message: 'Role not found' })
    }

    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.verified = true
    user.role = newRole
    await user.save()
    res.json({ message: 'User verified successfully' })
  } catch (error) {
    console.log('Error verifying user:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// get users who are not verified
const getUnverifiedUsers = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to verify user.' })
    }
    const users = await User.find({ verified: false , rejected:false})

    // send user without password
    res.status(200).json({
      unverifiedUsers: users.map((user) => {
        return {
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role.name,
          verified: user.verified,
        }
      }),
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// reset password
const updateProfile = async (req, res) => {
  try {
    const { username, name, oldPassword, password } = req.body
    const user = await User.findOne({ _id: req.userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (password) {
      if(!oldPassword){
        return res.status(400).json({ message: 'Please provide old password' })
      }
      if (oldPassword == password) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password' })
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' })
      }

      if (!oldPassword || !password) {
        return res.status(404).json({ message: 'please provide all the required fields' })
      }
      // validate password if it is the password is the same as the old password
      const validPassword = await bcrypt.compare(oldPassword, user.hashedPassword)

      if (!validPassword) {
        return res.status(400).json({ message: 'Faild to change password' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      user.hashedPassword = hashedPassword
    }

    // check if username is unique
    if (username && username !== user.username) {
      const existing = await User.findOne({ username })
      if (existing) {
        return res.status(400).json({ message: 'Username already exists' })
      }
      user.username = username
    }

    if (name) user.name = name
    await user.save()

    res.json({ message: 'User profile updated successfully' })
  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Failed to Update profile' })
  }
}

const updateUserInfo = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      return res.status(403).json({ message: 'You are not authorized to update user.' })
    }
    const { userId, role } = req.body
    if (!userId || !role) {
      return res.status(404).json({ message: 'please provide all the required fields' })
    }
    const user = await User.findOne({ _id: userId }).populate('role')
    if (role == 'SuperAdmin') {
      return res.status(403).json({ message: 'Only one super admin is allowed' })
    }

    if (user.role.name == 'SuperAdmin') {
      return res.status(403).json({ message: 'You are not authorized to update super admin' })
    }
    if (user.role.name != 'Staff' && userRole.name != 'SuperAdmin') {
      return res.status(403).json({ message: 'You are not authorized to update admin' })
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    var newRole = await UserRole.findOne({ name: role })
    if (!newRole) {
      return res.status(404).json({ message: 'Role not found' })
    }

    user.role = newRole
    await user.save()
    res.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
}

const unverifiedUsers = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to verify user.' })
    }
    const { userId } = req.body
    if (!userId) {
      return res.status(404).json({ message: 'User not found' })
    }
    // update user verifcation status to false
    const user = await User.findOne({ _id: userId }).populate('role')

    if (user.role.name != 'Staff' && userRole.name != 'SuperAdmin') {
      return res.status(403).json({ message: 'You are not authorized to update admin' })
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.verified = false
    await user.save()
    res.json({ message: 'User unverified successfully' })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

const resetPassword = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to verify user.' })
    }
    const { userId } = req.body
    if (!userId) {
      return res.status(404).json({ message: 'User not found' })
    }
    const user = await User.findOne({ _id: userId }).populate('role')
    if (user.role.name == 'SuperAdmin') {
      return res.status(403).json({ message: 'You are not authorized to update super admin' })
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const hashedPassword = await bcrypt.hash('password', 10)
    user.hashedPassword = hashedPassword
    await user.save()
    res.json({ message: 'Password reseted successfully' })
  } catch (error) {
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
}

// reject verification

const rejectUser = async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.Role)
    if (userRole.name != 'Admin' && userRole.name != 'SuperAdmin') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to reject user.' })
    }
    const { userId } = req.body
    if (!userId) {
      return res.status(404).json({ message: 'User not found' })
    }
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.verified == true) {
      return res.status(403).json({ message: 'User is already verified' })
    }

    // delete user
    user.rejected = true
    await user.save()
    res.json({ message: 'User rejected successfully' })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// update user name a

module.exports = {
  signup,
  login,
  getusers,
  verifyUser,
  getUnverifiedUsers,
  updateProfile,
  updateUserInfo,
  unverifiedUsers,
  resetPassword,
  rejectUser,
  // addRole,
}
