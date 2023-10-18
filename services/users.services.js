/* eslint-disable no-undef */
import transporter from "../config/email.js";
import createWelcomeEmailTemplate from "./templates.services.js";

import dotenv from "dotenv";
dotenv.config();

// user email welcome services
export const sendWelcomeEmail = (to) => {
  // mail options
  const mailOptions = {
    from: `"Support Sondya" <${process.env.EMAIL_USERNAME}>`, // sender address
    to: to, // list of receivers
    subject: "Welcome Message", // Subject line
    html: createWelcomeEmailTemplate, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log(info.response);
      return info.response;
    }
  });
};

// user email forgotPassword services
export const sendForgotPasswordEmail = (to, verificationCode) => {
  // email template
  const forgotPasswordEmailTemplate = `
  <!DOCTYPE html>
<html>
<head>
  <title>Forgot Password Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    h1 {
      color: #333;
    }
    p {
      color: #777;
    }
    .logo {
      max-width: 150px;
      margin: 0 auto;
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <img
      class="logo"
      src="data:image/png;base64,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"
      alt="Sondya Logo"
    />
    <h1>Authentication Code</h1>
    <div>Hi ${to}</div>
    <p>
      The code below is your forgot password code
    </p>

    <div  
    style="font-weight: 700;
    font-size: 30px;
    letter-spacing: 0.6rem;
    font-family: sans-serif;">
  ${verificationCode}</div>
    <p>
      Best regards,<br />
      Sondya Support Team
    </p>
  </div>
</body>
</html>
  `;

  // mail options
  const mailOptions = {
    from: `"Support Sondya" <${process.env.EMAIL_USERNAME}>`, // sender address
    to: to, // list of receivers
    subject: "Code Message", // Subject line
    html: forgotPasswordEmailTemplate, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log(info.response);
      return info.response;
    }
  });
};
