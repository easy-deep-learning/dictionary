import express from 'express'
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'

import { dbConnection, Word } from './models/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

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

app.use('/static', express.static('public'))


// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user))
})

app.get('/words/:word_part', requiresAuth(), (req, res) => {
  console.log("req.params: ", req.params.word_part); // eslint-disable-line
  Word.find({}, (err, result) => res.send(result))
})

app.use(bodyParser.json())

app.post('/words', /*requiresAuth(),*/ (req, res) => {
  console.log("req.body: ", req.body); // eslint-disable-line
  
  const word = new Word()
  word.save((err, result) => res.send(result))
})

dbConnection.once('open', () => {
  console.log('mongo connection established'); // eslint-disable-line
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })
})

