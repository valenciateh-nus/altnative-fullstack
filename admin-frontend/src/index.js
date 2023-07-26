import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { createTheme, ThemeProvider } from '@mui/material';
// import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from 'react-router-dom';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const theme = createTheme({
  palette : {
    primary : {//yellow
      main : '#DAAEEA',
      light : '#F0DFF6',
      veryLight : '#F8F0FB',
    },
    secondary : {//orange
      main : '#6320EE',
      light : '#7C41F1',
    },
    action : {
      disabledBackground : '#B4ADFF',
      hover : '#B4ADFF',
    }
  },
  text : {
    primary: '#515151',
    secondary: '#A0A3B1',
    disabled : '#FFFFFF'
  },
  shape : {
    borderRadius : 12,
  },
  typography : {
    fontFamily : "Poppins, Roboto, Helvetica, Arial, sans-serif",
    subtitle2 : {
      color : '#A0A3B1'
    }
  }

})

ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store}>
      <PersistGate loading = {null} persistor={persistor}>
        <ThemeProvider theme = {theme}>
        <BrowserRouter>
          <App />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

export default App;
