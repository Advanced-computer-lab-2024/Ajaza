const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Img = require("../models/Img"); // Adjust the path if necessary

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Frontend/public/uploads/"); // Temporary upload folder
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
      return res.status(500).json({ error: "File upload error: " + err.message });
    }

    try {
      let idIdToBeAddedToBody = null;
      let idCertsToBeAddedToBody = [];

      // Process 'id' file if it exists
      if (req.files && req.files["id"]) {
        const idFile = req.files["id"][0];

        const imgDoc = new Img();
        const savedImg = await imgDoc.save();

        const newFilename = `${savedImg._id}.jpg`;
        const newPath = path.join("../Frontend/public/uploads", newFilename);

        await fs.rename(idFile.path, newPath);

        savedImg.path = newPath;
        await savedImg.save();

        idIdToBeAddedToBody = savedImg._id;
      }

      // Process 'certificates' files if they exist
      if (req.files && req.files["certificates"]) {
        const certificatePromises = req.files["certificates"].map(async (certFile) => {
          const imgDoc = new Img();
          const savedImg = await imgDoc.save();

          const newFilename = `${savedImg._id}.jpg`;
          const newPath = path.join("../Frontend/public/uploads", newFilename);

          await fs.rename(certFile.path, newPath);

          savedImg.path = newPath;
          await savedImg.save();

          return savedImg._id;
        });

        idCertsToBeAddedToBody = await Promise.all(certificatePromises);
      }

      req.body.id = idIdToBeAddedToBody;
      req.body.certificates = idCertsToBeAddedToBody;
      next();
    } catch (error) {
      return res.status(500).json({ error: "File processing error: " + error.message });
    }
  });
};

module.exports = uploadIdCertificatesImage;
