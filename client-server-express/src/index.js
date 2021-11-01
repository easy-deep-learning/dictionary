import express from 'express'

import pkg from 'express-openid-connect'
const { auth, requiresAuth } = pkg

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'

import { dbConnection, Word } from './models/index.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

/**
 * @see https://ejs.co/#docs
 * */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: 'https://dev-yf-kf5ze.us.auth0.com'
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
  res.render('pages/index')
})

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user))
})

app.get('/words/', /*requiresAuth(),*/ (req, res) => {
  Word.find({}, (err, result) => res.send(result))
})

app.get('/words/:word', /*requiresAuth(),*/ (req, res) => {
  Word.findOne({word: req.params.word}, (err, result) => res.send(result))
})

app.get('/search', /*requiresAuth(),*/ (req, res) => {
  Word.findOne({word: req.query}, (err, result) => res.send(result))
})

app.use(bodyParser.json())

app.post('/words', /*requiresAuth(),*/ (req, res) => {
  const word = new Word({...req.body})
  word.save((err, result) => res.send(result))
})

dbConnection.once('open', () => {
  console.log('mongo connection established'); // eslint-disable-line
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })
})

