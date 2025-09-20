import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ai, getUserData, logoutUser } from "../backend/api";
import { getWorkouts } from "../backend/exercises";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Dumbbell, MoveRight, MessageCircle, Send } from "lucide-react";

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
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="fixed w-[66%] top-4 left-1/2 transform -translate-x-1/2 
                   bg-white/90 backdrop-blur-lg shadow-2xl rounded-full
                   px-6 py-3 flex items-center justify-between gap-6
                   max-w-[90%] z-50"
        >
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <Dumbbell className="w-6 h-6 text-blue-500" />
                <h1 className="text-lg font-bold text-gray-800">Fitness App</h1>
            </div>

            {/* Right: User + Logout */}
            <div className="flex items-center gap-4">
                {user && (
                    
                        <span className="text-gray-600 text-sm font-medium truncate max-w-[120px]">
                        Hi,&nbsp;
                    <span className="text-lg text-black font-semibold">{user.name || user.email}</span>
                    </span>
                    
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm 
                         font-semibold rounded-full shadow hover:shadow-lg hover:bg-red-600 transition"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </motion.nav>
    );

}

function Workouts() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await getWorkouts();
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
        fetchWorkouts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg animate-pulse">Loading workouts...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return <p className="text-center text-gray-500">No workouts found.</p>;
    }

    // Group workouts by target muscle
    const grouped = data.reduce((acc, workout) => {
        const key = workout.targetMuscle || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(workout);
        return acc;
    }, {});

    return (
        <div className="p-6 max-w-7xl mx-auto mt-24">
            <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
                All Workouts
            </h2>

            {Object.keys(grouped).map((muscle) => (
                <motion.div
                    key={muscle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <h3 className="text-2xl font-bold mb-4 text-gray-700 border-l-4 border-blue-500 pl-3">
                        {muscle} Workouts
                    </h3>
                    <div className="flex flex-col gap-2">
                        {grouped[muscle].map((workout) => (
                            <motion.div
                                key={workout._id}
                                whileHover={{ scale: 1.05 }}
                                className="p-5 bg-white flex rounded-2xl shadow-lg hover:shadow-2xl 
                           transition cursor-pointer items-center justify-between"
                                onClick={() => navigate(`/exercise/${workout._id}`)}
                            >
                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-gray-800">
                                        {workout.name}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-1">
                                        Level: {workout.level}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-1">
                                        Duration: {workout.duration} mins
                                    </p>
                                </div>
                                <MoveRight size={40} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
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

        // Add user message
        setMessages((prev) => [...prev, { type: "user", text: prompt }]);
        setLoading(true);

        try {
            console.log("Pro:", prompt)
            const response = await ai(prompt); // call backend AI
            setMessages((prev) => [...prev, { type: "ai", text: response.message }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { type: "ai", text: "Error: Could not get AI response." },
            ]);
        } finally {
            setLoading(false);
            setPrompt("");
        }
    };

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div>
            {/* Floating bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-500 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition z-50"
            >
                <MessageCircle className="w-8 h-8" />
            </button>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-6 right-10 w-96 h-[85%] max-w-full md:w-96 md:right-10 md:top-6 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-50
                               sm:w-[90%] sm:right-2 sm:h-[70%] sm:bottom-4 sm:top-auto"
                    >
                        {/* Header */}
                        <div className="bg-blue-500 text-white font-bold p-4 flex justify-between items-center">
                            <span>AI Chat</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`${msg.type === "user" ? "text-right" : "text-left"}`}
                                >
                                    <div
                                        className={`inline-block px-4 py-2 rounded-lg ${msg.type === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="text-left text-gray-400 animate-pulse">
                                    AI is typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t flex gap-2">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Type your prompt..."
                                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                            >
                                <Send className="w-4 h-4" /> Send
                            </button>
                        </div>
                    </motion.div>
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
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" reverseOrder={false} />
            <Navbar user={user} setUser={setUser} />
            <div>
                <AIChat />

            </div>
            <main className="pt-6">
                <Workouts />
            </main>
        </div>
    );
}

export default Main;
