const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const user=require('../../schema/user')
const{hashWithSalt}=require("../../common/uitils")





function login  (req, res) {
    // Authenticate User
    const username = req.body.userName;
    const pass=hashWithSalt(req.body.password,`${process.env.SALT}`);


    user.findOne({userName:username}).then( function (user, err) {
        if (user)
        {

           
            if (user.password==pass &&user.active ) 
            {

                const accessToken = jwt.sign({ username: user.userName,role:user.role }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '15m' });
    
                // Generate Refresh Token
                const refreshToken = jwt.sign({ username: user.username,role:user.role }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '1d' });
                res.json({
                    acessToken:accessToken,
                    refreshToken:refreshToken
                })
                res.sendStatus(200)

                console.log(refreshToken)
        }
          
    }
        else{

        res.sendStatus(401)
        console.log(err)  
        }
      })


   
    


    
};





function refresh (req, res)  {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.userName,role:user.role }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '15m' });

        res.json({ accessToken:accessToken });
        res.sendStatus(200)
    });
};
module.exports={login,refresh};