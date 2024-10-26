const express = require('express');
const { registerCrime,getCrimeRecords, getFilteredCrimeRecords } = require('../controllers/crimeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authMiddleware, registerCrime);
router.get('/:crimeNumber', authMiddleware, getCrimeRecords);
router.get('/', getFilteredCrimeRecords);


module.exports = router;
