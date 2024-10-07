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

const uploadFiles = upload.fields([
  { name: "id", maxCount: 1 },
  { name: "certificates", maxCount: 3 },
]);

const uploadIdCertificatesImage = async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "id mw" + err.message });
    }

    try {
      let idIdTobeAddedToBody = null;
      let idCertTobeAddedToBody = [];
      if (req.files && req.files["id"]) {
        const idFile = req.files["id"][0]; // Access the first element of the 'id' array

        // Create a new document in the imgs collection
        const imgDoc = new Img();
        const savedImg = await imgDoc.save();

        // Update the filename and path to include the new ID
        const newFilename = `${savedImg._id}.jpg`;
        const newPath = path.join("../Frontend/public/uploads", newFilename);

        // Rename the file
        fs.rename(idFile.path, newPath, async (renameErr) => {
          if (renameErr) {
            await Img.findByIdAndRemove(savedImg._id);
            return res.status(500).json({ error: "Failed to rename file" });
          }

          // Update the path in the database (if needed)
          savedImg.path = newPath; // You may want to add this field in your Img model
          await savedImg.save();

          // Attach the image ID to the request for use in the next middleware
          //req.id = savedImg._id;
          //next();
        });
        idIdTobeAddedToBody = savedImg._id;
      }
      if (req.files && req.files["certificates"]) {
        for (let i = 0; i < req.files["certificates"].length; i++) {
          const idFile = req.files["certificates"][i];

          const imgDoc = new Img();
          const savedImg = await imgDoc.save();

          const newFilename = `${savedImg._id}.jpg`;
          const newPath = path.join("../Frontend/public/uploads", newFilename);

          fs.rename(idFile.path, newPath, async (renameErr) => {
            if (renameErr) {
              //await Img.findByIdAndRemove(savedImg._id);
              return res.status(500).json({ error: "Failed to rename file" });
            }

            savedImg.path = newPath;
            await savedImg.save();
          });
          idCertTobeAddedToBody.push(savedImg._id);
        }
      }
      req.body.id = idIdTobeAddedToBody;
      req.body.certificates = idCertTobeAddedToBody;
      next();
    } catch (error) {
      return res.status(500).json({ error: "id bottom mw" + error.message });
    }
  });
};

module.exports = uploadIdCertificatesImage;
