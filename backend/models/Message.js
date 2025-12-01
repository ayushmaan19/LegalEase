const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

  room: {
    type: String,
    required: true,
    index: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;