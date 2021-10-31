import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  groups: Array,
  profile: {
    id: String,
    first_name: String,
    last_name: String,
    username: String,
    photo_url: String,
    auth_date: String,
  },
})

export default mongoose.model('User', Schema)
