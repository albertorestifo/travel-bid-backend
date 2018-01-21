const mongoose = require('mongoose')

const schema = mongoose.Schema({
  HotelName: String,
  HotelID: Number,
  HotelFileName: String,
  StarRating: Number,
  ImageID: Number,
  PropertyType: Number,
  Latitude: Number,
  Longitude: Number,
  OverallRating: Number,
  Facilities: String,
  HotelPlaceName: String,
  HotelPlaceFileName: String
})

module.exports = mongoose.model('Hotel', schema)
