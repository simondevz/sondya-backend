import multer, { memoryStorage } from "multer";

const mimeTypes = [
  "application/json",
  "application/javascript",
  "application/pdf",
  "application/xml",
  "application/zip",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/x-www-form-urlencoded",
  "application/xhtml+xml",
  "application/octet-stream",
  "application/x-tar",
  "application/x-rar-compressed",
  "application/gzip",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-7z-compressed",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "image/webp",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "text/css",
  "text/csv",
  "text/html",
  "text/javascript",
  "text/plain",
  "text/xml",
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/webm",
  "video/x-msvideo",
];

const fileFilter = (req, file, cb) => {
  if (mimeTypes.includes(file.mimetype)) {
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
