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

    // Payment fields
    amount: {
      type: Number,
      default: 0,
    },
    advancePercentage: {
      type: Number,
      default: 30, // 30% advance
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    advancePaid: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "advance-paid", "completed", "refunded"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Pending",
    },

    // Resolution details
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
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

  // Calculate advance amount when amount is set
  if (this.isModified("amount") && this.amount > 0) {
    this.advanceAmount = Math.round(
      (this.amount * this.advancePercentage) / 100
    );
  }

  // Set resolved date when status changes to Resolved
  if (
    this.isModified("status") &&
    this.status === "Resolved" &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }

  next();
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
