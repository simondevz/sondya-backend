import cloudinary from "../config/cloudinary.js";

const handleUpload = async (file) => {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "sondya",
  });
  return res;
};

export default handleUpload;
