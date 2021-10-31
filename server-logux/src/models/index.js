const mongoose = require('mongoose')
const User = require('./user')

/**
 * @see https://mongoosejs.com/docs/index.html
 */

// https://mongoosejs.com/docs/index.html
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const dbConnection = mongoose.connection

dbConnection.on('error', console.error.bind(console, 'connection error:'))
dbConnection.once('open', function () {
  console.log('mongodb connected'); // eslint-disable-line
})

module.exports = {
  User,
  dbConnection,
}
