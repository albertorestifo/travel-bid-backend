const HotelModel = require('../models/HotelModel')

module.exports = {
  async hotel(root, { id }) {
    const hotel = await HotelModel.findOne({ HotelID: id })
    return hotel
  }
}
