const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment' // model we refer to with ObjectId
    },
    username: String
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;