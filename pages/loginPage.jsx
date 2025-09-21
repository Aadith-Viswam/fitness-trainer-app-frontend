// LoginPage.jsx
import { useState } from "react";
import { loginUser } from "../backend/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react"; // Lucide icon for fitness logo

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email: email, pass: password };
    const res = await loginUser(loginData);

    if (res?.data?.token) {
      setMessage("Login successful!");
      localStorage.setItem("token", res?.data?.token);
      navigate("/");
    } else {
      setMessage(res?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-96 flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Dumbbell className="w-12 h-12 text-blue-500 mx-auto" />
        </motion.div>

        {/* App Name */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
          Fitness App
        </h1>

        {/* Motivational Tagline */}
        <p className="text-gray-500 mb-8 text-center">
          Track your progress, achieve your goals
        </p>

        {/* Email Input */}
        <label className="self-start mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your email"
          required
        />

        {/* Password Input */}
        <label className="self-start mb-2 font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your password"
          required
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-xl font-semibold text-lg hover:bg-blue-600 shadow-lg transition-all"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}
      </motion.form>
    </div>
  );
}
