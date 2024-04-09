const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken}=require('../../common/uitils')
const user=require('../../schema/user')

function addUser(req,res,next){
const userName=req.body.userName;
const email=req.body.email;
const role=req.body.role;
const password=req.body.password;



user.create({userName:userName,email:email,role:role,password:password}, function (err, user) {
    if (err)
      next(err);
    else
    res.status(200).send('added!');    // saved!
  })


} 

module.exports=addUser;