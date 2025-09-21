const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, content, isHtml = false) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Syca_Ecommerce" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      [isHtml ? "html" : "text"]: content,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

module.exports = sendEmail;
