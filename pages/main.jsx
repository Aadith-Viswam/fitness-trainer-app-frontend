import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, logoutUser } from "../backend/api";
import { getWorkouts } from "../backend/exercises";
import toast, { Toaster } from "react-hot-toast";

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
        <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Fitness App</h1>
            <div className="flex items-center space-x-4">
                {user && <span className="text-gray-200">Welcome, {user.name || user.email}</span>}
                <button
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

function Workouts() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await getWorkouts();
                if (res?.data) {
                    setData(res.data); // backend sends { data: [...] }
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

    if (loading)
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg">Loading workouts...</p>
            </div>
        );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">All Workouts</h2>
            {data.length === 0 ? (
                <p className="text-center text-gray-500">No workouts found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((workout) => (
                        <div
                            key={workout._id}
                            className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                        >
                            <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                            <p className="text-gray-700 mb-1">Target Muscle: {workout.targetMuscle}</p>
                            <p className="text-gray-700 mb-1">Level: {workout.level}</p>
                            <p className="text-gray-700">Duration: {workout.duration} minutes</p>
                        </div>
                    ))}
                </div>
            )}
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
        <div className="min-h-screen flex flex-col">
            <Toaster position="top-right" reverseOrder={false} />
            <Navbar user={user} setUser={setUser} />
            <main className="flex-grow bg-gray-100">
                <Workouts />
            </main>
        </div>
    );
}

export default Main;
