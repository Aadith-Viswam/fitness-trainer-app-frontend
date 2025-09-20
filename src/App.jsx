import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import SignupPage from "../pages/signupPage";
import Main from "../pages/main";


function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route
          path="/"
          element={<Main/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
