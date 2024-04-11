const express = require('express');
const router = express.Router();
const {verifyToken}=require('../../common/uitils')
const addUser=require("./addUser");
const deleteUSer=require("./deleteUser");
const updateUser=require("./updateUser");
const updateRole=require("./updateRole");

router.use('/update',updateUser );


router.use(function( req, res,next) {
  const token = req.body.token;

 if (!verifyToken(token,["Admin"])){
  res.status(401).send('unautorised!'); 
}
 

});
//protected

router.use('/add',addUser );
router.use('/delete',deleteUSer );
router.use('/updaterole',updateRole );




module.exports = router;
