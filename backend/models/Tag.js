const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({ //ng
  tag: { type: String, required: true, unique: true }, // Unique tag name
  preferanceTags: [
    {type: String}
  ]
});

// Create the model
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
