const express = require('express')

const Bed = require('../bed/model');
const BookBed = require('./model');
const User = require('../user/model');
// Get all booked beds (including patient information)
const bookBed = async (req, res) => {
  const { patientId, bedId } = req.body; // Expect patient ID and bed ID in request body

  try {
    if (!patientId || !bedId) {
      return res.status(400).json({ message: 'Patient ID and bed ID are required' });
    }
    // Check if bed is already booked
    const isBooked = await BookBed.findOne({ bed: bedId });
    if (isBooked) {
      return res.status(409).json({ message: 'Bed is already booked' });
    }
    const user = await User.findById(req.userId);
    // Create a new booking
    const newBooking = new BookBed({ user:user._id, patient: patientId, bed: bedId });
    await newBooking.save();

    res.status(201).json({ message: 'Bed booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking bed' });
  }
};

const getAllBookedBeds = async (req, res) => {
  try {
    const bookedBeds = await BookBed.find()
      .populate('user') // Populate user details
      .populate('patient') // Populate patient details with strictPopulate set to false
      .populate('bed'); // Populate bed details for room and number
    res.status(200).json({bookedBeds: bookedBeds});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booked beds' });
  }
};

// Get a patient's booked bed (including bed details)
const getPatientBed = async (req, res) => {
  const { patientId } = req.params;

  try {
    console.log('patientId', patientId);
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    const bookedBed = await BookBed.findOne({ patient: patientId })
      .populate('patient') // Populate patient details
      .populate('bed'); // Populate bed details

    if (!bookedBed) {
      return res.status(404).json({ message: 'Patient has no booked bed' });
    }

    res.status(200).json(bookedBed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patient\'s bed' });
  }
};

// Free a bed (remove booking for a specific bed)
const freeBed = async (req, res) => {
  const { bedId } = req.params;

  try {
    if (!bedId) {
      return res.status(400).json({ message: 'Bed ID is required' });
    }
    const deletedBooking = await BookBed.deleteOne({ bed: bedId });

    if (deletedBooking.deletedCount === 0) {
      return res.status(404).json({ message: 'Bed is not booked' });
    }

    res.status(200).json({ message: 'Bed freed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error freeing bed' });
  }
};

// find all booked beds by room and free them
const freeRoom = async (req, res) => {
  const { room } = req.params;

  try {
    if (!room) {
      return res.status(400).json({ message: 'Room is required' });
    }
    // find beds in room and delete bookings
    const deletedBookings = await BookBed.deleteMany({ 'bed.room': room });

    if (deletedBookings.deletedCount === 0) {
      return res.status(404).json({ message: 'No beds are booked in this room' });
    }

    res.status(200).json({ message: 'Beds in room freed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error freeing beds in room' });
  }
};


// list of beds which is not in bookedBeds
const getUnoccupiedBeds = async (req, res) => {
  try {
    const bookedBeds = await BookBed.find();
    // free bed means bed is not booked
    const bookedBedIds = bookedBeds.map((booking) => booking.bed);
    const unoccupiedBeds = await Bed.find({ _id: { $nin: bookedBedIds } });
    res.status(200).json({unoccupiedBeds: unoccupiedBeds});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching unoccupied beds' });
  }
};

module.exports = {
    bookBed,
    getAllBookedBeds,
    getPatientBed,
    freeBed,
    freeRoom,
    getUnoccupiedBeds
}