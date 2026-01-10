const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // References
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment ID for tracking
    paymentId: {
      type: String,
      unique: true,
    },

    // Amount breakdown
    totalAmount: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    advancePaid: {
      type: Boolean,
      default: false,
    },
    advancePaidDate: {
      type: Date,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },

    // Commission breakdown
    commissionRate: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    lawyerEarnings: {
      type: Number,
      required: true,
    },

    // GST (18% on commission for compliance)
    gstRate: {
      type: Number,
      default: 18,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },

    // Payment status
    status: {
      type: String,
      enum: [
        "pending", // Initial state
        "advance-paid", // Advance received
        "in-progress", // Case ongoing
        "to-be-released", // Case resolved, awaiting release
        "released", // Payment released to lawyer
        "disputed", // Payment dispute
        "refunded", // Refund issued
        "cancelled", // Payment cancelled
      ],
      default: "pending",
    },

    // Release tracking
    releaseEligibleDate: {
      type: Date, // Date when payment can be released (e.g., 7 days after resolution)
    },
    releasedDate: {
      type: Date,
    },
    releasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Transaction details
    transactions: [
      {
        type: {
          type: String,
          enum: ["advance", "final", "refund", "release"],
        },
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        transactionId: String,
        paymentMethod: {
          type: String,
          enum: ["upi", "card", "netbanking", "wallet", "cod"],
        },
        status: {
          type: String,
          enum: ["pending", "success", "failed"],
        },
        notes: String,
      },
    ],

    // Invoice details
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    invoiceDate: {
      type: Date,
    },
    invoiceUrl: {
      type: String,
    },

    // Notes
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate payment ID before saving
paymentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.paymentId = `PAY-${timestamp}-${randomStr}`;

    // Calculate remaining amount
    this.remainingAmount = this.totalAmount - this.advanceAmount;
  }
  next();
});

// Generate invoice number
paymentSchema.methods.generateInvoice = function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  this.invoiceNumber = `INV-${year}${month}-${random}`;
  this.invoiceDate = date;
  return this.invoiceNumber;
};

// Calculate breakdown
paymentSchema.methods.calculateBreakdown = function () {
  const commissionAmount = (this.totalAmount * this.commissionRate) / 100;
  const gstOnCommission = (commissionAmount * this.gstRate) / 100;
  const lawyerEarnings = this.totalAmount - commissionAmount - gstOnCommission;

  return {
    totalAmount: this.totalAmount,
    advanceAmount: this.advanceAmount,
    remainingAmount: this.remainingAmount,
    commissionRate: this.commissionRate,
    commissionAmount: commissionAmount,
    gstRate: this.gstRate,
    gstAmount: gstOnCommission,
    platformFee: commissionAmount + gstOnCommission,
    lawyerEarnings: lawyerEarnings,
  };
};

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
