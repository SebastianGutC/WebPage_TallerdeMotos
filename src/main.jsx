import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
// Foundation
import $ from 'jquery'
import 'foundation-sites'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

$(document).ready(() => {
  $(document).foundation()
})