const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  googleId: { 
    type: String,
    unique: true,
    sparse: true,
  },
  countryCode: {
    type: String,
    required: false,
    default: '+91',
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, 
  },
  role: {
    type: String,
    enum: ['citizen', 'lawyer', 'admin'],
    required: false,
  },
  enrollmentNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  kycStatus: {
    type: String,
    enum: ['Not Verified', 'Pending', 'Verified'],
    default: 'Not Verified',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});


userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }


  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});



userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
  return resetToken;
};


userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();


  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  
  return userObject;
}

const User = mongoose.model('User', userSchema);
module.exports = User;