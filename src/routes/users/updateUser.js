const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken}=require('../../common/uitils')
const user=require('../../schema/user')

function updateUser(req,res,next){ 
    
    const username = req.body.username;
    const pass=hashWithSalt(req.body.password,process.env.SALT);
    const newusername = req.body.newusername;
    const newpassword = req.body.newpassword;
    const newemail = req.body.newemail;


    user.findOneAndUpdate({ userName:username,password:pass},{ userName:newusername,password:newpassword,email:newemail}).then( function(user, err) {
        if (err ) {
             res.sendStatus(401);
        }
      });


} 

module.exports=updateUser;