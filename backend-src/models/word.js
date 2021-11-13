const mongoose = require('mongoose')

const ExampleSchema = new mongoose.Schema({
  text: {
    type: String,
    index: true,
    unique: true,
    minLength: 1,
  },
  source: {
    type: String,
    minLength: 3,
  },
})

const Schema = new mongoose.Schema({
  translations: Array,
  word: {
    type: String,
    index: true,
    unique: true,
    minLength: 1,
  },
  synonyms: Array,
  examples: [ExampleSchema],
})

const Word = mongoose.models.Word || mongoose.model('Word', Schema)

module.exports = { Word }
