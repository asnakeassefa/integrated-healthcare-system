const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const {
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
} = require('../../src/resources/user/controller')

const User = require('../../src/resources/user/model')
const UserRole = require('../../src/resources/role/model')
const generateTokens = require('../../src/utils/generateToken')

jest.mock('../../src/resources/user/model')
jest.mock('../../src/resources/role/model')
jest.mock('../../src/utils/generateToken')
jest.mock('bcrypt')

const app = express()
app.use(bodyParser.json())
app.post('/signup', signup)
app.post('/login', login)
app.get('/getusers', getusers)
app.post('/verifyUser', verifyUser)
app.get('/getUnverifiedUsers', getUnverifiedUsers)
app.put('/updateProfile', updateProfile)
app.put('/updateUserInfo', updateUserInfo)
app.put('/unverifiedUsers', unverifiedUsers)
app.post('/resetPassword', resetPassword)
app.post('/rejectUser', rejectUser)

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /signup', () => {
    it('should return 404 if required fields are missing', async () => {
      const response = await request(app).post('/signup').send({})
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('please provide all the required fields')
    })

    it('should return 400 if password is less than 8 characters', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'user',
          name: 'name',
          password: 'short',
          roleName: 'role',
        })
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Password must be at least 8 characters')
    })

    it('should return 409 if user already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'user' })
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'user',
          name: 'name',
          password: 'password',
          roleName: 'role',
        })
      expect(response.status).toBe(409)
      expect(response.body.error).toBe('User already exists')
    })

    it('should return 403 if trying to create super admin', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'user',
          name: 'name',
          password: 'password',
          roleName: 'SuperAdmin',
        })
      expect(response.status).toBe(403)
      expect(response.body.error).toBe('You are not allowed to create super admin')
    })

    it('should return 404 if role is not found', async () => {
      UserRole.findOne.mockResolvedValue(null)
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'user',
          name: 'name',
          password: 'password',
          roleName: 'role',
        })
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Role not found')
    })

    it('should create a new user and return 201', async () => {
      UserRole.findOne.mockResolvedValue({ name: 'role' })
      User.findOne.mockResolvedValue(null)
      bcrypt.hash.mockResolvedValue('hashedPassword')
      const response = await request(app)
        .post('/signup')
        .send({
          username: 'user',
          name: 'name',
          password: 'password',
          roleName: 'role',
        })
      expect(response.status).toBe(201)
      expect(response.body.message).toBe('User created successfully')
    })
  })

  describe('POST /login', () => {
    it('should return 404 if required fields are missing', async () => {
      const response = await request(app).post('/login').send({})
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('please provide all the required fields')
    })

    it('should return 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null)
      const response = await request(app)
        .post('/login')
        .send({
          username: 'user',
          password: 'password',
        })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Invalid Credentials')
    })

    it('should return 404 if user is not verified', async () => {
      User.findOne.mockResolvedValue({ verified: false })
      const response = await request(app)
        .post('/login')
        .send({
          username: 'user',
          password: 'password',
        })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Invalid Credentials')
    })

    it('should return 404 if password is invalid', async () => {
      User.findOne.mockResolvedValue({ verified: true, hashedPassword: 'hashedPassword' })
      bcrypt.compare.mockResolvedValue(false)
      const response = await request(app)
        .post('/login')
        .send({
          username: 'user',
          password: 'password',
        })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Invalid Credentials')
    })

    it('should return 200 and tokens if login is successful', async () => {
      const user = { verified: true, hashedPassword: 'hashedPassword', name: 'name', username: 'user', _id: 'id', role: { name: 'role' } }
      User.findOne.mockResolvedValue(user)
      bcrypt.compare.mockResolvedValue(true)
      generateTokens.mockResolvedValue({ accessToken: 'accessToken', refreshToken: 'refreshToken' })

      const response = await request(app)
        .post('/login')
        .send({
          username: 'user',
          password: 'password',
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: 'id',
        targetName: 'name',
        targetUsername: 'user',
        role: 'role',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      })
    })
  })

  describe('GET /getusers', () => {
    it('should return 403 if user is not authorized', async () => {
      UserRole.findById.mockResolvedValue({ name: 'User' })
      const response = await request(app).get('/getusers').set('Role', 'role')
      expect(response.status).toBe(403)
      expect(response.body.message).toBe('You are not authorized to add order.')
    })

    it('should return 200 with all verified users', async () => {
      UserRole.findById.mockResolvedValue({ name: 'Admin' })
      User.find.mockResolvedValue([{ _id: 'id', username: 'user', name: 'name', role: { name: 'role' } }])
      const response = await request(app).get('/getusers').set('Role', 'role')
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('All Verified users')
      expect(response.body.users).toEqual([
        { id: 'id', username: 'user', name: 'name', role: 'role' },
      ])
    })
  })

  describe('POST /verifyUser', () => {
    it('should return 403 if user is not authorized', async () => {
      UserRole.findById.mockResolvedValue({ name: 'User' })
      const response = await request(app)
        .post('/verifyUser')
        .set('Role', 'role')
        .send({ userId: 'userId', role: 'role' })
      expect(response.status).toBe(403)
      expect(response.body.message).toBe('You are not authorized to verify user.')
    })

    it('should return 404 if userId or role is missing', async () => {
      UserRole.findById.mockResolvedValue({ name: 'Admin' })
      let response = await request(app)
        .post('/verifyUser')
        .set('Role', 'role')
        .send({ role: 'role' })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('User not found')

      response = await request(app)
        .post('/verifyUser')
        .set('Role', 'role')
        .send({ userId: 'userId' })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Role is required')
    })

    it('should return 404 if role is not found', async () => {
      UserRole.findById.mockResolvedValue({ name: 'Admin' })
      UserRole.findOne.mockResolvedValue(null)
      const response = await request(app)
        .post('/verifyUser')
        .set('Role', 'role')
        .send({ userId: 'userId', role: 'role' })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Role not found')
    })

    it('should return 404 if user is not found', async () => {
      UserRole.findById.mockResolvedValue({ name: 'Admin' })
      UserRole.findOne.mockResolvedValue({ name: 'role' })
      User.findOne.mockResolvedValue(null)
      const response = await request(app)
        .post('/verifyUser')
        .set('Role', 'role')
        .send({ userId: 'userId', role: 'role' })
      expect(response.status).toBe(404)
      expect(response.body.message).toBe('User not found')
    })

    it('should verify user and return 200', async () => {
      UserRole.findById.mockResolvedValue({ name: 'Admin' })
      UserRole.findOne.mockResolvedValue({ name: 'role' })
      User.findOne.mockResolvedValue({ save: jest.fn() })
      const response = await request(app)
        .post('/verifyUser')
        .set('Role', 'role')
        .send({ userId: 'userId', role: 'role' })
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('User verified successfully')
    })
  })

  // Add similar test cases for the remaining endpoints
})