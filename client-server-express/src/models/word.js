import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  translations: Array,
  word: String,
  synonyms: Array,
  examples: [
    {
      text: String,
      source: String,
    }
  ]
})

const Word = mongoose.model('Word', Schema)

export {
  Word
}
