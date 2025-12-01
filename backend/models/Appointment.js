const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Completed', 'Cancelled'],
    default: 'Available',
  },
  title: {
    type: String,
    default: 'Legal Consultation'
  }
}, {
  timestamps: true,
});


appointmentSchema.index({ lawyer: 1, startTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;