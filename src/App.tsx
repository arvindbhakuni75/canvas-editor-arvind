import { useAuth } from "./context/AuthContext";
import { CanvasProvider } from "./context/CanvasContext";
import { Login, Home } from "./pages";


function App() {
  const { token } = useAuth() || {};

  return (
    <>
      {!token ? (
        <Login />
      ) : (
        <CanvasProvider>
          <Home />
        </CanvasProvider>
      )}
    </>
  );
}

export default App;
