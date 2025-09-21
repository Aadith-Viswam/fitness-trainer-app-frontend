import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExercise } from "../backend/exercises";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
    Dumbbell,
    SkipForward,
    CheckCircle2,
    PauseCircle,
    Flag,
    ArrowLeft,
    XCircle,
    ArrowRight,
} from "lucide-react";
import { createprogress } from "../backend/api";

function Exercises() {
    const { Id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRest, setIsRest] = useState(true);
    const [timer, setTimer] = useState(0);

    const handleCompleteWorkout = async () => {
        
        return await createprogress(Id, 100);
    }

    // Fetch data
    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await getExercise(Id);
                if (res?.data) {
                    setData(res.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch workouts");
            } finally {
                setLoading(false);
            }
        };
        if (Id) fetchWorkouts();
    }, [Id]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Skip exercise completely
    const handleSkipExercise = () => {
        if (currentIndex + 1 < data.length) {
            setCurrentIndex((prev) => prev + 1);
            setIsRest(true);
        } else {
            setCurrentIndex(data.length);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white text-gray-800">
                <h1 className="text-2xl font-bold animate-pulse">Loading workout...</h1>
            </div>
        );
    }

    if (currentIndex >= data.length) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-white text-gray-800 px-4">
                <CheckCircle2 className="w-20 h-20 mb-4 text-green-500 animate-bounce" />
                <h1 className="text-4xl font-extrabold">Workout Completed 🎉</h1>
                <p className="mt-2 text-lg text-gray-600">Awesome job, keep going!</p>
                <button
                    onClick={() => {
                        handleCompleteWorkout()
                        navigate(-1)
                    }}
                    className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-blue-400 transition"
                >
                    Continue<ArrowRight className="w-5 h-5" /> 
                </button>
            </div>
        );
    }

    const current = data[currentIndex];

    return (
        <div className="relative flex flex-col justify-center items-center h-screen bg-white text-gray-900 px-6">
            <Toaster />

            {/* Exit Button (Top Right) */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-full flex items-center gap-2 hover:bg-red-400 transition shadow-md"
            >
                <XCircle className="w-5 h-5" /> Exit
            </button>

            {/* Progress */}
            <div className="absolute top-4 left-4 text-sm text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full shadow">
                {currentIndex + 1} / {data.length}
            </div>

            {isRest ? (
                <motion.div
                    key="rest"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                >
                    <PauseCircle className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
                    <h2 className="text-3xl font-bold">Rest Time</h2>
                    <motion.h3
                        key={timer}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-5xl font-extrabold mt-4 text-yellow-600"
                    >
                        {timer}s
                    </motion.h3>

                    {/* 🔥 Motivational Message */}
                    <p className="mt-4 text-lg text-gray-700 italic">
                        {[
                            "Keep going, you're doing great! 💪",
                            "Stay strong, the next set is coming!",
                            "Almost there, stay focused!",
                            "Breathe, recover, and get ready!",
                        ][currentIndex % 4]}
                    </p>

                    {/* 🔥 Next Exercise Preview */}
                    {currentIndex + 1 < data.length && (
                        <div className="mt-6 bg-gray-100 rounded-2xl shadow-md p-4 flex items-center gap-4">
                            <img
                                // src={data[currentIndex].imgURL}
                                src={data[currentIndex].imgURL}
                                alt={data[currentIndex].name}
                                className="w-20 h-20 object-cover rounded-xl shadow"
                            />
                            <div className="text-left">
                                <p className="text-sm text-gray-500">Up Next</p>
                                <h4 className="text-lg font-bold text-gray-800">
                                    {data[currentIndex].name}
                                </h4>
                                <p className="text-sm text-blue-600 font-semibold">
                                    {data[currentIndex + 1].count > 1
                                        ? `${data[currentIndex].count} reps`
                                        : `${data[currentIndex].duration} sec`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-yellow-400 transition"
                        >
                            Skip Rest <SkipForward className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key={current._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <Dumbbell className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <h2 className="text-4xl font-extrabold">{current.name}</h2>
                    <motion.img
                        src={current.imgURL}
                        alt={current.name}
                        className="w-72 h-72 object-cover mx-auto rounded-2xl shadow-lg my-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                    />
                    <p className="text-lg text-gray-600 mb-3">{current.description}</p>
                    <p className="text-sm text-gray-500">
                        Target: <b>{current.targetMuscle}</b> | Level:{" "}
                        <b>{current.level}</b>
                    </p>
                    <h3 className="mt-4 text-3xl font-bold text-blue-600">
                        {current.count > 1
                            ? `${current.count} reps`
                            : `${current.duration} sec`}
                    </h3>

                    {/* Exercise Timer */}
                    <motion.h3
                        key={timer}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-extrabold mt-4 text-blue-600"
                    >
                        {timer}s
                    </motion.h3>

                    {/* Buttons aligned side by side */}
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-blue-400 transition"
                        >
                            Skip Exercise <SkipForward className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSkipExercise}
                            className="px-6 py-3 bg-green-500 text-white font-bold rounded-full flex items-center gap-2 hover:bg-green-400 transition"
                        >
                            Complete Workout <Flag className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default Exercises;
