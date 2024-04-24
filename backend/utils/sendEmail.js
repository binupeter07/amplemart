const nodemailer = require("nodemailer");
const MailGen = require("mailgen");
const fs = require('fs');
const dotenv = require("dotenv").config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Required environment variables are not set.");
  process.exit(1);
}

// Function to generate a simple 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPMail = async (send_to, reply_to) => {
  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "Amplemart App",
      link: "https://amplemart.app"
    },
  });

  const emailBody = {
    body: {
      name: send_to,
      intro: "Welcome to Amplemart App! Please use the following code to verify your email:",
      table: {
        data: [{ "Your Verification Code": otp }],
        columns: {
          customWidth: { "Your Verification Code": "20%" },
          customAlignment: { "Your Verification Code": "center" },
        },
      },
      outro: "This code will expire in 10 minutes. If you did not request this verification, please ignore this email.",
    },
  };

  const emailTemplate = mailGenerator.generate(emailBody);
  fs.writeFileSync("preview.html", emailTemplate, "utf8");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: send_to,
    subject: "Email Verification for Amplemart App",
    html: emailTemplate,
    replyTo: reply_to,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info);
    return otp; // Return OTP for storage or further handling
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

module.exports = { sendOTPMail };
