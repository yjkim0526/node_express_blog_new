const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: { type: String, required: true },
  content: { type: String, required: true },
	createAt: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Post', PostSchema);
