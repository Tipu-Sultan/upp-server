const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  policeId: { type: String, required: true, unique: true },
  policeStation:{ type: String},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String },   
  isVerified: { type: Boolean, default: false },  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
