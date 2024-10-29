const mongoose = require('mongoose');

const CrimeSchema = new mongoose.Schema({
  crimeNumber: { type: String },
  aadharNumber:{ type: String,required: true}, 
  email:{ type: String,required: true}, 
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  crimeType: { type: String, required: true },
  crimeDate: { type: Date, required: true },
  district: { type: String, required: true },
  tehsil: { type: String, required: true },
  policeStation: { type: String, required: true },
  description: { type: String },
  isFirstTimeOffender: { type: Boolean, default: true },
  crimeStatus: { 
    type: String, 
    enum: ['pending', 'inCourt', 'trial', 'atPoliceStation', 'clear'], 
    default: 'pending' 
  },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Crime', CrimeSchema);
