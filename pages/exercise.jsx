import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getExercise } from "../backend/exercises";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dumbbell,
    SkipForward,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Timer,
    Target,
    TrendingUp,
    Zap,
    Heart,
    Activity,
    Award,
    PlayCircle,
    Coffee,
    Flame,
    Star
} from "lucide-react";
import { createprogress } from "../backend/api";

function Exercises() {
    const { workoutId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { resumeProgress = 0, isResume = false } = location.state || {};
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRest, setIsRest] = useState(true);
    const [timer, setTimer] = useState(0);

    // Fetch data
    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await getExercise(workoutId);
                if (res?.data) {
                    setData(res.data);

                    // If resuming, calculate which exercise to start from
                    if (isResume && resumeProgress > 0 && resumeProgress < 100) {
                        const totalExercises = res.data.length;
                        const resumeIndex = Math.floor((resumeProgress / 100) * totalExercises);
                        const safeIndex = Math.min(resumeIndex, totalExercises - 1);
                        
                        setCurrentIndex(safeIndex);
                        setIsRest(true);

                        toast.success(`Resuming from ${resumeProgress}% complete! 💪`, {
                            duration: 3000,
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch workouts");
            } finally {
                setLoading(false);
            }
        };
        if (workoutId) fetchWorkouts();
    }, [workoutId, isResume, resumeProgress]);

    // Timer logic
    useEffect(() => {
        if (loading || data.length === 0 || currentIndex >= data.length) return;

        let time = isRest ? data[currentIndex].rest : data[currentIndex].duration;
        setTimer(time);

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleNext();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRest, currentIndex, loading, data]);

    // Next step
    const handleNext = () => {
        if (isRest) {
            setIsRest(false);
        } else {
            if (currentIndex + 1 < data.length) {
                setCurrentIndex((prev) => prev + 1);
                setIsRest(true);
            } else {
                setCurrentIndex(data.length);
            }
        }
    };

    const handleSkipExercise = async () => {
        if (currentIndex + 1 < data.length) {
            const perc = Math.min(((currentIndex + 1) / data.length) * 100, 100);
            await createprogress(workoutId, perc);
            setCurrentIndex((prev) => prev + 1);
            setIsRest(true);
        } else {
            await createprogress(workoutId, 100);
            setCurrentIndex(data.length);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Dumbbell className="w-16 h-16 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mt-4 animate-pulse">Loading your workout...</h1>
            </div>
        );
    }

    if (currentIndex >= data.length) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 px-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                >
                    <div className="relative">
                        <Award className="w-32 h-32 text-yellow-300 drop-shadow-2xl" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-2 -right-2"
                        >
                            <Star className="w-12 h-12 text-yellow-200" />
                        </motion.div>
                    </div>
                </motion.div>
                <h1 className="text-5xl font-extrabold text-white mt-6 text-center">
                    Workout Complete!
                </h1>
                <p className="mt-3 text-xl text-white/90 text-center">
                    🔥 Amazing effort! You crushed it! 💪
                </p>

                <motion.div
                    className="mt-8 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-4 text-white">
                        <CheckCircle2 className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-80">Exercises Completed</p>
                            <p className="text-3xl font-bold">{data.length}</p>
                        </div>
                    </div>
                </motion.div>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 px-8 py-4 bg-white text-emerald-600 font-bold rounded-full flex items-center gap-3 hover:bg-white/90 transition shadow-2xl text-lg"
                >
                    Continue <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        );
    }

    const current = data[currentIndex];
    const progress = Math.min(((currentIndex + (isRest ? 0 : 0.5)) / data.length) * 100, 100);

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-8">
            <Toaster position="top-center" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Exit Button */}
            <motion.button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 px-5 py-2.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full flex items-center gap-2 hover:bg-red-600 transition shadow-lg z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <XCircle className="w-5 h-5" /> Exit
            </motion.button>

            {/* Progress Bar & Counter */}
            <div className="absolute top-6 left-6 right-24 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-white/80">
                        Exercise {currentIndex + 1} of {data.length}
                    </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isRest ? (
                    <motion.div
                        key="rest"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="text-center max-w-lg w-full mt-20"
                    >
                        {/* Rest Icon with Pulse */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block"
                        >
                            <div className="relative">
                                <Coffee className="w-24 h-24 mx-auto text-amber-400 drop-shadow-2xl" />
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 w-24 h-24 mx-auto bg-amber-400/30 rounded-full blur-xl"
                                />
                            </div>
                        </motion.div>

                        <h2 className="text-4xl font-bold mt-6 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                            Rest & Recover
                        </h2>

                        {/* Timer Circle */}
                        <div className="relative w-48 h-48 mx-auto mt-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="8"
                                    fill="none"
                                />
                                <motion.circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 1 }}
                                    animate={{ pathLength: timer / (data[currentIndex]?.rest || 1) }}
                                    transition={{ duration: 0.5 }}
                                    strokeDasharray="552.64"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                                        <stop offset="0%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Timer className="w-8 h-8 text-amber-300 mb-2" />
                                <motion.span
                                    key={timer}
                                    initial={{ scale: 1.3, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-6xl font-extrabold text-white"
                                >
                                    {timer}
                                </motion.span>
                                <span className="text-sm text-white/60 mt-1">seconds</span>
                            </div>
                        </div>

                        {/* Motivational Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                        >
                            <Heart className="w-6 h-6 mx-auto text-pink-400 mb-2" />
                            <p className="text-lg text-white/90 italic">
                                {[
                                    "You're crushing it! 💪",
                                    "Stay strong, warrior! 🔥",
                                    "Breathe and refocus! ✨",
                                    "Almost there, keep going! 🚀",
                                ][currentIndex % 4]}
                            </p>
                        </motion.div>

                        {/* Next Exercise Preview */}
                        {currentIndex < data.length && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center gap-4"
                            >
                                <img
                                    src={data[currentIndex].imgURL}
                                    alt={data[currentIndex].name}
                                    className="w-24 h-24 object-cover rounded-xl shadow-2xl ring-2 ring-white/20"
                                />
                                <div className="text-left flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Up Next</p>
                                    </div>
                                    <h4 className="text-xl font-bold text-white">
                                        {data[currentIndex].name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Target className="w-4 h-4 text-blue-400" />
                                        <p className="text-sm text-blue-300 font-semibold">
                                            {data[currentIndex].count > 1
                                                ? `${data[currentIndex].count} reps`
                                                : `${data[currentIndex].duration} sec`}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Skip Button */}
                        <motion.button
                            onClick={handleNext}
                            className="mt-8 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full flex items-center gap-3 hover:from-amber-600 hover:to-orange-600 transition shadow-2xl mx-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Skip Rest <SkipForward className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={current._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-2xl w-full mt-20"
                    >
                        {/* Exercise Icon */}
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Flame className="w-20 h-20 mx-auto text-orange-400 drop-shadow-2xl" />
                        </motion.div>

                        <h2 className="text-5xl font-extrabold mt-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {current.name}
                        </h2>

                        {/* Exercise Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative mt-8 mx-auto w-80 h-80"
                        >
                            <img
                                src={current.imgURL}
                                alt={current.name}
                                className="w-full h-full object-cover rounded-3xl shadow-2xl ring-4 ring-purple-500/30"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
                        </motion.div>

                        {/* Exercise Details */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <Target className="w-6 h-6 mx-auto text-pink-400 mb-2" />
                                <p className="text-xs text-white/60 uppercase tracking-wider">Target</p>
                                <p className="text-lg font-bold">{current.targetMuscle}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <TrendingUp className="w-6 h-6 mx-auto text-green-400 mb-2" />
                                <p className="text-xs text-white/60 uppercase tracking-wider">Level</p>
                                <p className="text-lg font-bold">{current.level}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mt-6 text-white/80 text-lg leading-relaxed bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            {current.description}
                        </p>

                        {/* Reps/Duration */}
                        <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <PlayCircle className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                            <h3 className="text-4xl font-extrabold text-white">
                                {current.count > 1
                                    ? `${current.count} reps`
                                    : `${current.duration} seconds`}
                            </h3>
                        </div>

                        {/* Timer */}
                        <motion.div
                            key={timer}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-6 text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                        >
                            {timer}s
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-center gap-4 flex-wrap">
                            <motion.button
                                onClick={handleNext}
                                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full flex items-center gap-3 hover:from-blue-600 hover:to-purple-600 transition shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SkipForward className="w-5 h-5" /> Skip Exercise
                            </motion.button>
                            <motion.button
                                onClick={handleSkipExercise}
                                className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full flex items-center gap-3 hover:from-green-600 hover:to-emerald-600 transition shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <CheckCircle2 className="w-5 h-5" /> Mark Complete
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Exercises;