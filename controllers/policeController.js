const PoliceStation = require('../models/policeStationModel'); // adjust the path as necessary

exports.getAllDistricts = async (req, res) => {
  try {
    const uniqueDistricts = await PoliceStation.aggregate([
      { $group: { _id: "$id", districtName: { $first: "$districtName" } } },
      { $sort: { districtName: 1 } } // Sort by districtName in ascending order
    ]);
    
    res.json(uniqueDistricts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllPoliceStationsByDistrict = async (req, res) => {
  const { id } = req.params; // Extract the district ID from the request parameters
  try {
    const policeStations = await PoliceStation.find({ id: id }) // Find police stations by district ID
      .sort({ policeStationName: 1 }); // Sort by police station name in ascending order

    if (policeStations.length === 0) {
      return res.status(404).json({ message: 'No police stations found for this district.' });
    }

    res.json(policeStations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

