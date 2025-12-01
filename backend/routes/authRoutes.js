const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getResetPasswordHTML } = require('../utils/emailTemplates');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, countryCode, phone, role, enrollmentNumber } = req.body;

    // --- Validation ---
    if (!username) return res.status(400).json({ msg: 'Username is required' });
    if (role === 'lawyer' && !enrollmentNumber) return res.status(400).json({ msg: 'Enrollment number is required for lawyers' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ msg: 'Email already exists' });
    if (await User.findOne({ username: username.toLowerCase() })) return res.status(400).json({ msg: 'Username already exists' });
    if (await User.findOne({ phone })) return res.status(400).json({ msg: 'Phone number already exists' });
    if (role === 'lawyer' && await User.findOne({ enrollmentNumber })) return res.status(400).json({ msg: 'Enrollment number already exists' });

    // --- Create new user ---
    const newUser = {
      name, username, email, countryCode, phone, password, role,
    };
    if (role === 'lawyer') {
      newUser.enrollmentNumber = enrollmentNumber;
    }
    
    const user = new User(newUser);
    await user.save(); // pre-save hook will hash password

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: user.toJSON(),
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (login)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    }).select('+password'); 

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ msg: 'You signed up using Google. Please use "Continue with Google" to log in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: user.toJSON(),
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/google
// @desc    Authenticate user with Google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body; 

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();
    const lowerCaseEmail = email.toLowerCase();

    let user = await User.findOne({ googleId });

    if (user) {
      // User exists, log them in
    } else {
      user = await User.findOne({ email: lowerCaseEmail });

      if (user) {
        // Email exists (signed up with password). Link Google ID.
        user.googleId = googleId;
        user.kycStatus = 'Verified';
        await user.save();
      } else {
        // --- THIS IS THE FIX ---
        // Brand new user. Create them.
        // We must generate a unique username.
        let tempUsername = lowerCaseEmail.split('@')[0];
        let userExists = await User.findOne({ username: tempUsername });
        
        // If username is taken, add random numbers
        while (userExists) {
          tempUsername = `${tempUsername}${Math.floor(100 + Math.random() * 900)}`;
          userExists = await User.findOne({ username: tempUsername });
        }
        // --- END OF FIX ---

        user = new User({
          name,
          email: lowerCaseEmail,
          username: tempUsername, // <-- SET THE GENERATED USERNAME
          googleId,
          kycStatus: 'Verified',
        });
        await user.save();
      }
    }

    // Generate our token for them
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      token: jwtToken,
      user: user.toJSON(),
    });

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Google Authentication failed' });
  }
});


// @route   POST /api/auth/forgotpassword
// @desc    Send a password reset email
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({ msg: 'Email sent (if user exists)' });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const htmlMessage = getResetPasswordHTML(resetUrl);
    await sendEmail({
      email: user.email,
      subject: 'LegalEase - Password Reset Request',
      html: htmlMessage,
    });
    res.status(200).json({ msg: 'Email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/auth/resetpassword/:token
// @desc    Reset password using the token
router.put('/resetpassword/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save(); // pre-save hook will hash this
    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;