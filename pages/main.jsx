import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ai, getUserData, logoutUser, getProgress } from "../backend/api";
import { getWorkouts } from "../backend/exercises";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import ResumeWorkoutModal from "./ResumeWorkoutModal";
import { 
    LogOut, 
    Dumbbell, 
    MessageCircle, 
    Send, 
    BarChart2,
    Sparkles,
    Clock,
    Target,
    Zap,
    TrendingUp,
    User,
    X,
    Bot,
    ChevronRight,
    Activity,
    PlayCircle
} from "lucide-react";

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await logoutUser();
            if (res?.message) {
                localStorage.removeItem("token");
                setUser(null);
                toast.success("Logged out successfully!");
                navigate("/login");
            } else {
                toast.error("Cannot logout user");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        }
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="fixed w-[90%] max-w-6xl top-6 left-1/2 transform -translate-x-1/2 
               bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl
               px-8 py-4 flex items-center justify-between gap-6 z-50
               border border-gray-100"
        >
            <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/")}
            >
                <div className="relative">
                    <Dumbbell className="w-7 h-7 text-blue-500" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 w-7 h-7 bg-blue-400 rounded-full blur-md"
                    />
                </div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    FitPro
                </h1>
            </motion.div>

            <div className="flex items-center gap-3">
                {user && (
                    <motion.div 
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Welcome back</span>
                            <span className="text-sm font-bold text-gray-800 truncate max-w-[120px]">
                                {user.name || user.email}
                            </span>
                        </div>
                    </motion.div>
                )}

                <motion.button
                    onClick={() => navigate("/progress")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                   rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="View Progress"
                >
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-sm font-semibold hidden sm:inline">Progress</span>
                </motion.button>

                <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white 
                 font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Logout</span>
                </motion.button>
            </div>
        </motion.nav>
    );
}

function Workouts() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState([]);
    const [resumeModal, setResumeModal] = useState({
        isOpen: false,
        workoutId: null,
        workoutName: '',
        progress: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workoutsRes, progressRes] = await Promise.all([
                    getWorkouts(),
                    getProgress()
                ]);
                
                if (workoutsRes?.data) {
                    setData(workoutsRes.data);
                }
                if (progressRes?.data) {
                    setProgressData(progressRes.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch workouts");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleWorkoutClick = (workout, e) => {
        e.stopPropagation();
        
        // Find progress for this workout
        const workoutProgress = progressData.find(p => p.workoutId === workout._id);
        
        if (workoutProgress && workoutProgress.percentage > 0 && workoutProgress.percentage < 100) {
            // Show resume modal
            setResumeModal({
                isOpen: true,
                workoutId: workout._id,
                workoutName: workout.name,
                progress: Math.round(workoutProgress.percentage)
            });
        } else {
            // Start fresh
            navigate(`/exercise/${workout._id}`);
        }
    };

    const handleResume = () => {
        navigate(`/exercise/${resumeModal.workoutId}`, {
            state: { 
                isResume: true, 
                resumeProgress: resumeModal.progress 
            }
        });
        setResumeModal({ isOpen: false, workoutId: null, workoutName: '', progress: 0 });
    };

    const handleRestart = () => {
        navigate(`/exercise/${resumeModal.workoutId}`, {
            state: { 
                isResume: false, 
                resumeProgress: 0 
            }
        });
        setResumeModal({ isOpen: false, workoutId: null, workoutName: '', progress: 0 });
    };

    const getWorkoutProgress = (workoutId) => {
        const progress = progressData.find(p => p.workoutId === workoutId);
        return progress ? Math.round(progress.percentage) : 0;
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-32">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Dumbbell className="w-12 h-12 text-blue-500" />
                </motion.div>
                <p className="text-gray-500 text-lg mt-4 animate-pulse">Loading workouts...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-20">
                <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No workouts found.</p>
            </div>
        );
    }

    const grouped = data.reduce((acc, workout) => {
        const key = workout.targetMuscle || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(workout);
        return acc;
    }, {});

    const muscleIcons = {
        "Chest": "💪",
        "Back": "🏋️",
        "Legs": "🦵",
        "Arms": "💪",
        "Shoulders": "🤸",
        "Core": "🔥",
        "Cardio": "❤️",
        "Other": "⚡"
    };

    return (
        <>
            <div className="px-4 sm:px-6 max-w-7xl mx-auto mt-32 mb-20">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-600">Your Workout Library</span>
                    </div>
                    <h2 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Choose Your Challenge
                    </h2>
                    <p className="text-gray-600 text-lg">Transform your body, one workout at a time 💪</p>
                </motion.div>

                {Object.keys(grouped).map((muscle, groupIndex) => (
                    <motion.div
                        key={muscle}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                                <span className="text-2xl">{muscleIcons[muscle] || "⚡"}</span>
                                <h3 className="text-xl font-bold text-white">{muscle}</h3>
                            </div>
                            <div className="flex-1 h-1 bg-gradient-to-r from-blue-200 to-transparent rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {grouped[muscle].map((workout, index) => {
                                const progress = getWorkoutProgress(workout._id);
                                const hasProgress = progress > 0 && progress < 100;

                                return (
                                    <motion.div
                                        key={workout._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl 
                                   transition-all cursor-pointer overflow-hidden border border-gray-100"
                                        onClick={(e) => handleWorkoutClick(workout, e)}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${workout.image})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                            
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                                                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="text-xs font-bold text-gray-800">{workout.level}</span>
                                            </div>

                                            {hasProgress && (
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                                                    <PlayCircle className="w-3.5 h-3.5 text-white" />
                                                    <span className="text-xs font-bold text-white">{progress}%</span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h4 className="text-xl font-bold text-white mb-1 line-clamp-2">
                                                    {workout.name}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-3">
                                            {hasProgress && (
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                        <span>Progress</span>
                                                        <span className="font-bold">{progress}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Duration</p>
                                                        <p className="text-sm font-bold text-gray-800">{workout.duration} min</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl">
                                                    <Target className="w-4 h-4 text-purple-500" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Target</p>
                                                        <p className="text-sm font-bold text-gray-800 truncate">{muscle}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.button
                                                className={`w-full py-3 ${hasProgress ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white font-bold rounded-xl
                                           flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl transition-all`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Zap className="w-4 h-4" />
                                                <span>{hasProgress ? 'Resume Workout' : 'Start Workout'}</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            <ResumeWorkoutModal
                isOpen={resumeModal.isOpen}
                onClose={() => setResumeModal({ ...resumeModal, isOpen: false })}
                onResume={handleResume}
                onRestart={handleRestart}
                workoutName={resumeModal.workoutName}
                progress={resumeModal.progress}
            />
        </>
    );
}

function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const sendMessage = async () => {
        if (!prompt.trim()) return;
        setMessages((prev) => [...prev, { type: "user", text: prompt }]);
        setLoading(true);

        try {
            const response = await ai(prompt);
            setMessages((prev) => [...prev, { type: "ai", text: response.message }]);
        } catch (err) {
            setMessages((prev) => [...prev, { type: "ai", text: "Error: Could not get AI response." }]);
        } finally {
            setLoading(false);
            setPrompt("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-all z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                    boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                        "0 0 40px rgba(168, 85, 247, 0.5)",
                        "0 0 20px rgba(59, 130, 246, 0.5)"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <MessageCircle className="w-7 h-7" />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-400 rounded-full blur-lg"
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="fixed bottom-28 right-8 w-96 max-w-[calc(100vw-4rem)] h-[600px] max-h-[calc(100vh-10rem)] 
                               bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">AI Fitness Coach</h3>
                                        <p className="text-xs text-white/80">Always here to help</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
                                {messages.length === 0 && (
                                    <motion.div 
                                        className="text-center py-12"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Sparkles className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                                        <p className="text-gray-600 font-medium">Ask me anything about fitness!</p>
                                        <p className="text-sm text-gray-400 mt-2">Workouts, nutrition, tips & more</p>
                                    </motion.div>
                                )}
                                
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                                                msg.type === "user"
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm"
                                                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                                            }`}
                                        >
                                            {msg.type === "ai" && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Bot className="w-4 h-4 text-blue-500" />
                                                    <span className="text-xs font-semibold text-gray-500">AI Coach</span>
                                                </div>
                                            )}
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-blue-500 rounded-full" />
                                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-blue-500 rounded-full" />
                                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-blue-500 rounded-full" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Ask about workouts, diet..."
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") sendMessage();
                                        }}
                                    />
                                    <motion.button
                                        onClick={sendMessage}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 rounded-2xl hover:shadow-lg transition flex items-center gap-2 font-semibold"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={loading || !prompt.trim()}
                                    >
                                        <Send className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function Main() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await getUserData(token);
                setUser(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Session expired. Please login again.");
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Dumbbell className="w-16 h-16 text-blue-500" />
                </motion.div>
                <p className="text-gray-500 text-lg mt-4">Loading your fitness dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Toaster 
                position="top-right" 
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#fff',
                        color: '#374151',
                        borderRadius: '16px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    },
                }}
            />
            <Navbar user={user} setUser={setUser} />
            <AIChat />
            <main className="pt-6">
                <Workouts />
            </main>
        </div>
    );
}

export default Main;