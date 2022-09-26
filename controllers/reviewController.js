const asyncHandler = require('../utils/asyncHandler');
const Campus = require('../models/campus');
const Review = require('../models/review');

const createReview = asyncHandler(async (req, res) => {
  const campus = await Campus.findById(req.params.id);
  const review = await new Review(req.body.review);
  review.author = req.user._id;
  campus.reviews.push(review);
  await review.save();
  await campus.save();
  req.flash('success', 'Your review has been created.');
  res.redirect(`/campuses/${campus._id}`);
})

const deleteReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campus.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash('success', 'Your review has been deleted.');
  res.redirect(`/campuses/${id}`);
})

module.exports = {
  createReview,
  deleteReview
}