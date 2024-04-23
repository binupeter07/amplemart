const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

// Function to generate a simple 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
};

const sendOTPMail = async (send_to, reply_to) => {
  const otp = generateOTP(); // Generate OTP

  const storedOTPs = {};
  storedOTPs[send_to] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

  // Set up transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "Amplemart App",
      link: "https://amplemart.app",
    },
  });

  // Define email content
  const emailBody = {
    body: {
      name: send_to,
      intro:
        "Welcome to Amplemart App! Please use the following code to verify your email:",
      table: {
        data: [
          {
            "Your Verification Code": otp, // Display the OTP directly
          },
        ],
        columns: {
          // Optionally define column widths
          customWidth: {
            "Your Verification Code": "20%",
          },
          // Center the OTP
          customAlignment: {
            "Your Verification Code": "center",
          },
        },
      },
      outro:
        "This code will expire in 10 minutes. If you did not request this verification, please ignore this email.",
    },
  };

  const emailTemplate = mailGenerator.generate(emailBody);
  require("fs").writeFileSync("preview.html", emailTemplate, "utf8");

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: send_to,
    subject: "Email Verification for Amplemart App",
    html: emailTemplate,
    replyTo: reply_to,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error; 
  }
};

module.exports = sendOTPMail;
