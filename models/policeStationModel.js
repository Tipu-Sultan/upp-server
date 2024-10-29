const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  districtName: { type: String, required: true },
  policeStationName: { type: String, required: true },
  code: { type: Number, required: true },
}, { collection: 'uppolicestation' }); // Specify the collection name

const PoliceStation = mongoose.model('PoliceStation', policeStationSchema);

module.exports = PoliceStation;
