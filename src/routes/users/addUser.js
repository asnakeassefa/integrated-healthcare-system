const express = require('express');
const jwt = require('jsonwebtoken');
const {verifyToken}=require('../../common/uitils')
const user=require('../../schema/user')

function addUser(req,res,next){
  
const userName=req.body.userName;
const email=req.body.email;
const role=req.body.role;
const password=req.body.password;
const gender=req.body.gender;





user.create({userName:userName,email:email,role:role,password:password,gender:gender,active:true}).then( function (user, err) {
  if (err)
    res.status(400).send('failed!'); 
    else
    res.status(200).send('added!');    // saved!
  })


} 

module.exports=addUser;