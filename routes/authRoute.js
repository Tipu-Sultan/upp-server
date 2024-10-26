const express = require('express');
const { registerInspector, loginInspector, verifyEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerInspector);
router.post('/login', loginInspector);
router.get('/verify/:token', verifyEmail);


module.exports = router;
