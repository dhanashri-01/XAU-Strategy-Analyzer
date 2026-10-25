const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadsDirectory = path.resolve(__dirname, "../uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });

const parsedLimit = parseInt(process.env.MAX_CSV_SIZE_MB, 10);
const MAX_CSV_SIZE_MB = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 100;
const MAX_CSV_SIZE_BYTES = MAX_CSV_SIZE_MB * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDirectory),
  filename: (_req, _file, cb) => cb(null, `${crypto.randomUUID()}.csv`),
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_CSV_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      return cb(new Error("Choose a .csv file."));
    }
    cb(null, true);
  },
});

upload.maxSizeMB = MAX_CSV_SIZE_MB;

module.exports = upload;
