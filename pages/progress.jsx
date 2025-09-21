import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProgress } from "../backend/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { motion } from "framer-motion";

function ProgressExercise() {
  const [pr, setPr] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function progressdata() {
      const res = await getProgress();
      setPr(res.data);
    }
    progressdata();
  }, []);

  const COLORS = [
    "#FF6633","#FFB399","#FF33FF","#FFFF99","#00B3E6",
    "#E6B333","#3366E6","#999966","#99FF99","#B34D4D",
    "#80B300","#809900","#E6B3B3","#6680B3","#66991A",
    "#FF99E6","#CCFF1A","#FF1A66","#E6331A","#33FFCC"
  ];

  // Calculate average progress for motivational text
  const avgProgress = pr.length > 0 ? Math.round(pr.reduce((a, b) => a + b.percentage, 0) / pr.length) : 0;
  const motivation = pr.length === 0
    ? "🚀 No progress yet. Start your first workout!"
    : avgProgress === 100
      ? "💪 Incredible! You’ve mastered your workouts!"
      : avgProgress >= 75
        ? "🔥 Great job! Keep pushing to reach 100%!"
        : avgProgress >= 50
          ? "💥 Good progress! You’re halfway there!"
          : "🏃 Keep going! Every step counts!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        fontFamily: "'Roboto', sans-serif",
        maxWidth: "900px",
        margin: "40px auto"
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "#1E90FF",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "30px",
          fontWeight: "600",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
      >
        ← Back
      </button>

      <h2 style={{
        textAlign: "center",
        color: "#333",
        marginBottom: "15px",
        fontWeight: "700",
        letterSpacing: "1px"
      }}>Your Workout Progress</h2>

      {/* Motivational text */}
      <p style={{
        textAlign: "center",
        color: "#666",
        fontSize: "18px",
        marginBottom: "40px",
        fontWeight: "500"
      }}>{motivation}</p>

      {pr.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa", fontSize: "16px" }}>
          No progress to display yet. Start a workout to track your progress!
        </p>
      ) : (
        <>
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ width: "100%", height: 350, marginBottom: "60px" }}
          >
            <ResponsiveContainer>
              <BarChart data={pr} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="workoutName" tick={{ fill: "#555", fontWeight: "600" }} />
                <YAxis tick={{ fill: "#555", fontWeight: "600" }} />
                <Tooltip contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                }} />
                <Legend wrapperStyle={{ color: "#333" }} />
                <Bar dataKey="percentage" radius={[10, 10, 0, 0]}>
                  {pr.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ transition: "all 0.5s ease-in-out" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ width: "100%", height: 350 }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pr}
                  dataKey="percentage"
                  nameKey="workoutName"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  label={{ fill: "#333", fontWeight: "600" }}
                >
                  {pr.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                }} />
                <Legend wrapperStyle={{ color: "#333" }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default ProgressExercise;
