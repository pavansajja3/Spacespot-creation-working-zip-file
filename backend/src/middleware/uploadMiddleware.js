const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadRoot = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "general";

    if (file.fieldname === "images") {
      folder = "spaces/photos";
    }

    if (file.fieldname === "documents") {
      folder = "spaces/documents";
    }

    const uploadPath = path.join(uploadRoot, folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      file.fieldname +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    "jpg", "jpeg", "png", "gif", "webp",
    "pdf", "doc", "docx", "xls", "xlsx"
  ];

  const fileExt = file.originalname.toLowerCase().split(".").pop();

  if (allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Only these files are allowed: jpg, jpeg, png, gif, webp, pdf, doc, docx, xls, xlsx"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 10
  }
});

module.exports = upload;