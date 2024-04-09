const express = require('express');
const router = express.Router();
const user= require("./routes/users/index")
const auth= require("./routes/auth/index")

router.use('/auth', auth);
router.use('/user', user);


module.exports = router;
