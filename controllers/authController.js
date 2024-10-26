const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { sendVerificationEmail } = require('../services/sendMail');

exports.registerInspector = async (req, res) => {
    const { policeId, firstName, lastName, email, phone, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(16).toString('hex');

        console.log(verificationToken)
        // Create new user with token
        const newUser = await User.create({
            policeId,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            verificationToken,
            isVerified: false,
        });

        // Send verification email
        sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered successfully, please verify your email.',policeId:newUser.policeId });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Find user by verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Update user to verified
        user.isVerified = true;
        user.verificationToken = null; 
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ error: 'Email verification failed' });
    }
};


exports.loginInspector = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token, user: { id: user._id, policeId: user.policeId, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
