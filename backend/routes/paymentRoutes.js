const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Case = require("../models/Case");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Platform settings
const PLATFORM_SETTINGS = {
  defaultCommissionRate: 20,
  gstRate: 18,
  releaseDelayDays: 7, // Days after resolution before payment can be released
  advancePercentage: 30,
};

// @route   GET /api/payments/settings
// @desc    Get platform payment settings
router.get("/settings", (req, res) => {
  res.json(PLATFORM_SETTINGS);
});

// @route   GET /api/payments/lawyer
// @desc    Get all payments for a lawyer
router.get("/lawyer", protect, async (req, res) => {
  try {
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const payments = await Payment.find({ lawyer: req.user._id })
      .populate("case", "title caseId status caseType resolvedAt")
      .populate("citizen", "name email")
      .sort({ createdAt: -1 });

    // Calculate summary
    const summary = {
      totalEarnings: 0,
      pendingRelease: 0,
      released: 0,
      casesCompleted: 0,
      avgCommissionRate: 0,
    };

    let totalCommissionRate = 0;
    payments.forEach((payment) => {
      summary.totalEarnings += payment.lawyerEarnings;
      if (payment.status === "to-be-released") {
        summary.pendingRelease += payment.lawyerEarnings;
      }
      if (payment.status === "released") {
        summary.released += payment.lawyerEarnings;
        summary.casesCompleted++;
      }
      totalCommissionRate += payment.commissionRate;
    });

    if (payments.length > 0) {
      summary.avgCommissionRate = (
        totalCommissionRate / payments.length
      ).toFixed(1);
    }

    res.json({ payments, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/payments/citizen
// @desc    Get all payments/invoices for a citizen
router.get("/citizen", protect, async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const payments = await Payment.find({ citizen: req.user._id })
      .populate("case", "title caseId status caseType")
      .populate("lawyer", "name email")
      .sort({ createdAt: -1 });

    // Calculate summary
    const summary = {
      totalPaid: 0,
      pendingPayment: 0,
      advancePaid: 0,
      casesCount: payments.length,
    };

    payments.forEach((payment) => {
      if (payment.advancePaid) {
        summary.advancePaid += payment.advanceAmount;
        summary.totalPaid += payment.advanceAmount;
      }
      if (
        payment.status === "released" ||
        payment.status === "to-be-released"
      ) {
        summary.totalPaid += payment.remainingAmount;
      } else if (payment.advancePaid) {
        summary.pendingPayment += payment.remainingAmount;
      } else {
        summary.pendingPayment += payment.totalAmount;
      }
    });

    res.json({ payments, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ========== SUBSCRIPTION ROUTES (must be before /:paymentId) ==========

// @route   GET /api/payments/subscription/plans
// @desc    Get all subscription plans
router.get("/subscription/plans", (req, res) => {
  const plans = ["free", "basic", "professional", "enterprise"].map((plan) =>
    Subscription.getPlanDetails(plan)
  );
  res.json(plans);
});

// @route   GET /api/payments/subscription/my
// @desc    Get current user's subscription
router.get("/subscription/my", protect, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      // Create free subscription for lawyers
      if (req.user.role === "lawyer") {
        const freePlan = Subscription.getPlanDetails("free");
        subscription = new Subscription({
          user: req.user._id,
          plan: "free",
          status: "active",
          maxCasesPerMonth: freePlan.maxCasesPerMonth,
          commissionRate: freePlan.commissionRate,
          priorityListing: freePlan.priorityListing,
          price: 0,
        });
        await subscription.save();
      }
    }

    const planDetails = Subscription.getPlanDetails(
      subscription?.plan || "free"
    );

    res.json({
      subscription,
      planDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/payments/subscription/upgrade
// @desc    Upgrade subscription plan
router.post("/subscription/upgrade", protect, async (req, res) => {
  try {
    const { plan, transactionId, paymentMethod } = req.body;

    if (!["basic", "professional", "enterprise"].includes(plan)) {
      return res.status(400).json({ msg: "Invalid plan" });
    }

    const planDetails = Subscription.getPlanDetails(plan);
    let subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      subscription = new Subscription({ user: req.user._id });
    }

    subscription.plan = plan;
    subscription.status = "active";
    subscription.maxCasesPerMonth = planDetails.maxCasesPerMonth;
    subscription.commissionRate = planDetails.commissionRate;
    subscription.priorityListing = planDetails.priorityListing;
    subscription.price = planDetails.price;
    subscription.startDate = new Date();
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    subscription.lastPaymentId = transactionId;
    subscription.lastPaymentDate = new Date();

    await subscription.save();

    res.json({
      subscription,
      planDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ========== END SUBSCRIPTION ROUTES ==========

// @route   GET /api/payments/:paymentId
// @desc    Get payment details with full breakdown
router.get("/:paymentId", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId })
      .populate("case", "title caseId status caseType resolvedAt description")
      .populate("citizen", "name email phone")
      .populate("lawyer", "name email phone");

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    // Check authorization
    if (
      payment.citizen._id.toString() !== req.user._id.toString() &&
      payment.lawyer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Get full breakdown
    const breakdown = payment.calculateBreakdown();

    res.json({
      payment,
      breakdown,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/payments/create
// @desc    Create a payment for a case
router.post("/create", protect, async (req, res) => {
  try {
    const { caseId, totalAmount } = req.body;

    const caseDoc = await Case.findById(caseId).populate("lawyer");
    if (!caseDoc) {
      return res.status(404).json({ msg: "Case not found" });
    }

    if (!caseDoc.lawyer) {
      return res.status(400).json({ msg: "Case must have an assigned lawyer" });
    }

    // Check if payment already exists
    if (caseDoc.payment) {
      return res
        .status(400)
        .json({ msg: "Payment already exists for this case" });
    }

    // Get lawyer's subscription for commission rate
    let commissionRate = PLATFORM_SETTINGS.defaultCommissionRate;
    const subscription = await Subscription.findOne({
      user: caseDoc.lawyer._id,
    });
    if (subscription && subscription.status === "active") {
      commissionRate = subscription.commissionRate;
    }

    // Calculate amounts
    const advancePercentage = PLATFORM_SETTINGS.advancePercentage;
    const advanceAmount = Math.round((totalAmount * advancePercentage) / 100);
    const commissionAmount = Math.round((totalAmount * commissionRate) / 100);
    const gstAmount = Math.round(
      (commissionAmount * PLATFORM_SETTINGS.gstRate) / 100
    );
    const lawyerEarnings = totalAmount - commissionAmount - gstAmount;

    const payment = new Payment({
      case: caseDoc._id,
      citizen: caseDoc.user,
      lawyer: caseDoc.lawyer._id,
      totalAmount,
      advanceAmount,
      commissionRate,
      commissionAmount,
      gstAmount,
      lawyerEarnings,
      status: "pending",
    });

    await payment.save();

    // Update case with payment reference
    caseDoc.payment = payment._id;
    caseDoc.amount = totalAmount;
    caseDoc.advanceAmount = advanceAmount;
    await caseDoc.save();

    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/payments/:paymentId/pay-advance
// @desc    Mark advance as paid
router.post("/:paymentId/pay-advance", protect, async (req, res) => {
  try {
    const { transactionId, paymentMethod } = req.body;

    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    if (payment.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (payment.advancePaid) {
      return res.status(400).json({ msg: "Advance already paid" });
    }

    payment.advancePaid = true;
    payment.advancePaidDate = new Date();
    payment.status = "advance-paid";
    payment.transactions.push({
      type: "advance",
      amount: payment.advanceAmount,
      transactionId: transactionId || `TXN-${Date.now()}`,
      paymentMethod: paymentMethod || "upi",
      status: "success",
    });

    await payment.save();

    // Update case
    const caseDoc = await Case.findById(payment.case);
    if (caseDoc) {
      caseDoc.advancePaid = true;
      caseDoc.paymentStatus = "advance-paid";
      await caseDoc.save();
    }

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/payments/:paymentId/mark-resolved
// @desc    Mark payment for release when case is resolved
router.post("/:paymentId/mark-resolved", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    if (payment.lawyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const caseDoc = await Case.findById(payment.case);
    if (!caseDoc || caseDoc.status !== "Resolved") {
      return res
        .status(400)
        .json({ msg: "Case must be marked as Resolved first" });
    }

    // Set release eligible date (7 days from now for dispute window)
    payment.status = "to-be-released";
    payment.releaseEligibleDate = new Date(
      Date.now() + PLATFORM_SETTINGS.releaseDelayDays * 24 * 60 * 60 * 1000
    );

    // Add final payment transaction
    payment.transactions.push({
      type: "final",
      amount: payment.remainingAmount,
      transactionId: `TXN-${Date.now()}`,
      paymentMethod: "platform",
      status: "success",
      notes: "Final payment upon case resolution",
    });

    // Generate invoice
    payment.generateInvoice();

    await payment.save();

    // Update case payment status
    caseDoc.paymentStatus = "completed";
    await caseDoc.save();

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/payments/:paymentId/release
// @desc    Release payment to lawyer (admin or auto after delay)
router.post("/:paymentId/release", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    if (payment.status !== "to-be-released") {
      return res.status(400).json({ msg: "Payment not eligible for release" });
    }

    // Check if release date has passed or admin is releasing
    const now = new Date();
    if (payment.releaseEligibleDate > now && req.user.role !== "admin") {
      return res.status(400).json({
        msg: `Payment will be released on ${payment.releaseEligibleDate.toLocaleDateString()}`,
      });
    }

    payment.status = "released";
    payment.releasedDate = new Date();
    payment.releasedBy = req.user._id;
    payment.transactions.push({
      type: "release",
      amount: payment.lawyerEarnings,
      transactionId: `REL-${Date.now()}`,
      paymentMethod: "bank_transfer",
      status: "success",
      notes: `Released to lawyer. Commission: ₹${payment.commissionAmount}`,
    });

    await payment.save();

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
