import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Signup
const signupUser = async (userData) => {
  try {
    const { data } = await axios.post(`${apiUrl}/user/signup`, userData, {
      withCredentials: true
    });
    console.log("Signup Response:", data);
    return data;
  } catch (err) {
    console.error("Signup Error:", err.response?.data || err.message);
  }
};

// Login
const loginUser = async (loginData) => {
  try {
    const { data } = await axios.post(`${apiUrl}/user/login`, loginData, {
      withCredentials: true
    });
    console.log("Login Response:", data);
    return data;
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
  }
};

// Get User (Protected)
const getUserData = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/user/getuser`, {
      withCredentials: true
    });
    // console.log("User Data:", data);
    return data;
  } catch (err) {
    console.error("Get User Error:", err.response?.data || err.message);
  }
};

const logoutUser = async () => {
  try {
    const res = await axios.get(`${apiUrl}/user/logout`, {
      withCredentials: true
    });
    return res;
  } catch (err) {
    console.error("Get User Error:", err.response?.data || err.message);
  }
};

const ai = async (prompt) => {
  try {
    const res = await axios.post(`${apiUrl}/user/ai`, {prompt}, {
      withCredentials: true
    });
    return res.data;
  } catch (err) {
    console.error("Get User Error:", err.response?.data || err.message);
  }
}

export { signupUser, loginUser, getUserData, logoutUser, ai };
