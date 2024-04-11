const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken}=require('../../common/uitils')
const user=require('../../schema/user')

function deleteUser(req,res,next){ 
    
    const username = req.body.username;
   
    user.findOneAndUpdate({ userName:username},{ active:false}).then(function(user, err) {
        if (err ) {
             res.sendStatus(401);
        }
      });


} 

module.exports=deleteUser;