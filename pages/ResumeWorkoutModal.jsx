import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, X, Zap } from "lucide-react";

function ResumeWorkoutModal({ isOpen, onClose, onResume, onRestart, workoutName, progress }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back! 💪
              </h3>
              <p className="text-gray-600 text-sm">
                You've completed <span className="font-bold text-blue-600">{progress}%</span> of this workout
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Workout Info */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3 line-clamp-2">
                {workoutName}
              </p>
              <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                >
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full"
                  />
                </motion.div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-2 font-semibold">{progress}% Complete</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResume}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-5 h-5" />
              Continue from {progress}%
              <Zap className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Start from Beginning
            </motion.button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Choose wisely to continue your fitness journey! 🔥
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ResumeWorkoutModal;