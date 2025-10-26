import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProgress } from "../backend/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Award, Target, Flame, Calendar, BarChart3, Activity, Zap, Trophy, CheckCircle2, Clock, Star, Sparkles, ChevronRight, Dumbbell, CircleDot, PlayCircle } from "lucide-react";
import ResumeWorkoutModal from "./ResumeWorkoutModal";

function ProgressExercise() {
    const [pr, setPr] = useState([]);
    const [selectedView, setSelectedView] = useState("bar");
    const [resumeModal, setResumeModal] = useState({
        isOpen: false,
        workoutId: null,
        workoutName: '',
        progress: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function progressdata() {
            const res = await getProgress();
            // Cap all percentages at 100
            const cappedData = res.data.map(item => ({
                ...item,
                percentage: Math.min(Math.round(item.percentage), 100)
            }));
            setPr(cappedData);
        }
        progressdata();
    }, []);

    const COLORS = [
        "#3B82F6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4",
        "#06B6D4", "#6366F1", "#F97316", "#14B8A6", "#A855F7",
        "#EF4444", "#22C55E", "#0EA5E9", "#F472B6", "#84CC16"
    ];

    const avgProgress = pr.length > 0 
        ? Math.round(pr.reduce((a, b) => a + b.percentage, 0) / pr.length) 
        : 0;
    const completedWorkouts = pr.filter(w => w.percentage === 100).length;
    const totalWorkouts = pr.length;
    const inProgressWorkouts = pr.filter(w => w.percentage > 0 && w.percentage < 100).length;

    const motivation = pr.length === 0
        ? "🚀 No progress yet. Start your first workout!"
        : avgProgress === 100
        ? "💪 Incredible! You've mastered all workouts!"
        : avgProgress >= 75
        ? "🔥 Great job! Keep pushing to reach 100%!"
        : avgProgress >= 50
        ? "💥 Good progress! You're halfway there!"
        : "🏃 Keep going! Every step counts!";

    const radarData = pr.slice(0, 6).map(item => ({
        workout: item.workoutName.slice(0, 15),
        progress: item.percentage
    }));

    const handleWorkoutClick = (workout) => {
        // The workout object from progress has workoutId field (not _id)
        const wId = workout.workoutId || ""
        
        if (workout.percentage > 0 && workout.percentage < 100) {
            setResumeModal({
                isOpen: true,
                workoutId: wId,
                workoutName: workout.workoutName,
                progress: workout.percentage
            });
        } else if (workout.percentage === 100) {
            // Restart completed workout
            setResumeModal({
                isOpen: true,
                workoutId: wId,
                workoutName: workout.workoutName,
                progress: 100
            });
        } else {
            navigate(`/exercise/${wId}`);
        }
    };

    const handleResume = () => {
        if (!resumeModal.workoutId) {
            toast.error("Invalid workout ID");
            return;
        }
        navigate(`/exercise/${resumeModal.workoutId}`, {
            state: { 
                isResume: true, 
                resumeProgress: resumeModal.progress 
            }
        });
        setResumeModal({ isOpen: false, workoutId: null, workoutName: '', progress: 0 });
    };

    const handleRestart = () => {
        if (!resumeModal.workoutId) {
            toast.error("Invalid workout ID");
            return;
        }
        navigate(`/exercise/${resumeModal.workoutId}`, {
            state: { 
                isResume: false, 
                resumeProgress: 0 
            }
        });
        setResumeModal({ isOpen: false, workoutId: null, workoutName: '', progress: 0 });
    };

    const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative overflow-hidden rounded-3xl p-6 shadow-xl bg-gradient-to-br ${gradient}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
                <p className="text-white text-3xl font-extrabold">{value}</p>
            </div>
        </motion.div>
    );

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all mb-6 hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                        </button>

                        <div className="text-center mb-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                                <span className="text-white font-semibold">Your Fitness Journey</span>
                            </motion.div>
                            <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Progress Dashboard
                            </h1>
                            <p className="text-xl text-gray-600 font-medium">{motivation}</p>
                        </div>
                    </motion.div>

                    {pr.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl shadow-2xl p-16 text-center"
                        >
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Dumbbell className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Progress Yet</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Start your first workout to track your progress and see amazing visualizations!
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Start First Workout
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <StatCard icon={Trophy} label="Average Progress" value={`${avgProgress}%`} color="bg-blue-500" gradient="from-blue-500 to-blue-600" />
                                <StatCard icon={CheckCircle2} label="Completed" value={completedWorkouts} color="bg-green-500" gradient="from-green-500 to-emerald-600" />
                                <StatCard icon={Activity} label="In Progress" value={inProgressWorkouts} color="bg-orange-500" gradient="from-orange-500 to-amber-600" />
                                <StatCard icon={Target} label="Total Workouts" value={totalWorkouts} color="bg-purple-500" gradient="from-purple-500 to-purple-600" />
                            </div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <Flame className="w-7 h-7 text-orange-500" />
                                    Your Workouts
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pr.map((workout, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                            onClick={() => handleWorkoutClick(workout)}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">
                                                        {workout.workoutName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Progress Tracked</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                >
                                                    {workout.percentage}%
                                                </div>
                                            </div>

                                            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(workout.percentage, 100)}%` }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`
                                                    }}
                                                />
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {workout.percentage === 100 ? (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm font-semibold text-green-600">Completed</span>
                                                        </>
                                                    ) : workout.percentage > 0 ? (
                                                        <>
                                                            <Activity className="w-4 h-4 text-orange-500" />
                                                            <span className="text-sm font-semibold text-orange-600">In Progress</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-semibold text-gray-500">Not Started</span>
                                                        </>
                                                    )}
                                                </div>
                                                {workout.percentage > 0 && workout.percentage < 100 && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 bg-orange-100 rounded-full hover:bg-orange-200 transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleWorkoutClick(workout);
                                                        }}
                                                    >
                                                        <PlayCircle className="w-5 h-5 text-orange-600" />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedView("bar")}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg ${
                                        selectedView === "bar"
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    Bar Chart
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedView("pie")}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg ${
                                        selectedView === "pie"
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <CircleDot className="w-5 h-5" />
                                    Pie Chart
                                </motion.button>
                                {radarData.length >= 3 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedView("radar")}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg ${
                                            selectedView === "radar"
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                : "bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Target className="w-5 h-5" />
                                        Radar View
                                    </motion.button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {selectedView === "bar" && (
                                    <motion.div
                                        key="bar"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white rounded-3xl p-8 shadow-2xl mb-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                                <BarChart3 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800">Progress Overview</h3>
                                                <p className="text-gray-500 text-sm">Track your workout completion</p>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={pr} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis
                                                    dataKey="workoutName"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                                />
                                                <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontWeight: 600 }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#fff",
                                                        borderRadius: "16px",
                                                        border: "none",
                                                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                                                    }}
                                                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                                <Bar dataKey="percentage" radius={[10, 10, 0, 0]} animationDuration={1000}>
                                                    {pr.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                )}

                                {selectedView === "pie" && (
                                    <motion.div
                                        key="pie"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white rounded-3xl p-8 shadow-2xl mb-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                                <CircleDot className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800">Distribution View</h3>
                                                <p className="text-gray-500 text-sm">See your workout balance</p>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height={450}>
                                            <PieChart>
                                                <Pie
                                                    data={pr}
                                                    dataKey="percentage"
                                                    nameKey="workoutName"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={140}
                                                    innerRadius={80}
                                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                    labelLine={false}
                                                    animationDuration={1000}
                                                >
                                                    {pr.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#fff",
                                                        borderRadius: "16px",
                                                        border: "none",
                                                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                                                    }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: "30px" }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                )}

                                {selectedView === "radar" && radarData.length >= 3 && (
                                    <motion.div
                                        key="radar"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white rounded-3xl p-8 shadow-2xl mb-8"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                                                <Target className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800">Performance Radar</h3>
                                                <p className="text-gray-500 text-sm">Compare workout progress</p>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height={450}>
                                            <RadarChart data={radarData}>
                                                <PolarGrid stroke="#e5e7eb" />
                                                <PolarAngleAxis dataKey="workout" tick={{ fill: "#6b7280", fontSize: 12 }} />
                                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#6b7280" }} />
                                                <Radar
                                                    name="Progress"
                                                    dataKey="progress"
                                                    stroke="#3B82F6"
                                                    fill="#3B82F6"
                                                    fillOpacity={0.6}
                                                    animationDuration={1000}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#fff",
                                                        borderRadius: "16px",
                                                        border: "none",
                                                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                                                    }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Award className="w-8 h-8 text-amber-500" />
                                    <h3 className="text-2xl font-bold text-gray-800">Achievements</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {completedWorkouts > 0 && (
                                        <div className="bg-white rounded-2xl p-6 text-center">
                                            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                                            <h4 className="font-bold text-gray-800 mb-1">Workout Warrior</h4>
                                            <p className="text-sm text-gray-600">
                                                Completed {completedWorkouts} workout{completedWorkouts !== 1 && "s"}!
                                            </p>
                                        </div>
                                    )}
                                    {avgProgress >= 50 && (
                                        <div className="bg-white rounded-2xl p-6 text-center">
                                            <Star className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                                            <h4 className="font-bold text-gray-800 mb-1">Rising Star</h4>
                                            <p className="text-sm text-gray-600">{avgProgress}% average progress!</p>
                                        </div>
                                    )}
                                    {totalWorkouts >= 5 && (
                                        <div className="bg-white rounded-2xl p-6 text-center">
                                            <Flame className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                                            <h4 className="font-bold text-gray-800 mb-1">On Fire</h4>
                                            <p className="text-sm text-gray-600">Tracking {totalWorkouts} workouts!</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>
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

export default ProgressExercise;