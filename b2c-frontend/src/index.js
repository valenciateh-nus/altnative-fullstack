import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { createTheme, ThemeProvider } from '@mui/material';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Components/Notus/assets/styles/tailwind.css";
import "./Components/Notus/assets/styles/docs.css";
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
  palette : {
    primary : {//yellow
      main : '#FED279',
      light : '#FFE8BC',
      veryLight : '#FFFAF0',
    },
    secondary : {//orange
      main : '#FB7A56',
      light : '#FDBCAB',
      veryLight: '#ffeee3'
    },
    action : {
      disabledBackground : '#FFE8BC',
      hover : '#FFE8BC',
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

    <Provider store = {store}>
      <PersistGate loading = {null} persistor={persistor}>
        <ThemeProvider theme = {theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

export default App;
