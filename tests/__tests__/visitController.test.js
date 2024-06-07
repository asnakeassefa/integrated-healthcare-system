const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { createVisit } = require('../../src/resources/visitHistory/controller')

const User = require('../../src/resources/user/model')
const Patient = require('../../src/resources/atrPatient/model').Patient
const Drug = require('../../src/resources/drug/model')
const Visit = require('../../src/resources/visitHistory/model')
const DispencedDrug = require('../../src/resources/drug/countModel')

jest.mock('../../src/resources/user/model')
jest.mock('../../src/resources/atrPatient/model')
jest.mock('../../src/resources/drug/model')
jest.mock('../../src/resources/visitHistory/model')
jest.mock('../../src/resources/drug/countModel')

const app = express()
app.use(bodyParser.json())
app.post('/createVisit', createVisit)

describe('POST /createVisit', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    }
    next = jest.fn()
  })

  it('should return 400 if required fields are missing', async () => {
    req.body = {}

    await request(app)
      .post('/createVisit')
      .send(req.body)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe('Please provide all required fields.')
      })
  })

  it('should return 404 if user is not found', async () => {
    req.body = {
      patientId: 'patientId',
      drugs: [{ _id: 'drugId', amount: 10 }],
      visitDate: '2023-06-08'
    }
    req.userId = 'userId'

    User.findById.mockResolvedValue(null)

    await request(app)
      .post('/createVisit')
      .send(req.body)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('User not found.')
      })
  })

  it('should return 404 if patient is not found', async () => {
    req.body = {
      patientId: 'patientId',
      drugs: [{ _id: 'drugId', amount: 10 }],
      visitDate: '2023-06-08'
    }
    req.userId = 'userId'

    User.findById.mockResolvedValue({ _id: 'userId' })
    Patient.findById.mockResolvedValue(null)

    await request(app)
      .post('/createVisit')
      .send(req.body)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('Patient not found.')
      })
  })

  it('should return 404 if drugs are not available', async () => {
    req.body = {
      patientId: 'patientId',
      drugs: [{ _id: 'drugId', amount: 10 }],
      visitDate: '2023-06-08'
    }
    req.userId = 'userId'

    User.findById.mockResolvedValue({ _id: 'userId' })
    Patient.findById.mockResolvedValue({ _id: 'patientId' })
    Drug.findById.mockResolvedValue(null)

    await request(app)
      .post('/createVisit')
      .send(req.body)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('Drug not found.')
      })
  })

  it('should create visit and return 201', async () => {
    req.body = {
      patientId: 'patientId',
      drugs: [{ _id: 'drugId', amount: 10 }],
      dosage: 'dosage',
      otherDrug: 'otherDrug',
      pillNumber: 20,
      visitDate: '2023-06-08',
      remark: 'remark',
      daysBeforeNextVisit: 30,
      reason: 'reason',
      inout: 'inout',
      serviceDelivery: 'serviceDelivery'
    }
    req.userId = 'userId'

    const user = { _id: 'userId' }
    const patient = { _id: 'patientId' }
    const drug = {
      _id: 'drugId',
      batch: [{ expireDate: '2024-06-08', quantity: 15 }]
    }

    User.findById.mockResolvedValue(user)
    Patient.findById.mockResolvedValue(patient)
    Drug.findById.mockResolvedValue(drug)
    Visit.prototype.save = jest.fn().mockResolvedValue({})
    DispencedDrug.prototype.save = jest.fn().mockResolvedValue({})

    await request(app)
      .post('/createVisit')
      .send(req.body)
      .expect(201)
      .expect(res => {
        expect(res.body.message).toBe('Visit history created successfully.')
      })
  })

  it('should handle errors and return 500', async () => {
    req.body = {
      patientId: 'patientId',
      drugs: [{ _id: 'drugId', amount: 10 }],
      visitDate: '2023-06-08'
    }
    req.userId = 'userId'

    User.findById.mockRejectedValue(new Error('Database error'))

    await request(app)
      .post('/createVisit')
      .send(req.body)
      .expect(500)
      .expect(res => {
        expect(res.body.message).toBe('Internal server error.')
      })
  })
})
