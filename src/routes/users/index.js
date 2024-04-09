const express = require('express');
const router = express.Router();
const {verifyToken}=require('../../common/uitils')
const addUser=require("./addUser");
const deleteUSer=require("./deleteUser");
const updateUser=require("./updateUser");
const updateRole=require("./updateRole");

router.use('/update',updateUser );


router.use(function( req, res,) {
  const Token = req.body.token;

 if (!verifyToken(token,["admin"])){
  next("!Forbidden");
 }
});
//protected

router.use('/add',addUser );
router.use('/delete',deleteUSer );
router.use('/updaterole',updateRole );




module.exports = router;
