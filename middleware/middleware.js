const ExpressError = require('../utils/ExpressError');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({
   storage,
   limits: { fileSize: 3000000 } // max file size of 1 mb
});
const { campusValidation, reviewValidation } = require('../validations');
const Campus = require('../models/campus');
const Review = require('../models/review')

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in to visit this page.')
    return res.redirect('/login');
  }
  next();
}

module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campus = await Campus.findById(id);
  if(!campus.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to edit this campus.');
    return res.redirect(`/campuses/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to delete this review.');
    return res.redirect(`/campuses/${id}`);
  }
  next();
}

module.exports.validateCampus = (req, res, next) => {
  console.log(req.body);
  const { error } = campusValidation.validate(req.body);
  if(error) {
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(message, 400);
  }
  else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidation.validate(req.body);
  if(error) {
    const message = error.details.map(el => el.message).join(',');
    throw new ExpressError(message, 400);
  }
  else {
    next();
  }
}
 
module.exports.uploadFiles = (req, res, next) => {
   const uploadProcess = upload.array('image');
 
   uploadProcess(req, res, err => {
      if (err instanceof multer.MulterError) {
         return next(new Error(err, 500));
      } else if (err) {
         return next(new Error(err, 500));
      }
      next();
   });
};