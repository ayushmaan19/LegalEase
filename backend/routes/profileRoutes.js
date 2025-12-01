const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const LawyerProfile = require('../models/LawyerProfile');
const User = require('../models/User');

// GET all profiles
router.get('/', protect, async (req, res) => {
  try {
    const profiles = await LawyerProfile.find()
      .populate('user', ['name', 'enrollmentNumber']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- THIS IS THE CRITICAL ROUTE ---
// @route   GET /api/profile/:id
// @desc    Get a single lawyer profile by its OWN ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const profile = await LawyerProfile.findById(req.params.id)
      .populate('user', ['name', 'enrollmentNumber', 'email', 'phone', 'kycStatus']);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});
// --- END OF NEW ROUTE ---

// GET logged-in user's profile
router.get('/me', protect, async (req, res) => {
  // ... (code)
});

// POST (create/update) profile
router.post('/', protect, async (req, res) => {
  // ... (code)
});

module.exports = router;