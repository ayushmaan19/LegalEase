const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const User = require("../models/User");

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the logged-in user
// @access  Private
router.get("/conversations", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all unique rooms where this user has sent or received messages
    const messages = await Message.find({
      $or: [{ sender: userId }, { room: { $regex: userId } }],
    }).populate("sender", "name username picture");

    // Group messages by room and get the last message for each
    const roomsMap = new Map();

    for (const msg of messages) {
      const room = msg.room;
      if (
        !roomsMap.has(room) ||
        new Date(msg.createdAt) >
          new Date(roomsMap.get(room).lastMessage.createdAt)
      ) {
        roomsMap.set(room, {
          room,
          lastMessage: msg,
          lastMessageTime: msg.createdAt,
        });
      }
    }

    // Get the other participant for each room
    const conversations = [];
    for (const [room, data] of roomsMap) {
      // Room format is usually like "user1Id_user2Id" or similar
      const participants = room.split("_");
      const otherUserId = participants.find((id) => id !== userId);

      let otherUser = null;
      if (otherUserId) {
        otherUser = await User.findById(otherUserId).select(
          "name username picture role"
        );
      }

      conversations.push({
        room,
        otherUser: otherUser || { name: "Unknown User", username: "unknown" },
        lastMessage: data.lastMessage.message,
        lastMessageTime: data.lastMessageTime,
        lastMessageSender: data.lastMessage.sender,
      });
    }

    // Sort by most recent message
    conversations.sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

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
