const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Case title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Case description is required"],
    },
    caseId: {
      type: String,
      unique: true,
    },
    caseType: {
      type: String,
      required: [true, "Case type is required"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },

    amount: {
      type: String,
      default: "N/A",
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true, 
  }
);


caseSchema.pre("save", async function (next) {
  if (this.isNew) {
    const randomId = Math.floor(10000000 + Math.random() * 90000000);
    this.caseId = `LE-${randomId}`;
  }
  next();
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
