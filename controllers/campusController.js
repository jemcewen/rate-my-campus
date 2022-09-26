const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const asyncHandler = require('../utils/asyncHandler');
const Campus = require('../models/campus');

const getCampuses = asyncHandler(async (req, res) => {
  const campuses = await Campus.find({});
  res.render('campuses/index', { campuses });
})

const createCampus = asyncHandler(async (req, res, next)=> {
  geoData = await geocoder.forwardGeocode({
    query: `${req.body.campus.title}, ${req.body.campus.location}`,
    limit: 1
  }).send();
  const campus = new Campus(req.body.campus);
  campus.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campus.geometry = geoData.body.features[0].geometry;
  campus.author = req.user._id;
  await campus.save();
  req.flash('success', 'Your campus has successfully been created.');
  res.redirect(`/campuses/${campus._id}`);
})

const getCampus = asyncHandler(async (req, res) => {
  const campus = await Campus.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: 'author'
    })
    .populate('author');
  if(!campus) {
    req.flash('error', 'Campus not found.');
    return res.redirect('/campuses');
  }
  res.render('campuses/display', { campus });
})

const updateCampus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campus = await Campus.findByIdAndUpdate(id, {...req.body.campus});
  const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campus.images.push(...images);
  await campus.save();
  if(req.body.deleteImages) {
    // Remove from the images array all images that are in the deleteImages array
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campus.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages }}}});
  }
  req.flash('success', 'Your campus has successfully been updated.');
  res.redirect(`/campuses/${campus._id}`);
})

const deleteCampus = asyncHandler(async(req, res) => {
  const { id } = req.params;
  await Campus.findByIdAndDelete(id);
  req.flash('success', 'Your campus has been deleted.');
  res.redirect('/campuses');
})

const getNewForm = (req, res) => {
  res.render('campuses/new');
}

const getEditForm = asyncHandler(async (req, res) => {
  const campus = await Campus.findById(req.params.id);
  if(!campus) {
    req.flash('error', 'Campus not found.');
    return res.redirect('/campuses');
  }
  res.render('campuses/edit', { campus });
})

module.exports = {
  getCampuses,
  createCampus,
  getCampus,
  updateCampus,
  deleteCampus,
  getNewForm,
  getEditForm
}