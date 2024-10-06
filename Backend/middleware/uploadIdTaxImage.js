const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Img = require('../models/Img'); // Adjust the path if necessary
const { ObjectId } = require('mongoose').Types;

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

const uploadFiles = upload.fields([
    { name: 'id', maxCount: 1 },
    { name: 'taxationRegCard', maxCount: 1 },
  ]);

const uploadIdImage = async (req, res, next) => {
    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "id mw" + err.message });
      }
  
      try {
        let idIdTobeAddedToBody = null;
        let idTaxTobeAddedToBody = null;
        if (req.files && req.files['id']) {
            const idFile = req.files['id'][0]; // Access the first element of the 'id' array
    
            // Create a new document in the imgs collection
            const imgDoc = new Img();
            const savedImg = await imgDoc.save();
    
            // Update the filename and path to include the new ID
            const newFilename = `${savedImg._id}.jpg`;
            const newPath = path.join('../Frontend/src/uploads', newFilename);
    
            // Rename the file
            fs.rename(idFile.path, newPath, async (renameErr) => {
              if (renameErr) {
                await Img.findByIdAndRemove(savedImg._id);
                return res.status(500).json({ error: 'Failed to rename file' });
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
          if (req.files && req.files['taxationRegCard']) {
            const idFile = req.files['taxationRegCard'][0]; // Access the first element of the 'id' array
    
            // Create a new document in the imgs collection
            const imgDoc = new Img();
            const savedImg = await imgDoc.save();
    
            // Update the filename and path to include the new ID
            const newFilename = `${savedImg._id}.jpg`;
            const newPath = path.join('../Frontend/src/uploads', newFilename);
    
            // Rename the file
            fs.rename(idFile.path, newPath, async (renameErr) => {
              if (renameErr) {
                await Img.findByIdAndRemove(savedImg._id);
                return res.status(500).json({ error: 'Failed to rename file' });
              }
    
              // Update the path in the database (if needed)
              savedImg.path = newPath; // You may want to add this field in your Img model
              await savedImg.save();
    
              // Attach the image ID to the request for use in the next middleware
              //req.taxationRegCard = savedImg._id;
              
              //next();
            });
            idTaxTobeAddedToBody = savedImg._id;
          }
        req.body.id = idIdTobeAddedToBody;
        req.body.taxationRegCard = idTaxTobeAddedToBody;
        next();
      } catch (error) {
        return res.status(500).json({ error: "id mw" + error.message });
      }
    });
  };

module.exports = uploadIdImage;
