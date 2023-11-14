import asyncHandler from "express-async-handler";
import ContactUsModel from "../models/contactus.model.js";
import responseHandle from "../utils/handleResponse.js";

const ContactUs = {};

ContactUs.create = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Contact Us']
  const { name, email, subject, message } = req.body;

  try {
    const messageTaken = await ContactUsModel.findOne({ message: message });
    if (messageTaken) {
      res.status(400);
      throw new Error("Message already sent");
    }

    const newMessages = await ContactUsModel.create({
      name: name,
      email: email.trim(),
      subject: subject,
      message: message,
    });

    if (!newMessages) {
      res.status(500);
      throw new Error("could not send message");
    }
    responseHandle.successResponse(
      res,
      201,
      "message sent successfully.",
      newMessages
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default ContactUs;
