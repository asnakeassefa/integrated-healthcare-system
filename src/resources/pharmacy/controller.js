const Order = require('../order/model')
const Pharmacy = require('./module')
const User = require('../user/model')
// complete use order
const completeOrder = async (req, res) => {
  try {
    const { orderId, pharmacistId, quantity, price } = req.body
    
    if (!orderId) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        completed: true,
      },
      { new: true },
    )
    console.log(order)
    if (!pharmacistId) {
      return res.status(400).json({ message: 'Pharmacist id is required.' })
    }

    if (!quantity) {
      return res.status(400).json({ message: 'Quantity is required.' })
    }

    if (!price) {
      return res.status(400).json({ message: 'Price is required.' })
    }

    const pharmacist = await User.findById(pharmacistId)
    if (!pharmacist) {
      return res.status(404).json({ message: 'Pharmacist not found.' })
    }

    const pharmacy = new Pharmacy({
      order: order._id,
      pharmacist: pharmacistId,
      quantity: quantity,
      price: price,
    })
    return res.status(200).json({ message: 'Order completed successfully.', order })
  } catch (error) {
    console.error('Error completing order:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get all completedOrders
const getAllCompletedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ completed: true })
    return res.status(200).json({ orders })
  } catch (error) {
    console.error('Error getting completed orders:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get all pharmacyOrders
const getAllPharmacyOrders = async (req, res) => {
  try {
    const orders = await Pharmacy.find()
    return res.status(200).json({ orders })
  } catch (error) {
    console.error('Error getting pharmacy orders:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get order by pharmacistId

const getOrderByPharmacistId = async (req, res) => {
  try {
    const pharmacistId = req.params.id
    const orders = await Pharmacy.find({ pharmacist: pharmacistId })
    if (!orders) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    return res.status(200).json({ orders })
  } catch (error) {
    console.error('Error getting order:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// get allPharmacist

const getAllPharmacist = async (req, res) => {
  try {
    const pharmacist = await User.find({ role: 'pharmacist' })
    return res.status(200).json({ pharmacist })
  } catch (error) {
    console.error('Error getting pharmacist:', error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = { completeOrder, getAllCompletedOrders, getAllPharmacyOrders, getOrderByPharmacistId, getAllPharmacist}
