const mongoose = require('mongoose');

const postListSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  content: { type: String, required: true }
})

module.exports = mongoose.model('PostList', postListSchema);