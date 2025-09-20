import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import SignupPage from "../pages/signupPage";
import Main from "../pages/main";
import Exercises from "../pages/exercise";


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
        <Route path="/exercise/:Id" element={<Exercises />} />
      </Routes>
    </Router>
  );
}

export default App;
