const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('cardImage').get(function () {
  return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
});

ImageSchema.virtual('carouselImage').get(function () {
  return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const campusSchema = new Schema({
  title: String, 
  description: String,
  location: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

// Middleware to delete reviews when a campus is deleted
campusSchema.post('findOneAndDelete', async (campus) => {
  if(campus) {
    await Review.deleteMany({
      _id: {
        $in: campus.reviews
      }
    })
  }
})

module.exports = mongoose.model('Campus', campusSchema, 'campuses');