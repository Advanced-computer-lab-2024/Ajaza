const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Img = require("../models/Img");
const { ObjectId } = require("mongoose").Types;

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

const uploadFiles = upload.fields([{ name: "logo", maxCount: 1 }]);


const uploadLogoImage = async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "logo mw" + err.message });
    }

    try {
      let idPhotoTobeAddedToBody = null;
      if (req.files && req.files["logo"]) {
        const idFile = req.files["logo"][0]; // Access the first element of the 'id' array

        const imgDoc = new Img();
        const savedImg = await imgDoc.save();

        const newFilename = `${savedImg._id}.jpg`;
        const newPath = path.join("../Frontend/public/uploads", newFilename);

        // Rename the file
        fs.rename(idFile.path, newPath, async (renameErr) => {
          if (renameErr) {
            await Img.findByIdAndRemove(savedImg._id);
            return res.status(500).json({ error: "Failed to rename file" });
          }

          savedImg.path = newPath;
          await savedImg.save();
        });
        idPhotoTobeAddedToBody = savedImg._id;
      }
      req.body.logo = idPhotoTobeAddedToBody;
      next();
    } catch (error) {
      return res.status(500).json({ error: "logo mw" + error.message });
    }
  });
};

module.exports = uploadLogoImage;
