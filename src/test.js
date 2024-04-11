const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();


function verifyToken(token,roles)  {
    

    jwt.verify(token, 'shhhhh', function(err, decoded) {
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

let token = jwt.sign({ username: "fs",role:"Admin" },  'shhhdhh' , { expiresIn: '15m' });

console.log(token)
if (!verifyToken(token,["Admin"])){
console.log("failed")
}
   else
   console.log("sdsds")  