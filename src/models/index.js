const mongoose = require('mongoose')

const User = require('./user')
const { Word } = require('./word')

/**
 * @see https://mongoosejs.com/docs/index.html
 */

// https://mongoosejs.com/docs/index.html
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const dbConnection = mongoose.connection

module.exports = {
  Word,
  User,
  dbConnection,
}
