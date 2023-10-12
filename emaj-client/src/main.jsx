import './index.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { ThemeProvider } from '@mui/system';
import { theme } from './theme.js';

import { Provider } from 'react-redux';
import { store } from './redux/StoreConfig';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  </Provider>
)
