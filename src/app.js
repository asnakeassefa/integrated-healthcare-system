const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const routes = require('./routes'); // import routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use(routes); // use imported routes


app.use(function(err, req, res, next) {
    console.error(err.stack); // log error stack to console
    res.status(500).send('Something broke!');
  });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));


