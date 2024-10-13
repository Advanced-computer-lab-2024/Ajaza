const nodemailer = require("nodemailer");

// Setup email transporter using Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});

// Send OTP email function
exports.sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.NODE_MAILER_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your One-Time Password (OTP) for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};
