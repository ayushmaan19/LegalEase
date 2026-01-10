const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "basic", "professional", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },
    // Plan features
    maxCasesPerMonth: {
      type: Number,
      default: 3, // Free tier
    },
    commissionRate: {
      type: Number,
      default: 20, // 20% for free tier
    },
    priorityListing: {
      type: Boolean,
      default: false,
    },
    // Billing
    price: {
      type: Number,
      default: 0,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "lifetime"],
      default: "monthly",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    // Payment info
    lastPaymentId: {
      type: String,
    },
    lastPaymentDate: {
      type: Date,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get plan details
subscriptionSchema.statics.getPlanDetails = function (planName) {
  const plans = {
    free: {
      name: "Free",
      price: 0,
      maxCasesPerMonth: 3,
      commissionRate: 20,
      priorityListing: false,
      features: [
        "Up to 3 cases per month",
        "20% platform commission",
        "Basic profile listing",
        "Email support",
      ],
    },
    basic: {
      name: "Basic",
      price: 999,
      maxCasesPerMonth: 10,
      commissionRate: 15,
      priorityListing: false,
      features: [
        "Up to 10 cases per month",
        "15% platform commission",
        "Enhanced profile",
        "Priority email support",
      ],
    },
    professional: {
      name: "Professional",
      price: 2499,
      maxCasesPerMonth: 50,
      commissionRate: 10,
      priorityListing: true,
      features: [
        "Up to 50 cases per month",
        "10% platform commission",
        "Priority listing in search",
        "Verified badge",
        "Phone support",
      ],
    },
    enterprise: {
      name: "Enterprise",
      price: 4999,
      maxCasesPerMonth: -1, // Unlimited
      commissionRate: 5,
      priorityListing: true,
      features: [
        "Unlimited cases",
        "Only 5% platform commission",
        "Top priority listing",
        "Verified badge",
        "Dedicated account manager",
        "Custom branding",
      ],
    },
  };
  return plans[planName] || plans.free;
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
