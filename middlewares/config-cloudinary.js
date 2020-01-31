const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dmbxci9y8',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,

});
module.exports = cloudinary;
