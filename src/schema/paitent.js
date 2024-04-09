const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
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
  password: {
    type: String,
    required: true
  }
  // other fields...
});

UserSchema.pre('save', function(next) {
  // Your validation logic here
  // `this` refers to the document being saved
  if (this.username && this.email && this.password) {
    // Perform your validation
    // If everything is valid, call `next()`
    next();
  } else {
    // If not valid, create a new error and pass it to `next()`
    const err = new Error('Validation failed');
    next(err);
  }
});

const User = mongoose.model('User', UserSchema);
