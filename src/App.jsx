import { BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header/Header";
import AppRouter from "./router/AppRouter"
import Footer from "./components/common/Footer/Footer";


function App() {
  return (
    <BrowserRouter>
    <div className="app-container">
      <Header />
      <main className="main-content">
        <AppRouter />
      </main>
      <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;