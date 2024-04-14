const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const sendEmail = async (subject, htmlContent, send_to) => {
  try {
    // Create Email Transporter
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "amplemart07@gmail.com",
        pass: "qxph ckfc uvua fxcu",
      },
    });

    // Options for sending email
    const options = {
      from: "amplemart07@gmail.com",
      to: send_to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(options);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
