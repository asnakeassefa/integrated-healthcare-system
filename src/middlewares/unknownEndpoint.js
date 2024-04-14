const express = require('express')
// import { Request, Response } from 'express'

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = unknownEndpoint
