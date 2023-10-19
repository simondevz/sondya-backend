import multer, { memoryStorage } from "multer";

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    // reject file
    cb(
      {
        message: "Unsupported file format: only png, jpg and Jpeg are accepted",
      },
      false
    );
  }
};

const storage = memoryStorage();

// Multer Configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
