const{hashWithSalt}=require("../common/uitils")
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Doctor', 'Admin', 'LabTechnician','Pharmacist'],
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength:8
  },
  active:{
type:Boolean,
required:true
  }
});



UserSchema.pre('save', function(next) {
  // validation logic here
  // `this` refers to the document being saved
  if (validateEmail( this.email) && ValidateUserName(this.userName) && this.password.length>=8) {
    this.password= hashWithSalt(this.password,process.env.SALT);
    this.active=true;
    next();
  } else {
    // If not valid, create a new error and pass it to `next()`
    const err = new Error('Validation failed');
    next(err);
  }
});

function ValidateUserName(str) {
  let re = /^[a-zA-Z]/;
  return re.test(str.toLowerCase()) || re.test(str.toUpperCase());
}

function validateEmail(email) {
  let re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return re.test(String(email).toLowerCase());
}

const user = mongoose.model('user', UserSchema);
module.exports=user;
