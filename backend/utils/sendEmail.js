const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMailContactUs = async (senderEmail, senderName, message) => {
  try {
    const htmlContent = `
    <html>
      <body>
        <h4>Message from ${senderName} </h4>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p>From ${senderEmail},</p>
          <p>Ample Mart</p>
      </body>
    </html>`;

    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: process.env.EMAIL_USER, // Your email address
      subject: 'Amplemart enquiry',
      text: 'From website', // Plain text body
      html: htmlContent // HTML body
    };

    const sent = await transporter.sendMail(mailOptions);
    return sent;
  } catch (error) {
    throw error;
  }
};
const sendEmail = async (subject, htmlContent, send_to) => {
  try {
    // Create Email Transporter
    // let transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: "amplemart07@gmail.com",
    //     pass: "qxph ckfc uvua fxcu",
    //   },
    // });

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

module.exports = { sendEmail, sendMailContactUs };
