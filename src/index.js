const bodyParser = require('body-parser')
const express = require('express')

/**
 * @see https://auth0.github.io/express-openid-connect/
 * */
const { auth, requiresAuth } = require('express-openid-connect')
const path = require('path')

const { dbConnection, User, Word } = require('./models')

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
  issuerBaseURL: 'https://dev-yf-kf5ze.us.auth0.com',
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

app.use((req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    User.findOne({ 'profile.email': req.oidc.user?.email }).then((user) => {
      if (!user) {
        const { given_name, family_name, nickname, picture, email } =
          req.oidc.user

        const user = new User({
          groups: [],
          profile: {
            email,
            first_name: given_name,
            last_name: family_name,
            username: nickname,
            photo_url: picture,
            created_at: Date.now(),
          },
        })

        user.save().then(() => {
          res.locals.user = user.toJSON()
          res.render('pages/index', { result: null, user: res.locals.user })
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

const rulesMap = new Map([['editWords', 'editors']])

class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.message = message || 'You must be authenticated to do this action'
    this.status = 401
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.message = message || 'You have no right to do this action'
    this.status = 403
  }
}

const authorizeForAction = (params) => (req, res, next) => {
  const { action } = params

  if (res.locals?.user) {
    if (res.locals.user.groups.includes(rulesMap.get(action))) {
      next()
    } else {
      throw new ValidationError()
    }
  } else {
    throw new UnauthorizedError()
  }
}

/* GET Routes */
app.get('/', (req, res) => {
  res.render('pages/index', { result: null, user: res.locals.user })
})

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user))
})

app.get('/words/', (req, res) => {
  Word.find({}, (err, result) => res.send(result))
})

app.get('/words/:word', (req, res) => {
  Word.findOne({ word: req.params.word }, (err, result) => res.send(result))
})

app.get('/search', (req, res) => {
  Word.find(req.query, (err, result) => {
    res.render('pages/serp', {
      result,
      query: req.query,
      user: res.locals.user,
      retPath: req.originalUrl,
    })
  })
})

/* POST Routes */
app.use(bodyParser.json())

app.post('/words', authorizeForAction({ action: 'editWords' }), (req, res) => {
  const word = new Word({ ...req.body })
  word.save((err, result) => {
    if (err) {
      res.status(500).send({ error: err })
    } else {
      res.send(result)
    }
  })
})

app.patch('/words/:word', (req, res) => {
  Word.findOneAndUpdate({ word: req.params.word }, req.body, {
    returnDocument: 'after',
  })
    .lean()
    .then((dbResult) => {
      res.send(dbResult)
    })
    .catch((dbError) => {
      res.status(500).send({ error: dbError })
    })
})

const jsonClientsErrorHandler = (err, req, res, next) => {
  if (req.xhr || req.headers.accept === 'application/json') {
    switch (err.name) {
      case 'UnauthorizedError':
        res.status(err.status).send({ error: err.message })
        break
      case 'ValidationError':
        res.status(err.status).send({ error: err.message })
        break
      default:
        res.status(500).send({ error: 'Something failed!' })
    }
  } else {
    next(err)
  }
}
app.use(jsonClientsErrorHandler)

dbConnection.once('open', () => {
  console.log('mongo connection established') // eslint-disable-line
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })
})
