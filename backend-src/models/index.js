const mongoose = require('mongoose')

const User = require('./user')
const { Word } = require('./word')

/**
 * @see https://mongoosejs.com/docs/index.html
 */

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    /**
     * @see https://mongoosejs.com/docs/connections.html
     * @see http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect
     * ConnectOptions
     */
    const opts = {
      useNewUrlParser: true,
    }

    cached.promise = mongoose
      .connect(process.env.DATABASE_URL, opts)
      .then((mongoose) => mongoose)
      .catch((error) => console.error(error))
  }
  cached.conn = await cached.promise
  return cached.conn
}

module.exports = {
  Word,
  User,
  dbConnect,
}
