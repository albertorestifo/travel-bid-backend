const assert = require('assert')

const BookingModel = require('../models/BookingModel')
const HotelModel = require('../models/HotelModel')
const pubsub = require('../PubSubClient')

module.exports = {
  async claim(root, { hotelId, bookingId, price }) {
    const booking = await BookingModel.findById(bookingId)
    const hotel = await HotelModel.findOne({ HotelID: hotelId })

    assert(booking, 'Booking not found')
    assert(hotel, 'Hotel not found')
    assert(booking.currentPrice > price, 'The new price must be lower')

    booking.currentPrice = price
    booking.hotelId = hotelId

    await booking.save()

    pubsub.publish('bookingClaimed', { bookingClaimed: booking })

    return booking
  },

  async book(
    root,
    { input: { hotelId, checkinDate, checkoutDate, rooms, guests, price } },
  ) {
    const hotel = await HotelModel.findOne({ HotelID: hotelId })
    assert(hotel, 'Hotel not found')

    // TODO: Get candidates

    const booking = await BookingModel.create({
      checkinDate,
      checkoutDate,
      nrGuests: guests,
      nrRooms: rooms,
      currentPrice: price,
      hotelsCombinedPrice: price,
    })

    pubsub.publish('bookingAdded', { bookingAdded: booking })

    return booking
  },
}
