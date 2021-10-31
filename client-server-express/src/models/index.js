import mongoose from 'mongoose'

import User from './user.js'
import { Word } from './word.js'

/**
 * @see https://mongoosejs.com/docs/index.html
 */

// https://mongoosejs.com/docs/index.html
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const dbConnection = mongoose.connection


export {
  Word,
  User,
  dbConnection,
}
