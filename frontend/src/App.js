import "./App.css";
import AppRouter from "./routes/appRouter";
import AuthProvider from "./auth/authProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
