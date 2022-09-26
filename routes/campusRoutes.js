const express = require('express');
const router = express.Router();
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer( {storage} );
const { uploadFiles } = require('../middleware/middleware');
const {
  getCampuses,
  createCampus,
  getCampus,
  updateCampus,
  deleteCampus,
  getNewForm,
  getEditForm
} = require('../controllers/campusController')
const {
  isLoggedIn, 
  isAuthor, 
  validateCampus
} = require('../middleware/middleware');

router.route('/')
  .get(getCampuses)
  // .post(isLoggedIn, upload.array('image'), validateCampus, createCampus);
  .post(isLoggedIn, uploadFiles, validateCampus, createCampus);
  


router.get('/new', isLoggedIn, getNewForm);

router.route('/:id')
  .get(getCampus)
  .put(isLoggedIn, isAuthor, uploadFiles, validateCampus, updateCampus)
  .delete(isLoggedIn, isAuthor, deleteCampus);

router.get('/:id/edit', isLoggedIn, isAuthor, getEditForm)

module.exports = router;