import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import AppRouter from "./router/AppRouter"
import 'foundation-sites/dist/css/foundation.min.css'
import 'foundation-sites/dist/js/foundation.min.js'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;