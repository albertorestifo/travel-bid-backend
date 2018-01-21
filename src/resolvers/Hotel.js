const { get } = require('lodash/fp')

const BookingModel = require('../models/BookingModel')

module.exports = {
  id: get('HotelID'),
  name: get('HotelName'),
  stars: get('StarRating'),
  place: get('HotelPlaceName'),

  async bookings(hotel, { filters = {} }) {
    const query = {
      candidateIds: hotel.HotelID,
      hotelId: { $ne: hotel.HotelID },
    }

    if (filters.from) query.checkinDate = { $gte: filters.checkinDate }
    if (filters.to) query.checkoutDate = { $lte: filters.checkoutDate }
    if (filters.rooms) query.nrRooms = filters.rooms
    if (filters.minPrice) query.currentPrice = { $gte: filters.minPrice }
    if (filters.maxPrice) query.currentPrice = { $lte: filters.minPrice }

    const bookings = await BookingModel.find(query).exec()

    return bookings
  },
}
