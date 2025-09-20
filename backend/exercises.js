import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const getWorkouts = async () => {
  try {
    const res= await axios.get(`${apiUrl}/workout/getallworkouts`, {withCredentials:true
    });
    return res.data;
  } catch (err) {
    console.error("Get User Error:", err.response?.data || err.message);
  }
};
const getExercise = async(Id)=>{
    try {
    const res= await axios.get(`${apiUrl}/workout/getexercise/${Id}`, {withCredentials:true
    });
    return res.data;
  } catch (err) {
    console.error("Get User Error:", err.response?.data || err.message);
  }
}

export { getWorkouts ,getExercise};
