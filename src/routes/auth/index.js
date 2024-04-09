const express = require('express');
const router = express.Router();

const { login, refresh } = require('./login');

router.use('/login',login );
router.use('/refresh',refresh );



module.exports = router;
