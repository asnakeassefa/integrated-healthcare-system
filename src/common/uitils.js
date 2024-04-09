const jwt = require('jsonwebtoken');
const crypto = require('crypto');


function verifyToken(token,roles)  {
    

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return false
        }

       if (roles.includes(this.role)){
        return true;
       }
    });
};

function hashWithSalt(input, salt) {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(input);
    const value = hash.digest('hex');
    return value;
}

module.exports({verifyToken,hashWithSalt});