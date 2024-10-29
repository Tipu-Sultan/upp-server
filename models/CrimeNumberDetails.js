const mongoose = require('mongoose');

const CrimeNumberDetailsSchema = new mongoose.Schema({
  crimeNumber: { type: String },
  aadharNumber:{ type: String,required: true}, 
  email:{ type: String,required: true}, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isFirstTimeOffender: { type: Boolean, default: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('CrimeNumberDetails', CrimeNumberDetailsSchema);
