import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import SignupPage from "../pages/signupPage";
import Main from "../pages/main";
import Exercises from "../pages/exercise";
import ProgressExercise from "../pages/progress";
import { useEffect } from "react";


function App() {
  let isLoggedIn
  useEffect(() => {
    isLoggedIn = localStorage.getItem("token");
  })
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
          element={<Main />}
        />
        <Route path="/exercise/:Id" element={<Exercises />} />
        <Route path="/progress" element={<ProgressExercise />} />
      </Routes>
    </Router>
  );
}

export default App;
