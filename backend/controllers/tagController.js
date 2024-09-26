const Tag = require('../models/Tag');

// Create a new tag
exports.createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tag by ID
exports.getTagById = async (req, res) => {
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

// Update tag by ID
exports.updateTag = async (req, res) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tag by ID
exports.deleteTag = async (req, res) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
