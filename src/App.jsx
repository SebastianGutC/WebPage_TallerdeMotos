import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import AppRouter from "./router/AppRouter"

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