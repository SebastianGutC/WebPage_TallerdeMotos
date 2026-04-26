import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Foundation
import 'foundation-sites/dist/css/foundation.min.css';

import $ from 'jquery'
import 'foundation-sites'

import './styles/global.css'

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import './styles/global.css'
import { AuthProvider } from './context/AuthProvider';

config.autoAddCss = false;

$(document).foundation();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

