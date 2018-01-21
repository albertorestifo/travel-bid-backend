const { withFilter } = require('graphql-subscriptions')
const { isAfter, isBefore } = require('date-fns')

const pubsub = require('../PubSubClient')

const filterBooking = (booking, filters = {}) => {
  if (filters.hotelId && booking.hotelId !== filters.hotelId) return false
  if (
    filters.checkinDate &&
    isBefore(booking.checkinDate, filters.checkinDate)
  ) {
    return false
  }
  if (
    filters.checkoutDate &&
    isAfter(booking.checkoutDate, filters.checkoutDate)
  ) {
    return false
  }
  if (filters.room && booking.nrRooms !== filters.room) return false
  if (filters.minPrice && booking.currentPrice < filters.minPrice) return false
  if (filters.maxPrice && booking.currentPrice > filters.maxPrice) return false

  return true
}

module.exports = {
  bookingClaimed: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('bookingClaimed'),
      (payload, variables) =>
        filterBooking(payload.bookingClaimed, variables.filters),
    ),
  },

  bookingAdded: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('bookingAdded'),
      (payload, variables) =>
        filterBooking(payload.bookingAdded, variables.filters),
    ),
  },
}
