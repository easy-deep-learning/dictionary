import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  translations: {
    'ru-RU': {}
  },
  synonyms: Array,
  examples: {
    'ru-RU': {
      text: String,
      source: String,
    }
  }
})

const Word = mongoose.model('Word', Schema)

export {
  Word
}
