// SignupPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../backend/api";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signupUser({ name, email, pass: password });

    if (res?.data?.token) {
      setMessage("Signup successful! Redirecting...");
      localStorage.setItem("token", res?.data?.token);
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage(res?.message || "Signup failed");
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
          Create your account and start tracking your progress!
        </p>

        {/* Name Input */}
        <label className="self-start mb-2 font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your name"
          required
        />

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

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-xl font-semibold text-lg hover:bg-green-600 shadow-lg transition-all"
        >
          Signup
        </button>

        {/* Login Link */}
        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Login
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
