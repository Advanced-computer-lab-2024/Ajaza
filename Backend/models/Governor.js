const mongoose = require('mongoose');

const governorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true  },//made unique for req 17 --ng
  pass: { type: String, required: true }, // hashed password
});

// Create the model
const Governor = mongoose.model('Governor', governorSchema);

module.exports = Governor;
