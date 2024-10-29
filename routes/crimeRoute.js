const express = require('express');
const { registerCrime,getCrimeRecords, getFilteredCrimeRecords, updateCrimeRecord, updateCrimeStatus, deleteCrime } = require('../controllers/crimeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authMiddleware, registerCrime);
router.get('/getbynumber/:crimeNumber', authMiddleware, getCrimeRecords);
router.put('/updatebyId/:crimeId', authMiddleware, updateCrimeRecord);
router.put('/updateStatus/:crimeId', authMiddleware, updateCrimeStatus);
router.get('/', getFilteredCrimeRecords);
router.delete('/delete/:crimeId', deleteCrime);



module.exports = router;
