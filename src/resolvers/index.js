const fs = require('fs')
const path = require('path')

const files = fs.readdirSync(__dirname)

// Require all the resolvers in this folder
module.exports = files.reduce((resolvers, file) => {
  if (path.extname(file) !== '.js' || file === 'index.js') return resolvers

  const name = path.basename(file, '.js')

  return Object.assign(resolvers, {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    [name]: require(path.join(__dirname, file))
  })
}, {})
