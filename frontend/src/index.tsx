import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./../node_modules/font-awesome/css/font-awesome.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { store } from './createStore.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <BrowserRouter>
      <Provider store={store}><App /></Provider></BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
