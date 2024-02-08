import asyncHandler from "express-async-handler";
import randomstring from "randomstring";
import UserModel from "../../models/users.model.js";
import { sendKycEmailVerification } from "../../services/users.services.js";
import { deleteUploads } from "../../utils/deleteupload.js";
import responseHandle from "../../utils/handleResponse.js";
import handleUpload from "../../utils/upload.js";

const kyc = {};

kyc.verifyEmail = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']
  const { email } = req.body;

  try {
    const exists = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!exists) {
      res.status(400);
      throw new Error("You are not a registered user");
    }

    // Generate a 4-digit verification code
    const verificationCode = randomstring.generate({
      length: 4,
      charset: "numeric",
    });

    const message = sendKycEmailVerification(email.trim(), verificationCode);

    const filter = { email: email.trim() };
    const update = { forgot_password_code: verificationCode };
    const updateCode = await UserModel.findOneAndUpdate(filter, update);
    if (!updateCode) {
      res.status(400);
      throw new Error("The code was not added. Please try again");
    }

    responseHandle.successResponse(
      res,
      "200",
      "Message sent! Please check spam if you didn't recieve the message",
      {
        message: message,
        email: exists.email.trim(),
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

kyc.verifyCode = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']

  const { code } = req.body;

  try {
    // check if code is empty
    if (!code) {
      res.status(400);
      throw new Error("Code is required");
    }
    // check if id exist
    const exists = await UserModel.findById(req.params.id);

    // check if email exist
    if (!exists) {
      res.status(400);
      throw new Error("You are not a registered user");

      // check if codes match
    } else if (code.trim() !== exists.forgot_password_code) {
      res.status(400);
      throw new Error("Codes dont match");
    } else {
      exists.email_verified = true;
      await exists.save();
    }

    responseHandle.successResponse(res, "200", "email verified successfully", {
      email: exists.email.trim(),
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

kyc.updatePersonalInfo = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']
  const check = await UserModel.findById(req.params.id);
  const { first_name, last_name, gender, marital_status, date_of_birth } =
    req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        marital_status: marital_status,
        date_of_birth: date_of_birth,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      responseHandle.successResponse(
        res,
        201,
        "personal info updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

kyc.updateContactInfo = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']
  const check = await UserModel.findById(req.params.id);
  const { address, phone_number, city, state, country } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        address: address,
        phone_number: phone_number,
        city: city,
        state: state,
        country: country,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      responseHandle.successResponse(
        res,
        201,
        "contact information updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

kyc.updateCompanyDetails = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']
  const check = await UserModel.findById(req.params.id);
  const { company_details } = req.body;
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        company_details: company_details !== undefined && company_details,
        kyc_completed: true,
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      responseHandle.successResponse(
        res,
        201,
        "company details updated successfully.",
        updatedUser
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

kyc.updateIdentificationDoc = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']
  const check = await UserModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    // start of upload images
    let imageUrl;

    // if (req.files.length) {
    if (req?.files) {
      // upload images to cloudinary
      let files = req?.files;
      let multiplePicturePromise = files.map(async (picture, index) => {
        // eslint-disable-next-line no-undef
        const b64 = Buffer.from(picture.buffer).toString("base64");
        let dataURI = "data:" + picture.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI, index);
        return cldRes;
      });

      // delete previously uploaded images from cloudinary
      const initialImageArray = [];
      check.id_document.forEach((image) => {
        initialImageArray.push(image.public_id);
      });
      deleteUploads(initialImageArray);

      // get url of uploaded images
      const imageResponse = await Promise.all(multiplePicturePromise);

      imageUrl = imageResponse.map((image) => {
        const url = image.secure_url;
        const public_id = image.public_id;
        const folder = image.folder;
        return { url, public_id, folder };
      });
    }
    // end of uploaded images

    // check if no image
    if (
      imageUrl === undefined &&
      req?.files === undefined &&
      check.id_document <= 0
    ) {
      res.status(400);
      throw new Error("No image uploaded for identification document");
    }

    // update user
    if (imageUrl !== undefined && req?.files.length > 0) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          id_document: imageUrl !== undefined && imageUrl,
        },
        {
          new: true,
        }
      );

      responseHandle.successResponse(
        res,
        201,
        "identification document updated successfully.",
        updatedUser
      );
    }

    responseHandle.successResponse(
      res,
      201,
      "identification document updated successfully.",
      "image"
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

kyc.updateProfileDp = asyncHandler(async (req, res) => {
  // #swagger.tags = ['kyc']
  const check = await UserModel.findById(req.params.id);
  try {
    if (!check) {
      res.status(404);
      throw new Error("Id not found");
    }

    // start of upload images
    let imageUrl;

    if (req.files.length) {
      // upload images to cloudinary
      let files = req?.files;
      let multiplePicturePromise = files.map(async (picture, index) => {
        // eslint-disable-next-line no-undef
        const b64 = Buffer.from(picture.buffer).toString("base64");
        let dataURI = "data:" + picture.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI, index);
        return cldRes;
      });

      // delete previously uploaded images from cloudinary
      const initialImageArray = [];
      check.image.forEach((image) => {
        initialImageArray.push(image.public_id);
      });
      deleteUploads(initialImageArray);

      // get url of uploaded images
      const imageResponse = await Promise.all(multiplePicturePromise);

      imageUrl = imageResponse.map((image) => {
        const url = image.secure_url;
        const public_id = image.public_id;
        const folder = image.folder;
        return { url, public_id, folder };
      });
    }
    // end of uploaded images

    // check if no image
    if (
      imageUrl === undefined &&
      req?.files === undefined &&
      check.image <= 0
    ) {
      res.status(400);
      throw new Error("No image uploaded for identification document");
    }

    // update user
    if (imageUrl !== undefined && req?.files.length > 0) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          image: imageUrl !== undefined && imageUrl,
        },
        {
          new: true,
        }
      );

      responseHandle.successResponse(
        res,
        201,
        "identification document updated successfully.",
        updatedUser
      );
    }

    responseHandle.successResponse(
      res,
      201,
      "identification document updated successfully.",
      "image"
    );
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

export default kyc;
