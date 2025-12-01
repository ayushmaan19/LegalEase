const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");

// @route   GET /api/messages/:room
// @desc    Get chat history for a room
// @access  Private
router.get("/:room", protect, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .populate("sender", "name username") // Get sender's name and username
      .sort({ createdAt: "asc" }); // Get oldest messages first

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
