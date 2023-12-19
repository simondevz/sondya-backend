import multer, { memoryStorage } from "multer";

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/webm" ||
    file.mimetype === "video/x-matroska" || // MKV
    file.mimetype === "video/avi" ||
    file.mimetype === "video/quicktime" || // MOV
    file.mimetype === "audio/wav" || // WAV
    file.mimetype === "audio/mpeg" || // MP3
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" || // DOC
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // DOCX
    file.mimetype === "application/vnd.ms-excel" || // XLS
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // XLSX
    file.mimetype === "application/vnd.ms-powerpoint" || // PPT
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" || // PPTX
    file.mimetype === "text/plain" || // TXT
    file.mimetype === "text/csv" // CSV
  ) {
    cb(null, true);
  } else {
    // reject file
    cb(new Error("Unsupported file format"), false);
  }
};

const storage = memoryStorage();

// Multer Configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
