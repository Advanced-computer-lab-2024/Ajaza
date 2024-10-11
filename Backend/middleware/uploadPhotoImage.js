const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Img = require("../models/Img"); // Adjust the path if necessary
const { ObjectId } = require("mongoose").Types;

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Frontend/public/uploads/"); // The folder where images will be temporarily saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Temporary filename
  },
});

const upload = multer({ storage });

const uploadFiles = upload.fields([{ name: "photo", maxCount: 1 }]);

const uploadPhotoImage = async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "photo mw" + err.message });
    }

    try {
      let idPhotoTobeAddedToBody = null;
      if (req.files && req.files["photo"]) {
        const idFile = req.files["photo"][0]; // Access the first element of the 'id' array

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
      req.body.photo = idPhotoTobeAddedToBody;
      next();
    } catch (error) {
      return res.status(500).json({ error: "id mw" + error.message });
    }
  });
};

module.exports = uploadPhotoImage;
