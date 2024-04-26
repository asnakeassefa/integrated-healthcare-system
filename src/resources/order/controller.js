const mongoose = require('mongoose')
const User = require('../user/model')
const Patient = require('../atrPatient/model')
const Drug = require('../drug/model')
const Order = require('./model')
const Role = require('../role/model')
//create order
const addOrder = async (req, res) => {
  try {
    const userRole = await Role.findById(req.Role)
    if (userRole.name != 'Doctor') {
      console.log(req.Role)
      return res.status(403).json({ message: 'You are not authorized to add order.' })
    }
    const { userId, patientId, drugId } = req.body

    // Check if required fields are provided
    if (!userId || !patientId || !drugId) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }

    // Find the user by userId
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Find the patient by patientId
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    // Find the drug by drugId
    const drug = await Drug.findById(drugId)
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found.' })
    }

    // Create the visit with the user, patient, and drug
    const order = new Order({
      user: user._id,
      patient: patient._id,
      drug: drug._id,
    })

    // Save the order to the database
    await order.save()
    return res.status(201).json({ message: 'Order added successfully.', order: order })
  } catch (error) {
    console.error('Error adding order:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// getOrders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    return res.status(200).json({ orders })
  } catch (error) {
    console.error('Error getting orders:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// getOrderById

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    return res.status(200).json({ order })
  } catch (error) {
    console.error('Error getting order:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// updateOrder

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const { userId, patientId, drugId } = req.body

    // Check if required fields are provided
    if (!userId || !patientId || !drugId) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }

    // Find the user by userId
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Find the patient by patientId
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    // Find the drug by drugId
    const drug = await Drug.findById(drugId)
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found.' })
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        user: user._id,
        patient: patient._id,
        drug: drug._id,
      },
      { new: true },
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    return res.status(200).json({ message: 'Order updated successfully.', order })
  } catch (error) {
    console.error('Error updating order:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// deleteOrder

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const order = await Order.findByIdAndDelete(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    return res.status(200).json({ message: 'Order deleted successfully.' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// getOrdersByPatientId

const getOrdersByPatientId = async (req, res) => {
  try {
    const patientId = req.params.id
    const orders = await Order.find({ patient: patientId })
    return res.status(200).json({ orders })
  } catch (error) {
    console.error('Error getting orders:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = { addOrder, getOrders, getOrderById, updateOrder, deleteOrder, getOrdersByPatientId }
