import cloudinary from "../config/cloudinary.js";

const handleUpload = async (file, index, mimetype, filename) => {
  let resource_type;
  if (mimetype) {
    resource_type =
      mimetype.includes("image") ||
      mimetype.includes("video") ||
      mimetype.includes("audio")
        ? "auto"
        : "raw";
  } else {
    resource_type = "auto";
  }

  const res = await cloudinary.uploader.upload(file, {
    resource_type,
    folder: "sondya",
    [resource_type === "raw" ? "public_id" : null]:
      resource_type === "raw" ? filename : null,
  });
  return res;
};

export default handleUpload;
