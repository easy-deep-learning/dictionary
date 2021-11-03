import express from 'express'

/**
 * @see https://auth0.github.io/express-openid-connect/
 * */
import pkg from 'express-openid-connect'
const { auth, requiresAuth, claimIncludes } = pkg

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'

import { dbConnection, Word, User } from './models/index.mjs'

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
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: 'https://dev-yf-kf5ze.us.auth0.com'
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

app.use((req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    User
    .findOne({ 'profile.email': req.oidc.user?.email })
    .then(user => {
      if (!user) {
        const {
          given_name,
          family_name,
          nickname,
          name,
          picture,
          email,
        } = req.oidc.user

        const user = new User({
          groups: [],
          profile: {
            email,
            first_name: given_name,
            last_name: family_name,
            username: nickname,
            photo_url: picture,
            created_at: Date.now(),
          }
        })

        user.save().then(() => {
          res.locals.user = user.toJSON()
          res.render('pages/index', {result: null, user: res.locals.user})
        })
      } else {
        res.locals.user = user.toJSON()
        next()
      }
    })
  } else {
    next()
  }
})

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.render('pages/index', {result: null, user: res.locals.user})
})

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user))
})

app.get('/words/',  (req, res) => {
  Word.find({}, (err, result) => res.send(result))
})

app.get('/words/:word', (req, res) => {
  Word.findOne({word: req.params.word}, (err, result) => res.send(result))
})

app.get('/search', (req, res) => {
  Word.findOne(req.query, (err, result) => {
    res.render('pages/serp', { result, user: res.locals.user, retPath: req.originalUrl })
  })
})

app.use(bodyParser.json())

app.post('/words', claimIncludes('editor'), (req, res) => {
  console.log("req.body: ", req.body); // eslint-disable-line
  
  const word = new Word({...req.body})
  word.save((err, result) => res.send(result))
})

dbConnection.once('open', () => {
  console.log('mongo connection established'); // eslint-disable-line
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })
})

