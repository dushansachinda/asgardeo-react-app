
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dev-server-ports.cjs.production.min.js')
} else {
  module.exports = require('./dev-server-ports.cjs.development.js')
}
