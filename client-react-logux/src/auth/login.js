import { Client } from '@logux/client'

function login (email, password) {
  let client = new Client({
    subprotocol: '1.0.0',
    server: process.env.NODE_ENV === 'development'
      ? 'ws://localhost:31337'
      : 'wss://logux.example.com',
    userId: 'anonymous'
  })

  client.type('login/done', action => {
    localStorage.setItem('userId', action.userId)
    localStorage.setItem('token', action.token)
    location.href = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/dashboard'
      : 'https://app.example.com/dashboard'
  })
  client.type('logux/undo', action => {
    alert(action.reason)
  })
  client.start()
  client.log.add({ type: 'login', email, password }, { sync: true })
}
