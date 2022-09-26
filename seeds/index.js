const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const {city, typeOfSchool} = require('./seedHelpers')
const Campus = require('../models/campus');

mongoose.connect('mongodb://localhost:27017/rate-my-campus');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)] ;

// call unsplash and return small image
async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'N1U_f9PXYhfYoEFK_m4LzI1s68iJR_98gnAy41Y3fjE',
        collections: 'MXJvPh-0m6w',
      },
    })
    return resp.data.urls.small
  } catch (err) {
    console.error(err)
  }
}

const seedDB = async () => {
  await Campus.deleteMany({});

  for (let i = 0; i < 5; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const campus = new Campus({
      title: `${sample(city)} ${sample(typeOfSchool)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dyyktpise/image/upload/v1662702202/rate-my-campus/vhugnmyqg9fgotyga1kg.jpg',
          filename: 'rate-my-campus/vhugnmyqg9fgotyga1kg'
        },
        {
          url: 'https://res.cloudinary.com/dyyktpise/image/upload/v1662702202/rate-my-campus/yzuu9hrdygxafqwxt50p.jpg',
          filename: 'rate-my-campus/yzuu9hrdygxafqwxt50p'
        },
        {
          url: 'https://res.cloudinary.com/dyyktpise/image/upload/v1662702202/rate-my-campus/vyqhfhg5ae6uap2sgvwb.jpg',
          filename: 'rate-my-campus/vyqhfhg5ae6uap2sgvwb'
        }
      ],
      geometry: { type: 'Point', coordinates: [ -123.25, 49.27 ] },
      description: 'Nam at vestibulum nisl. Morbi non lobortis turpis. Donec nunc eros, luctus quis augue nec, viverra convallis lorem. Donec interdum eget neque sed tincidunt. Pellentesque tortor nisi, auctor in viverra a, ultrices nec odio. Proin vitae justo vel mi tempor pulvinar. Donec sit amet risus sodales, maximus neque quis, varius ex. Mauris fermentum tortor id purus tempus, nec luctus orci blandit.',
      author: '63176339b8b607259d431a00'
    })
    await campus.save();
  }
}

seedDB().then(() => mongoose.connection.close());