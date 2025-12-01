const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const { startOfToday } = require('date-fns');

// @route   GET /api/appointments
// @desc    Get all appointments for the logged-in lawyer (for their own calendar)
// @access  Private (Lawyer only)
router.get('/', protect, async (req, res) => {
  if (req.user.role !== 'lawyer') {
    return res.status(403).json({ msg: 'User is not a lawyer' });
  }
  try {
    const appointments = await Appointment.find({ lawyer: req.user.id })
      .populate('citizen', 'name')
      .sort({ startTime: 'asc' });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/appointments
// @desc    Create a new availability slot
// @access  Private (Lawyer only)
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'lawyer') {
    return res.status(403).json({ msg: 'User is not a lawyer' });
  }
  try {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res.status(400).json({ msg: 'Please provide a start and end time' });
    }
    const newSlot = new Appointment({
      lawyer: req.user.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'Available',
    });
    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE 1 ---
// @route   GET /api/appointments/lawyer/:lawyerId
// @desc    Get all *available* slots for a *specific* lawyer
// @access  Private (Any logged-in user can see)
router.get('/lawyer/:lawyerId', protect, async (req, res) => {
  try {
    const slots = await Appointment.find({
      lawyer: req.params.lawyerId,
      status: 'Available',
      startTime: { $gte: startOfToday() } // Only show future slots
    }).sort({ startTime: 'asc' });
    
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE 2 ---
// @route   PUT /api/appointments/book/:id
// @desc    Book an available slot
// @access  Private (Citizen only)
router.put('/book/:id', protect, async (req, res) => {
  if (req.user.role !== 'citizen') {
    return res.status(403).json({ msg: 'Only citizens can book appointments' });
  }
  try {
    const slot = await Appointment.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ msg: 'Appointment slot not found' });
    }
    if (slot.status !== 'Available') {
      return res.status(400).json({ msg: 'This slot is no longer available' });
    }

    // Book the slot
    slot.citizen = req.user.id;
    slot.status = 'Booked';
    slot.title = `Consultation with ${req.user.name}`; // Update title
    
    await slot.save();

    // TODO: Send an email notification to the lawyer

    res.json(slot); // Send back the updated, booked slot
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;