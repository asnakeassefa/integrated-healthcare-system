const jwt = require('jsonwebtoken');
const crypto = require('crypto');


function verifyToken(token,roles)  {
    

    jwt.verify(token,  `${process.env.ACCESS_TOKEN_SECRET}`, function(err, decoded) {
        if (err) {
            console.log("err");
          return false;
        }
        else if(roles.includes(decoded.role)){
            console.log("sds")
            return true
        }
      });
      return false
    
    }

function hashWithSalt(input, salt) {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(input);
    const value = hash.digest('hex');
    return value;
}

module.exports={verifyToken,hashWithSalt};