import cloudinary from "../config/cloudinary.js";

// Delete the file from Cloudinary
export const deleteUpload = (id) => {
  cloudinary.uploader.destroy(id, (error, result) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted:", result);
    }
  });
};

// Function to delete files
export const deleteUploads = (publicIds) => {
  publicIds.forEach((publicId) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error(`Error deleting file with public ID ${publicId}:`, error);
        // throw new Error(
        //   `Error deleting file with public ID ${publicId}:`,
        //   error
        // );
      } else {
        console.log(`File with public ID ${publicId} deleted:`, result);
      }
    });
  });
};
