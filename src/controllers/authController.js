const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, kyc, otp } = require("../models");
const sendEmail = require("../utils/sendEmail");

// -------------------------
// Signup: generate OTP + email
// -------------------------
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    // Remove old OTP
    await Otp.destroy({ where: { email } });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save OTP
    await Otp.create({ email, code: otp, expiresAt, password: hashedPassword });

    // Email template
    const otpEmail = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color:#4CAF50;">Welcome to Syca_Ecommerce!</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#333; letter-spacing: 3px;">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    `;

    await sendEmail(email, "Verify your Syca_Ecommerce account", otpEmail, true);

    return res.json({
      message: "Signup started. OTP sent to your email. Please verify to continue.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Signup failed. Please try again later." });
  }
};

// -------------------------
// Verify OTP
// -------------------------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await Otp.findOne({ where: { email, code } });
    if (!record) return res.status(400).json({ message: "Invalid OTP." });

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    record.verified = true;
    await record.save();

    return res.json({ message: "Email verified successfully. You can now complete your signup." });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "OTP verification failed. Please try again." });
  }
};

// -------------------------
// Complete Signup
// -------------------------
exports.completeSignup = async (req, res) => {
  try {
    const { email, terms_accepted, privacy_accepted, credit_consent } = req.body;

    const record = await Otp.findOne({ where: { email } });
    if (!record) return res.status(404).json({ message: "No OTP record found for this email." });
    if (!record.verified) return res.status(400).json({ message: "Email not verified." });

    // Create user
    const user = await User.create({
      email,
      password: record.password,
      isVerified: true,
      termsAccepted: terms_accepted,
      privacyAccepted: privacy_accepted,
      creditConsent: credit_consent,
    });

    // Clean OTP
    await record.destroy();

    // JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send welcome email
    const welcomeEmail = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f1f1f1;">
        <h2>🎉 Signup Successful</h2>
        <p>Hello <strong>${user.email}</strong>, welcome to Syca_Ecommerce!</p>
      </div>
    `;
    await sendEmail(email, "Welcome to Syca_Ecommerce!", welcomeEmail, true);

    // Fetch user with KYC
    const fullUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Kyc, as: "kyc" }],
    });

    return res.json({
      message: "Signup successful. You are now logged in. Welcome to Syca_Ecommerce!",
      token,
      user: fullUser,
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return res.status(500).json({ error: "Signup completion failed. Please try again." });
  }
};

// -------------------------
// Login
// -------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Kyc, as: "kyc" }],
    });

    if (!user) return res.status(400).json({ message: "Invalid email or password." });
    if (!user.isVerified) return res.status(400).json({ message: "Email not verified." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Prepare safe response
    const userData = user.toJSON();
    delete userData.password;

    return res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
};
