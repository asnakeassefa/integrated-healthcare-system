const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken}=require('../../common/uitils')
const user=require('../../schema/user')

function updateUser(req,res,next){ 
    
    const username = req.body.username;
    const newrole = req.body.newrole;
   

    user.findOneAndUpdate({ userName:username},{ role:newrole}).then(function(user, err) {
        if (err ) {
             res.sendStatus(401);
        }
      });


} 

module.exports=updateUser;