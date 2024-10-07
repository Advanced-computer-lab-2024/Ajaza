const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Img = require("../models/Img");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Frontend/public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadLogoImage = async (req, res, next) => {
  upload.single("logo")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const imgDoc = new Img();
      const savedImg = await imgDoc.save();

      const newFilename = `${savedImg._id}.jpg`;
      const newPath = path.join("../Frontend/public/uploads", newFilename);

      fs.rename(req.file.path, newPath, async (renameErr) => {
        if (renameErr) {
          await Img.findByIdAndRemove(savedImg._id);
          return res.status(500).json({ error: "Failed to rename file" });
        }

        savedImg.path = newPath;
        await savedImg.save();

        req.imgId = savedImg._id;
        next();
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};

module.exports = uploadLogoImage;
