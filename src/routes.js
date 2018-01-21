const BookController = require('./controllers/BookController')

const exports = (module.exports = {})

exports.setupRoutes = app => {
  app.post('/book', BookController.post)
}
