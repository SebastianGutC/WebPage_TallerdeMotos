import { BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header/Header";
import AppRouter from "./router/AppRouter";
import Footer from "./components/common/Footer/Footer";
import { CartProvider } from "./context/CartContext";
import AuthModals from "./context/AuthModals";

function App() {
  return (
    <BrowserRouter>
      <CartProvider> 
        <div className="app-container">
          <Header />
          <main className="main-content">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </CartProvider>
      <AuthModals />
    </BrowserRouter>
  );
}

export default App;




