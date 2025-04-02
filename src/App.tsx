import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard";
import { useAuthStore } from "./store/authStore";
import { startFinanceUpdates } from "./store/financeStore";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkSession = useAuthStore((state) => state.checkSession);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isValid = checkSession();

    if (isValid) {
      const cleanupFinance = startFinanceUpdates();
      return cleanupFinance;
    }
  }, [checkSession]);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}

export default App;
