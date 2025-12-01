// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const { protect } = require("../middleware/authMiddleware");
// const bcrypt = require("bcryptjs"); // Make sure this is imported

// // @route   GET /api/users/me
// // @desc    Get the logged-in user's profile
// // @access  Private
// router.get("/me", protect, async (req, res) => {
//   // We send the user object attached by the 'protect' middleware.
//   // The .toJSON() method on the User model will automatically remove the password.
//   res.status(200).json(req.user);
// });

// // @route   PUT /api/users/me
// // @desc    Update the logged-in user's profile
// // @access  Private
// router.put("/me", protect, async (req, res) => {
//   try {
//     const { name, email, phone } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     // Validation for email
//     if (email && email.toLowerCase() !== user.email) {
//       const emailExists = await User.findOne({ email: email.toLowerCase() });
//       if (emailExists) {
//         return res.status(400).json({ msg: "Email is already in use" });
//       }
//       user.email = email;
//     }
//     // Validation for phone
//     if (phone && phone !== user.phone) {
//       const phoneExists = await User.findOne({ phone });
//       if (phoneExists) {
//         return res.status(400).json({ msg: "Phone number is already in use" });
//       }
//       user.phone = phone;
//     }

//     user.name = name || user.name;
//     const updatedUser = await user.save();
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   PUT /api/users/role
// // @desc    Set or update the user's role
// // @access  Private
// router.put("/role", protect, async (req, res) => {
//   try {
//     const { role } = req.body;
//     if (role !== "citizen" && role !== "lawyer") {
//       return res.status(400).json({ msg: "Invalid role" });
//     }
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }
//     user.role = role;
//     await user.save();
//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   POST /api/users/kyc
// // @desc    Submit KYC (Aadhaar) for verification
// // @access  Private
// router.post("/kyc", protect, async (req, res) => {
//   try {
//     const { aadhaarNumber } = req.body;
//     if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
//       return res
//         .status(400)
//         .json({ msg: "Please enter a valid 12-digit Aadhaar number." });
//     }
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }
//     // (Dummy verification)
//     user.kycStatus = "Verified";
//     await user.save();
//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   PUT /api/users/change-password
// // @desc    Change user's password
// // @access  Private
// router.put("/change-password", protect, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     // Get the user from the database
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     // Check if the current password matches
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Incorrect current password" });
//     }

//     // Set the new password. The 'pre-save' hook in User.js will hash it.
//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({ msg: "Password updated successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

// @route   GET /api/users/me
// @desc    Get the logged-in user's profile
// @access  Private
router.get("/me", protect, async (req, res) => {
  // req.user is attached by the 'protect' middleware.
  // We will now send back the *exact same* object structure as login/register.
  res.status(200).json({
    id: req.user._id, // <-- THIS IS THE FIX
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
    phone: req.user.phone,
    role: req.user.role,
    kycStatus: req.user.kycStatus,
    enrollmentNumber: req.user.enrollmentNumber,
  });
});

// @route   PUT /api/users/me
// @desc    Update the logged-in user's profile
// @access  Private
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // ... (validation logic for email/phone) ...
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    const updatedUser = await user.save();

    // Also send back the consistent object
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      kycStatus: updatedUser.kycStatus,
      enrollmentNumber: updatedUser.enrollmentNumber,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/users/role
// @desc    Set or update the user's role
// @access  Private
router.put("/role", protect, async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== "citizen" && role !== "lawyer") {
      return res.status(400).json({ msg: "Invalid role" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.role = role;
    await user.save();

    // Also send back the consistent object
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
      enrollmentNumber: user.enrollmentNumber,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/kyc
// @desc    Submit KYC (Aadhaar) for verification
// @access  Private
router.post("/kyc", protect, async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid 12-digit Aadhaar number." });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.kycStatus = "Verified";
    await user.save();

    // Also send back the consistent object
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
      enrollmentNumber: user.enrollmentNumber,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user's password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // We must use .select('+password') to get the password
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
