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

const uploadFiles = upload.fields([{ name: "pictures", maxCount: 3 }]);

const uploadVenuePicturesImage = async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "pictures mw" + err.message });
    }

    try {
      let picturesTobeAddedToBody = [];
      if (req.files && req.files["pictures"]) {
        for (let i = 0; i < req.files["pictures"].length; i++) {
          const idFile = req.files["pictures"][i]; // Access the ith element of the 'pictures' array

          const imgDoc = new Img();
          const savedImg = await imgDoc.save();

          const newFilename = `${savedImg._id}.jpg`;
          const newPath = path.join("../Frontend/public/uploads", newFilename);

          fs.rename(idFile.path, newPath, async (renameErr) => {
            if (renameErr) {
              await Img.findByIdAndRemove(savedImg._id);
              return res.status(500).json({ error: "Failed to rename file" });
            }

            savedImg.path = newPath;
            await savedImg.save();
          });
          picturesTobeAddedToBody.push(savedImg._id);
        }
        req.body.pictures = picturesTobeAddedToBody;
      }
      next();
    } catch (error) {
      return res
        .status(500).json({ error: "picturesbottom mw" + error.message });
    }
  });
  //next();
};

module.exports = uploadVenuePicturesImage;
