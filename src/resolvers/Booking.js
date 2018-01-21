const { get } = require('lodash/fp')
const { subHours } = require('date-fns')

module.exports = {
  // The booking lasts up to 48h before the check-in date
  expires: booking => subHours(booking.checkinDate, 48),

  rooms: get('nrRooms'),
  guests: get('nrGuests'),
}
