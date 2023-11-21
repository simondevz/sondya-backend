import asyncHandler from "express-async-handler";
import responseHandle from "../../utils/handleResponse.js";
import UserModel from "../../models/users.model.js";
import GroupChatModel from "../../models/groupchat.model.js";
import handleUpload from "../../utils/upload.js";
import { deleteUploads } from "../../utils/deleteupload.js";

const adminGroupChat = {};

adminGroupChat.create = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Group chat']
  console.log("running..........");
  const { name, description, admin_id } = req.body;
  console.log(req.body);

  try {
    const check = await UserModel.findById(admin_id);
    const nametaken = await GroupChatModel.findOne({ name });
    if (!check) {
      res.status(404);
      throw new Error("Admin User not found");
    }

    if (nametaken) {
      res.status(403);
      throw new Error("Group name already exists");
    }

    if (!description) {
      res.status(400);
      throw new Error("Please provide a description for the Group");
    }

    // start of upload images
    let imageUrl;

    if (req.files?.length) {
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

    const createdGropChat = await GroupChatModel.create({
      admin_id,
      name,
      description,
      status: "active",
      image: imageUrl,
    });

    if (!createdGropChat) {
      res.status(500);
      throw new Error("Could not create Group Chat");
    } else {
      console.log(createdGropChat);
      responseHandle.successResponse(
        res,
        201,
        "Group Chat created successfully.",
        createdGropChat
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

adminGroupChat.getChats = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Group chat']
  const admin_id = req.params.id;

  try {
    const check = await UserModel.findById(admin_id);
    if (!check) {
      res.status(404);
      throw new Error("Admin User not found");
    }

    const numberOfGroupchats = await GroupChatModel.countDocuments({
      admin_id,
    });
    const groupChats = await GroupChatModel.find({ admin_id }).populate(
      "admin_id",
      "image"
    );

    if (!groupChats) {
      res.status(500);
      throw new Error("Could not get Group Chats");
    } else {
      console.log(groupChats);
      responseHandle.successResponse(
        res,
        201,
        "Group Chats gotten successfully.",
        { chats: groupChats, numberOfChats: numberOfGroupchats }
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

adminGroupChat.activate = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Group chat']
  const id = req.params.id;
  const check = await GroupChatModel.findById(id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("id not found");
    }

    if (check.status === "active") {
      res.status(400);
      throw new Error("Group chat is already active");
    }

    const actuvatedGroupChat = await GroupChatModel.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );

    if (!actuvatedGroupChat) {
      res.status(500);
      throw new Error("Could not Activate Gruop Chat");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Group Chat successfully Activated.",
        actuvatedGroupChat
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminGroupChat.suspend = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Group chat']
  const id = req.params.id;
  const check = await GroupChatModel.findById(id);

  try {
    if (!check) {
      res.status(404);
      throw new Error("id not found");
    }

    if (check.status === "suspended") {
      res.status(400);
      throw new Error("Group chat is already suspended");
    }

    const suspendedGroupChat = await GroupChatModel.findByIdAndUpdate(
      id,
      { status: "suspended" },
      { new: true }
    );

    if (!suspendedGroupChat) {
      res.status(500);
      throw new Error("Could not Suspend Gruop Chat");
    } else {
      responseHandle.successResponse(
        res,
        200,
        "Group Chat successfully Suspended.",
        suspendedGroupChat
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

adminGroupChat.delete = asyncHandler(async (req, res) => {
  // #swagger.tags = ['Admin Group chat']
  const id = req.params.id;
  const check = await GroupChatModel.findById(id);
  console.log(check);

  try {
    if (!check) {
      res.status(404);
      throw new Error("id not found");
    }

    // delete previously uploaded images from cloudinary
    const initialImageArray = [];
    check.image.forEach((image) => {
      initialImageArray.push(image.public_id);
    });
    deleteUploads(initialImageArray);

    const deletedGroupChat = await GroupChatModel.findByIdAndDelete(id);
    if (!deletedGroupChat) {
      res.status(500);
      throw new Error("Could not Delete Gruop Chat");
    } else {
      console.log("deleted");
      responseHandle.successResponse(
        res,
        200,
        "Group Chat successfully Deleted.",
        deletedGroupChat
      );
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error);
  }
});

export default adminGroupChat;
