const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

// Signup: generate OTP and send email
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "This email is already registered." });

    await Otp.destroy({ where: { email } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await Otp.create({ email, code: otp, expiresAt, password: hashedPassword });

    const otpEmail = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color:#4CAF50;">Welcome to Syca_Ecommerce!</h2>
        <p>We’re excited to have you on board.</p>
        <p style="font-size:16px;">Your One-Time Password (OTP) is:</p>
        <h1 style="color:#333; letter-spacing: 3px;">${otp}</h1>
        <p>This OTP will expire in <strong>5 minutes</strong>. Please use it to verify your email.</p>
        <p style="margin-top:20px;">Thanks for joining us,<br/>Syca_Ecommerce Team</p>
      </div>
    `;
    await sendEmail(email, "Verify your Syca_Ecommerce account", otpEmail, true);

    return res.json({ message: "Signup started. OTP sent to your email. Please verify to continue." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Signup failed. Please try again later." });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;
    const record = await Otp.findOne({ where: { email, code } });
    if (!record) return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    record.verified = true;
    await record.save();

    return res.json({ message: "Email verified successfully. You can now complete your signup." });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "OTP verification failed. Please try again." });
  }
};

// Complete signup
exports.completeSignup = async (req, res) => {
  try {
    const { email, terms_accepted, privacy_accepted, credit_consent } = req.body;

    const record = await Otp.findOne({ where: { email } });
    if (!record) return res.status(404).json({ message: "No OTP record found for this email." });
    if (!record.verified) return res.status(400).json({ message: "Email not verified. Please verify first." });

    const user = await User.create({
      email,
      password: record.password,
      isVerified: true,
      termsAccepted: terms_accepted,
      privacyAccepted: privacy_accepted,
      creditConsent: credit_consent,
    });

    await record.destroy();

    const welcomeEmail = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f1f1f1;">
        <h2 style="color:#2196F3;">🎉 Signup Successful</h2>
        <p>Hello <strong>${user.email}</strong>,</p>
        <p>Welcome to <strong>Syca_Ecommerce</strong>! Your account has been created successfully.</p>
        <p style="font-size:15px; color:#444;">
          Don’t forget to complete your profile to unlock full access — explore products, 
          track orders, and enjoy exclusive offers tailored for you.
        </p>
        <a href="https://syca-ecommerce.com/profile" 
           style="display:inline-block; margin-top:20px; padding:12px 20px; background:#2196F3; color:#fff; 
           text-decoration:none; border-radius:6px; font-weight:bold;">
           Complete Your Profile
        </a>
        <p style="margin-top:30px; font-size:14px; color:#666;">
          Thank you for choosing us,<br/>The Syca_Ecommerce Team
        </p>
      </div>
    `;
    await sendEmail(email, "Welcome to Syca_Ecommerce!", welcomeEmail, true);

    return res.json({
      message: "Signup successful. Welcome to Syca_Ecommerce! Don’t forget to complete your profile to get started.",
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return res.status(500).json({ error: "Signup completion failed. Please try again." });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });
    if (!user.isVerified) return res.status(400).json({ message: "Email not verified. Please verify first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

    const token = require("jsonwebtoken").sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
};
