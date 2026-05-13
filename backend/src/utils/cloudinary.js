const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    return {
      folder: "ats_uploads",
      resource_type: "auto",
      allowed_formats: isImage ? ["jpg", "jpeg", "png", "webp"] : ["pdf", "docx"],
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`
    };
  }
});

function fileFilter(_req, file, cb) {
  const docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (file.fieldname === "resume" && file.mimetype !== "application/pdf") {
    return cb(new Error("Resume must be a PDF"));
  }
  if (file.fieldname === "coverLetter" && !["application/pdf", docx].includes(file.mimetype)) {
    return cb(new Error("Cover letter must be a PDF or DOCX file"));
  }
  if (file.fieldname === "profileImage" && !file.mimetype.startsWith("image/")) {
    return cb(new Error("Profile image must be an image"));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { cloudinary, upload };
