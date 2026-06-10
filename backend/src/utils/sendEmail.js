const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 600px;
          margin: 20px auto;
          padding: 40px;
          border: 1px solid #f0f0f0;
          border-radius: 24px;
          background-color: #ffffff;
          color: #1a1a1a;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
        }
        .content {
          line-height: 1.6;
          text-align: center;
        }
        .otp-container {
          margin: 35px 0;
          padding: 25px;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border-radius: 16px;
          border: 1px dashed #c4b5fd;
        }
        .otp-code {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 12px;
          color: #4f46e5;
          margin: 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 13px;
          color: #6b7280;
          text-align: center;
        }
        .highlight {
          color: #4f46e5;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <span class="logo-text">CareerSync <span style="color: #6366f1;">AI</span></span>
        </div>
        <div class="content">
          <h2 style="margin-top: 0;">Password Reset Request</h2>
          <p>Hello <span class="highlight">${options.fullName}</span>,</p>
          <p>We received a request to reset your password. Use the verification code below to continue:</p>
          
          <div class="otp-container">
            <h1 class="otp-code">${options.otp}</h1>
          </div>
          
          <p style="font-size: 14px;">This code is valid for <span class="highlight">10 minutes</span>. For security, do not share this code with anyone.</p>
          <p style="font-size: 14px; color: #9ca3af;">If you didn't request this reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>Team CareerSync AI &bull; Smart Placement Solutions</p>
          <p>&copy; 2026 CareerSync AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `CareerSync AI <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject || "🔒 Your CareerSync AI Verification Code",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
