const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Img = require('../models/Img'); // Adjust the path if necessary

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../Frontend/src/uploads/'); // The folder where images will be temporarily saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Temporary filename
  },
});

const upload = multer({ storage });

const uploadPhotoImage = async (req, res, next) => {
    upload.single('photo')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      try {
        // Create a new document in the imgs collection
        const imgDoc = new Img();
        const savedImg = await imgDoc.save();
  
        // Update the filename and path to include the new ID
        const newFilename = `${savedImg._id}.jpg`;
        const newPath = path.join('../Frontend/src/uploads', newFilename);
  
        // Rename the file
        fs.rename(req.file.path, newPath, async (renameErr) => {
          if (renameErr) {
            await Img.findByIdAndRemove(savedImg._id);
            return res.status(500).json({ error: 'Failed to rename file' });
          }
  
          // Update the path in the database (if needed)
          savedImg.path = newPath; // You may want to add this field in your Img model
          await savedImg.save();
  
          // Attach the image ID to the request for use in the next middleware
          req.imgId = savedImg._id;
          next();
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  };

module.exports = uploadPhotoImage;
