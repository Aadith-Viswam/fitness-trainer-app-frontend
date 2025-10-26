import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../backend/api";
import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Trophy
} from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
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
    
    const res = await signupUser({ name, email, pass: password });

    if (res?.data?.token) {
      setIsSuccess(true);
      setMessage("Account created successfully!");
      localStorage.setItem("token", res?.data?.token);
      setTimeout(() => navigate("/"), 1500);
    } else {
      setIsSuccess(false);
      setMessage(res?.message || "Signup failed. Please try again.");
    }
    setLoading(false);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 66, label: "Good", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Left Side - Features (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col text-white mr-16 max-w-md z-10"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <Dumbbell className="w-20 h-20 mb-4" />
        </motion.div>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Start Your Fitness Journey Today
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Join thousands achieving their health goals with personalized workouts and AI coaching.
        </p>

        {/* Features List */}
        <div className="space-y-4">
          {[
            { icon: Trophy, text: "Track your progress with detailed analytics" },
            { icon: Zap, text: "AI-powered workout recommendations" },
            { icon: Shield, text: "Secure and private data protection" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <feature.icon className="w-5 h-5" />
              </div>
              <p className="text-white/90">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Signup Form */}
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
          >
            <Dumbbell className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Begin your transformation journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 focus:bg-white"
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

            {/* Password Strength Indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password Strength</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.strength === 100 ? "text-green-600" :
                    passwordStrength.strength === 66 ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.strength}%` }}
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Signup Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
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

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 font-bold hover:text-purple-600 transition inline-flex items-center gap-1"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}