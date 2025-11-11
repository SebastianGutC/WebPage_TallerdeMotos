import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
// Foundation
import $ from 'jquery'
import 'foundation-sites'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;


$(document).foundation();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

