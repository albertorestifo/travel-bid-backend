const fs = require('fs')
const Path = require('path')
const { createServer } = require('http')

const mongoose = require('mongoose')
const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const playground = require('graphql-playground-middleware-express').default
const axios = require('axios')
const { graphqlExpress } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const resolvers = require('./resolvers')

mongoose
  .connect('mongodb://db:27017/hackathon')
  .then(() => {
    console.log('Database connection enstablished')
  })
  .catch(err => {
    console.error('Connection to database failed')
    console.error(err)
  })

app.use(bodyParser.json())

// Setup CORS, just in case
app.use(cors())
app.options('*', cors())

/**
 * Create graphql schema
 */

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(Path.join(__dirname, './Schema.graphql'), 'utf8'),
  resolvers,
})

app.use(
  '/graphql',
  graphqlExpress(() => {
    return {
      schema,
    }
  }),
)

app.get(
  '/playground',
  playground({
    endpoint: '/graphql',
  }),
)

app.use('/hotelscombined/:path', (req, res) => {
  return axios({
    method: req.method,
    url: `http://www.hotelscombined.com/${req.params.path}`,
    params: req.query,
  })
    .then(result => {
      res.send(result.data)
    })
    .catch(err => {
      console.error(err)
      return res.status(500)
    })
})

app.use('/hotelscombined-sandbox/:path', (req, res) => {
  return axios({
    method: req.method,
    url: `http://sandbox.hotelscombined.com/api/2.0/${req.params.path}`,
    params: req.query,
    headers: {
      // The API requires to be done by a browser, so we can fake it by
      // setting the User-Agent header to the one of Chrome, for example
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    },
  })
    .then(result => {
      res.send(result.data)
    })
    .catch(err => {
      console.error(err)
      return res.status(500)
    })
})

const server = createServer(app)

server.listen(8080, () => {
  console.log('Server listening on port 8080')

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: server,
      path: '/subscriptions',
    },
  )
})
