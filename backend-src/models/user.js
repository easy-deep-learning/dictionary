const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  groups: Array,
  profile: {
    email: String,
    first_name: String,
    last_name: String,
    username: String,
    photo_url: String,
    created_at: String,
  },
})

module.exports = mongoose.models.User || mongoose.model('User', Schema)
