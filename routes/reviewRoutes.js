const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  createReview, 
  deleteReview 
} = require('../controllers/reviewController');
const { 
  isLoggedIn, 
  isReviewAuthor, 
  validateReview 
} = require('../middleware/middleware');

router.post('/', isLoggedIn, validateReview, createReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview)

module.exports = router;