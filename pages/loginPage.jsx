import { useState } from "react";
import { loginUser } from "../backend/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  LogIn
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const loginData = { email: email, pass: password };
    const res = await loginUser(loginData);

    if (res?.data?.token) {
      setIsSuccess(true);
      setMessage("Welcome back! Redirecting...");
      localStorage.setItem("token", res?.data?.token);
      setTimeout(() => navigate("/"), 1000);
    } else {
      setIsSuccess(false);
      setMessage(res?.message || "Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 150, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-32 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-32 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"
        />
      </div>

      {/* Left Side - Welcome Message (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col text-white mr-20 max-w-lg z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-8"
        >
          <div className="relative">
            <Dumbbell className="w-24 h-24 mb-4" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-24 h-24 bg-white/30 rounded-full blur-xl"
            />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          Welcome Back, Champion!
        </h1>
        <p className="text-2xl text-white/90 mb-10">
          Continue your journey to peak fitness and unlock your true potential.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, value: "50K+", label: "Active Users" },
            { icon: TrendingUp, value: "1M+", label: "Workouts Done" },
            { icon: Award, value: "4.9★", label: "App Rating" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md z-10"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
          >
            <Dumbbell className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-gray-700 text-sm">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-4 rounded-xl ${
                isSuccess 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <span className="text-xl flex-shrink-0">⚠️</span>
              )}
              <p className="text-sm font-medium">{message}</p>
            </motion.div>
          )}

          {/* Signup Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-indigo-600 font-bold hover:text-purple-600 transition inline-flex items-center gap-1"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </form>

        {/* Social Login Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}