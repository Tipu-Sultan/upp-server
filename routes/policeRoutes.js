const express = require('express');
const {getAllDistricts, getAllPoliceStationsByDistrict } = require('../controllers/policeController');
const router = express.Router();

router.get('/district', getAllDistricts);
router.get('/policeStations/:id', getAllPoliceStationsByDistrict);


module.exports = router;
