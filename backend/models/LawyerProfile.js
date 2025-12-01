const mongoose = require("mongoose");

const lawyerProfileSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      unique: true,
    },
    
    experience: {
      type: Number,
      required: [true, "Years of experience is required"],
    },
    specializations: {
      type: [String], 
      required: true,
      default: [],
    },
    languages: {
      type: [String],
      required: true,
      default: [],
    },

    bio: {
      type: String,
      maxLength: 500,
    },
    proBono: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

const LawyerProfile = mongoose.model("LawyerProfile", lawyerProfileSchema);

module.exports = LawyerProfile;
