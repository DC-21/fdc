const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

const uploadImageRouter = express.Router();

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|webp|gif|svg|bmp|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  console.log(`File Mimetype: ${file.mimetype}`);
  console.log(
    `File Extension: ${path.extname(file.originalname).toLowerCase()}`
  );
  console.log(`Mimetype Valid: ${mimetype}`);
  console.log(`Extname Valid: ${extname}`);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images are allowed"));
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sportsdot", // replace with your bucket name
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: fileFilter,
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

const pitchImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sportsdot",
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: fileFilter,
}).array("pitchImages", 10);

uploadImageRouter.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ error: err.message || err });
    }

    try {
      console.log("Files:", req.files);
      console.log("Body:", req.body);

      const avatar = req.files?.avatar ? req.files.avatar[0].location : null;
      const image2 = req.files?.image2 ? req.files.image2[0].location : null;
      console.log("Uploaded avatar:", avatar);
      console.log("Uploaded images:", image2);
      console.log("Other form data:", req.body);

      res.json({ avatar, image2 });
    } catch (error) {
      console.error("Processing Error:", error);
      res.status(500).json({ error: error.message || error });
    }
  });
});

uploadImageRouter.post("/upload-pitch", (req, res) => {
  pitchImageUpload(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ error: err.message || err });
    }

    try {
      console.log("Files:", req.files);
      console.log("Body:", req.body);

      const pitchImages = req.files
        ? req.files.map((file) => file.location)
        : [];
      console.log("Uploaded pitch images:", pitchImages);
      console.log("Other form data:", req.body);

      res.json({ pitchImages });
    } catch (error) {
      console.error("Processing Error:", error);
      res.status(500).json({ error: error.message || error });
    }
  });
});

module.exports = uploadImageRouter;
