const jwt = require('jsonwebtoken');
// import { verify } from 'jsonwebtoken';


function verifyToken(token,roles)  {
    jwt.verify(token, process.env.APP_SECRET, (err, user) => {
        if (err) {
            return false
        }
       if (roles.includes(this.role)){
        return true;
       }
    });
};

module.exports({verifyToken});