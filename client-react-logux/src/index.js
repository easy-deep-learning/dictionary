import React from 'react';
import ReactDOM from 'react-dom';
import { CrossTabClient,  badge, badgeEn, log } from '@logux/client'
import { badgeStyles } from '@logux/client/badge/styles'
import { createStoreCreator } from '@logux/redux'
import { Provider } from 'react-redux'

import reducer from './reducers'
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

const client = new CrossTabClient({
  server: process.env.NODE_ENV === 'development'
    ? 'ws://localhost:31337'
    : 'wss://logux.example.com',
  subprotocol: '1.0.0',
  userId: 'anonymous',  // TODO: We will fill it in Authentication recipe
  token: ''  // TODO: We will fill it in Authentication recipe
})

const createStore = createStoreCreator(client)
const store = createStore(reducer)

badge(store.client, { messages: badgeEn, styles: badgeStyles })
log(store.client)
store.client.start()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}><App /></Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
