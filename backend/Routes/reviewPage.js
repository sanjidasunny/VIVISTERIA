const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');

// Fetch all reviews
router.post('/displayreviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new review
router.post('/review', async (req, res) => {
  const { userId, comment } = req.body;

  const review = new Review({
    userId,
    comment,
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a review
router.put('/review/:id', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(id, { comment }, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/review/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
