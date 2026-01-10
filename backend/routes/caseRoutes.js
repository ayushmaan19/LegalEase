// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const Case = require("../models/Case");
// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");
// const { getCaseAcceptedHTML } = require("../utils/emailTemplates");

// // @route   POST /api/cases
// // @desc    Create a new case
// // @access  Private (Citizen only)
// router.post("/", protect, async (req, res) => {
//   if (req.user.role !== "citizen") {
//     return res.status(403).json({ msg: "Only citizens can create cases" });
//   }
//   try {
//     const { title, description, caseType, language, amount } = req.body;
//     if (!title || !description || !caseType || !language) {
//       return res
//         .status(400)
//         .json({ msg: "Please fill out all required fields" });
//     }
//     const newCase = new Case({
//       user: req.user.id,
//       title,
//       description,
//       caseType,
//       language,
//       amount,
//     });
//     const savedCase = await newCase.save();
//     res.status(201).json(savedCase);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET /api/cases/mycases
// // @desc    Get all cases for the logged-in user (Citizen or Lawyer)
// // @access  Private
// router.get("/mycases", protect, async (req, res) => {
//   try {
//     let cases;
//     if (req.user.role === "citizen") {
//       cases = await Case.find({ user: req.user.id }).sort({ createdAt: -1 });
//     } else if (req.user.role === "lawyer") {
//       cases = await Case.find({ lawyer: req.user.id }).sort({ createdAt: -1 });
//     } else {
//       return res.status(403).json({ msg: "User role not authorized" });
//     }
//     res.json(cases);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET /api/cases/pending
// // @desc    Get all pending cases (for lawyers to browse)
// // @access  Private (Lawyer only)
// router.get("/pending", protect, async (req, res) => {
//   if (req.user.role !== "lawyer") {
//     return res.status(403).json({ msg: "User is not a lawyer" });
//   }
//   try {
//     const cases = await Case.find({
//       status: "Pending",
//       lawyer: null,
//     }).sort({ createdAt: -1 });
//     res.json(cases);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   PUT /api/cases/accept/:id
// // @desc    Accept a pending case
// // @access  Private (Lawyer only)
// router.put("/accept/:id", protect, async (req, res) => {
//   if (req.user.role !== "lawyer") {
//     return res.status(403).json({ msg: "User is not a lawyer" });
//   }
//   try {
//     const caseToAccept = await Case.findById(req.params.id).populate("user");
//     if (!caseToAccept) {
//       return res.status(404).json({ msg: "Case not found" });
//     }
//     if (caseToAccept.status !== "Pending" || caseToAccept.lawyer) {
//       return res.status(400).json({ msg: "Case is no longer available" });
//     }
//     caseToAccept.lawyer = req.user.id;
//     caseToAccept.status = "Assigned";
//     await caseToAccept.save();

//     // Send notification email
//     if (caseToAccept.user && caseToAccept.user.email) {
//       const citizenEmail = caseToAccept.user.email;
//       const caseTitle = caseToAccept.title;
//       const lawyerName = req.user.name;
//       const htmlMessage = getCaseAcceptedHTML(caseTitle, lawyerName);
//       await sendEmail({
//         email: citizenEmail,
//         subject: `Your Case "${caseTitle}" Has Been Accepted!`,
//         html: htmlMessage,
//       });
//     }
//     res.json(caseToAccept);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   PUT /api/cases/decline/:id
// // @desc    Decline a pending case
// // @access  Private (Lawyer only)
// router.put("/decline/:id", protect, async (req, res) => {
//   if (req.user.role !== "lawyer") {
//     return res.status(403).json({ msg: "User is not a lawyer" });
//   }
//   try {
//     // We just confirm it was "declined"
//     console.log(`Lawyer ${req.user.id} declined case ${req.params.id}`);
//     res.status(200).json({ msg: "Case declined" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });
// router.put("/start/:id", protect, async (req, res) => {
//   if (req.user.role !== "lawyer") {
//     return res.status(403).json({ msg: "User is not a lawyer" });
//   }
//   try {
//     const caseToStart = await Case.findOne({
//       _id: req.params.id,
//       lawyer: req.user.id, // Make sure they own this case
//     });

//     if (!caseToStart) {
//       return res
//         .status(404)
//         .json({ msg: "Case not found or not assigned to you" });
//     }
//     // Only allow starting if it's 'Assigned'
//     if (caseToStart.status !== "Assigned") {
//       return res.status(400).json({ msg: "Case is not in Assigned state" });
//     }

//     caseToStart.status = "In Progress";
//     await caseToStart.save();
//     res.json(caseToStart); // Send back the updated case
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   PUT /api/cases/complete/:id
// // @desc    Mark an assigned case as 'Resolved'
// // @access  Private (Lawyer only)
// router.put("/complete/:id", protect, async (req, res) => {
//   if (req.user.role !== "lawyer") {
//     return res.status(403).json({ msg: "User is not a lawyer" });
//   }
//   try {
//     const caseToComplete = await Case.findOne({
//       _id: req.params.id,
//       lawyer: req.user.id,
//     });
//     if (!caseToComplete) {
//       return res
//         .status(404)
//         .json({ msg: "Case not found or not assigned to you" });
//     }
//     caseToComplete.status = "Resolved";
//     await caseToComplete.save();
//     res.json(caseToComplete);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });
// router.get('/conversations', protect, async (req, res) => {
//   if (req.user.role !== 'lawyer') {
//     return res.status(403).json({ msg: 'User is not a lawyer' });
//   }
//   try {
//     // Find cases assigned to this lawyer that are active
//     const cases = await Case.find({
//       lawyer: req.user.id,
//       status: { $in: ['Assigned', 'In Progress'] } // Only show active chats
//     })
//     .sort({ updatedAt: -1 }) // Show most recently active first
//     .populate('user', 'name'); // <-- This is key. We get the citizen's name.

//     res.json(cases);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Case = require("../models/Case");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const sendEmail = require("../utils/sendEmail");
const { getCaseAcceptedHTML } = require("../utils/emailTemplates");

// @route   POST /api/cases
// @desc    Create a new case
// @access  Private (Citizen only)
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "citizen") {
    return res.status(403).json({ msg: "Only citizens can create cases" });
  }
  try {
    const { title, description, caseType, language, amount } = req.body;
    if (!title || !description || !caseType || !language) {
      return res
        .status(400)
        .json({ msg: "Please fill out all required fields" });
    }
    const newCase = new Case({
      user: req.user.id,
      title,
      description,
      caseType,
      language,
      amount,
    });
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/cases/mycases
// @desc    Get all cases for the logged-in user (Citizen or Lawyer)
// @access  Private
router.get("/mycases", protect, async (req, res) => {
  try {
    let cases;
    if (req.user.role === "citizen") {
      // --- THIS IS THE FIX ---
      // We must populate the lawyer's name
      cases = await Case.find({ user: req.user.id })
        .populate("lawyer", "name") // <-- ADD THIS
        .sort({ createdAt: -1 });
      // --- END OF FIX ---
    } else if (req.user.role === "lawyer") {
      // For the lawyer, we populate the citizen's name
      cases = await Case.find({ lawyer: req.user.id })
        .populate("user", "name") // <-- ADD THIS
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ msg: "User role not authorized" });
    }
    res.json(cases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/cases/pending
// @desc    Get all pending cases (for lawyers to browse)
// @access  Private (Lawyer only)
router.get("/pending", protect, async (req, res) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ msg: "User is not a lawyer" });
  }
  try {
    const cases = await Case.find({
      status: "Pending",
      lawyer: null,
    }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/cases/accept/:id
// @desc    Accept a pending case
// @access  Private (Lawyer only)
router.put("/accept/:id", protect, async (req, res) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ msg: "User is not a lawyer" });
  }
  try {
    const caseToAccept = await Case.findById(req.params.id).populate("user");
    if (!caseToAccept) {
      return res.status(404).json({ msg: "Case not found" });
    }
    if (caseToAccept.status !== "Pending" || caseToAccept.lawyer) {
      return res.status(400).json({ msg: "Case is no longer available" });
    }
    caseToAccept.lawyer = req.user.id;
    caseToAccept.status = "Assigned";
    await caseToAccept.save();

    // Send notification email
    if (caseToAccept.user && caseToAccept.user.email) {
      const citizenEmail = caseToAccept.user.email;
      const caseTitle = caseToAccept.title;
      const lawyerName = req.user.name;
      const htmlMessage = getCaseAcceptedHTML(caseTitle, lawyerName);
      await sendEmail({
        email: citizenEmail,
        subject: `Your Case "${caseTitle}" Has Been Accepted!`,
        html: htmlMessage,
      });
    }
    res.json(caseToAccept);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/cases/decline/:id
// @desc    Decline a pending case
// @access  Private (Lawyer only)
router.put("/decline/:id", protect, async (req, res) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ msg: "User is not a lawyer" });
  }
  try {
    console.log(`Lawyer ${req.user.id} declined case ${req.params.id}`);
    res.status(200).json({ msg: "Case declined" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/cases/start/:id
// @desc    Mark an assigned case as 'In Progress'
// @access  Private (Lawyer only)
router.put("/start/:id", protect, async (req, res) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ msg: "User is not a lawyer" });
  }
  try {
    const caseToStart = await Case.findOne({
      _id: req.params.id,
      lawyer: req.user.id,
    });
    if (!caseToStart) {
      return res
        .status(404)
        .json({ msg: "Case not found or not assigned to you" });
    }
    if (caseToStart.status !== "Assigned") {
      return res.status(400).json({ msg: "Case is not in Assigned state" });
    }

    // Use findOneAndUpdate to avoid validation on existing fields
    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id, lawyer: req.user.id },
      { $set: { status: "In Progress" } },
      { new: true, runValidators: false }
    );

    res.json(updatedCase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/cases/complete/:id
// @desc    Mark an assigned case as 'Resolved' and create payment record
// @access  Private (Lawyer only)
router.put("/complete/:id", protect, async (req, res) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ msg: "User is not a lawyer" });
  }
  try {
    const caseToComplete = await Case.findOne({
      _id: req.params.id,
      lawyer: req.user.id,
    });
    if (!caseToComplete) {
      return res
        .status(404)
        .json({ msg: "Case not found or not assigned to you" });
    }

    // Use findOneAndUpdate to avoid validation on existing fields
    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id, lawyer: req.user.id },
      { $set: { status: "Resolved", resolvedAt: new Date() } },
      { new: true, runValidators: false }
    );

    // Create payment record if case has an amount
    // Parse the amount - handle both number and string formats
    let caseAmount = 0;
    console.log(
      "Case amount raw:",
      caseToComplete.amount,
      "Type:",
      typeof caseToComplete.amount
    );

    if (caseToComplete.amount) {
      if (typeof caseToComplete.amount === "number") {
        caseAmount = caseToComplete.amount;
      } else if (typeof caseToComplete.amount === "string") {
        // Handle string formats like "₹under-5000", "₹150000+"
        const amountStr = caseToComplete.amount.replace(/[₹,]/g, "");
        if (amountStr.includes("under")) {
          caseAmount = 5000; // Default for "under X"
        } else if (amountStr.includes("+")) {
          caseAmount =
            parseInt(amountStr.replace("+", "").replace(/\D/g, "")) || 150000;
        } else {
          caseAmount = parseInt(amountStr.replace(/\D/g, "")) || 0;
        }
      }
    }

    // If no amount set, use a default for testing (can be removed in production)
    if (caseAmount === 0) {
      caseAmount = 10000; // Default ₹10,000 for cases without amount
    }

    console.log("Parsed case amount:", caseAmount);

    // Check if payment already exists for this case
    const existingPayment = await Payment.findOne({ case: req.params.id });
    console.log("Existing payment:", existingPayment ? "Yes" : "No");

    if (!existingPayment) {
      // Get lawyer's subscription to determine commission rate
      let commissionRate = 20; // Default 20% for free tier
      const subscription = await Subscription.findOne({
        user: req.user.id,
        status: "active",
      });
      if (subscription) {
        commissionRate = subscription.commissionRate;
      }
      console.log("Commission rate:", commissionRate);

      // Calculate payment breakdown
      const advancePercentage = 30;
      const advanceAmount = Math.round(caseAmount * (advancePercentage / 100));
      const remainingAmount = caseAmount - advanceAmount;
      const commissionAmount = Math.round(caseAmount * (commissionRate / 100));
      const gstRate = 18;
      const gstAmount = Math.round(commissionAmount * (gstRate / 100));
      const lawyerEarnings = caseAmount - commissionAmount - gstAmount;

      console.log("Creating payment with earnings:", lawyerEarnings);

      // Create payment record
      const payment = new Payment({
        case: req.params.id,
        citizen: caseToComplete.user,
        lawyer: req.user.id,
        totalAmount: caseAmount,
        advanceAmount: advanceAmount,
        advancePaid: false,
        remainingAmount: remainingAmount,
        commissionRate: commissionRate,
        commissionAmount: commissionAmount,
        lawyerEarnings: lawyerEarnings,
        gstRate: gstRate,
        gstAmount: gstAmount,
        status: "to-be-released",
        releaseEligibleDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });

      await payment.save();
      console.log("Payment created with ID:", payment._id);

      // Link payment to case
      await Case.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { payment: payment._id, paymentStatus: "to-be-released" } },
        { runValidators: false }
      );
    }

    res.json(updatedCase);
  } catch (err) {
    console.error("Error completing case:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/conversations", protect, async (req, res) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ msg: "User is not a lawyer" });
  }
  try {
    const cases = await Case.find({
      lawyer: req.user.id,
      status: { $in: ["Assigned", "In Progress"] },
    })
      .sort({ updatedAt: -1 })
      .populate("user", "name"); // <-- Must have .populate()

    res.json(cases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
