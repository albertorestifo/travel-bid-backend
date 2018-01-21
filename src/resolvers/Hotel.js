const { get } = require('lodash/fp')
const { subHours } = require('date-fns')

const BookingModel = require('../models/BookingModel')

module.exports = {
  id: get('HotelID'),
  name: get('HotelName'),
  stars: get('StarRating'),
  place: get('HotelPlaceName'),
  picture: hotel => `http://media.hotelscombined.com/HI${hotel.ImageID}.jpg`,

  async bookings(hotel, { filters = {} }) {
    const query = {
      candidateIds: hotel.HotelID,
      hotelId: { $ne: hotel.HotelID },

      // We don't care about finding booking that are already expired
      checkinDate: { $gte: subHours(new Date(), 48) },
    }

    if (filters.checkinDate) query.checkinDate = { $gte: filters.checkinDate }
    if (filters.checkoutDate)
      query.checkoutDate = { $lte: filters.checkoutDate }
    if (filters.guests) query.nrGuests = filters.guests
    if (filters.minPrice) query.currentPrice = { $gte: filters.minPrice }
    if (filters.maxPrice) query.currentPrice = { $lte: filters.minPrice }

    const bookings = await BookingModel.find(query).exec()

    return bookings
  },
}
