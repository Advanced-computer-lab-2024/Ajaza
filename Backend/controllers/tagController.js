const Tag = require('../models/Tag');

// req24 TESTED
exports.createTag = async (req, res) => {

  // authentication middleware

  try {
    const tag = new Tag(req.body);
    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// req24 TESTED
exports.getAllTags = async (req, res) => {

  // authentication middleware

  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// not used
exports.getTagById = async (req, res) => {

  // authentication middleware

  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req24 TESTED
exports.updateTag = async (req, res) => {
  try {

    // authentication middleware

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req24 TESTED
exports.deleteTag = async (req, res) => {
  try {

    // authentication middleware

    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
