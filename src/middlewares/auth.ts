
import jwt from 'jsonwebtoken'
import crypto from 'crypto';


function verifyToken(token:any,roles:any)  {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any, user:any) => {
        if (err) {
            return false
        }
       if (roles.includes(this.role)){
        return true;
       }
    });
};

function hashWithSalt(input:any, salt:any) {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(input);
    const value = hash.digest('hex');
    return value;
}

module.exports({verifyToken,hashWithSalt});