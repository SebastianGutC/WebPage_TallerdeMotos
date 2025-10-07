
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <main>
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;