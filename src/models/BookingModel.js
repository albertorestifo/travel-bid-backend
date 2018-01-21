const mongoose = require('mongoose')

const schema = mongoose.Schema({
  createdAt: Date,

  checkinDate: Date,
  checkoutDate: Date,
  nrGuests: Number,
  nrRooms: Number,

  // Data of the hotel picked by the user
  hotelsCombinedId: String,
  hotelsCombinedBookingUrl: String,
  hotelsCombinedPrice: Number,

  candidateIds: [Number],
  currentPrice: Number,

  // Set when an hotel bids low for a user
  hotelId: Number,
})

module.exports = mongoose.model('Booking', schema)
