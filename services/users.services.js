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
      src="https://www.sondya.com/logo/logo-side.png"
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

// send kyc email verifcation

export const sendKycEmailVerification = (to, verificationCode) => {
  // email template
  const kycEmailTemplate = `
  <!DOCTYPE html>
<html>
<head>
  <title>Kyc Verification Code</title>
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
      src="https://www.sondya.com/logo/logo-side.png"
      alt="Sondya Logo"
    />
    <h1>Kyc Code</h1>
    <div>Hi ${to}</div>
    <p>
      The code below is your kyc email verification code
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
    html: kycEmailTemplate, // html body
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
