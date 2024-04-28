const express = require('express')
const Bed = require('./model')
// take bed controller


// add bed here
const addBed = async (req, res) => {
    // want to add a bed to db
    const { room, bedNumber } = req.body;
    if (!room || !bedNumber){
        res.status(400).json({ message: 'room and bednumber are required' })
    }
    const bed = new Bed({room,bedNumber});
    await bed.save();
    res.status(201).json({ message: 'Bed added successfully' });
}

const getBeds = async (req, res) => {
    try {
        const beds = await Bed.find();
        res.status(200).json(beds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching beds' });
    }
}

module.exports = {
    addBed,
    getBeds
}