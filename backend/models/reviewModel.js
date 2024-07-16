const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
