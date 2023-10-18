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
