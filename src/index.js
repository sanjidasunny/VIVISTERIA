import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="624543621585-cd4v2cfedq8jn11dk5kkjuhfahh6chej.apps.googleusercontent.com"><App /></GoogleOAuthProvider>

  </React.StrictMode>
);

//   624543621585-cd4v2cfedq8jn11dk5kkjuhfahh6chej.apps.googleusercontent.com
reportWebVitals();
