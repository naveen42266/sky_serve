import axios from "axios";

const api = axios.create({
  baseURL: 'https://forex-news-backend.onrender.com/api/',
  // baseURL: 'http://localhost:8080/api/', // replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Login error:", error.response.data.error);
      return { error: error.response.data.error };
    } else {
      console.error("Error:", error.message);
      return { error: error.message };
    }
  }
}

export async function signup(
  type: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  gender: string
) {
  try {
    const response = await api.post("/auth/signup", {
      type,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
    });

    console.log("Signup successful:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Signup error:", error.response.data.error);
      return { error: error.response.data.error };
    } else {
      console.error("Error:", error.message);
      return { error: error.message };
    }
  }
}

export async function googleLoginSignup(credential: any) {
  try {
    const response = await api.post("/auth/google", {
      token: credential
    });
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Login error:", error.response.data.message);
      return { error: error.response.data.message };
    } else {
      console.error("Error:", error.message);
      return { error: "Network or server error. Please try again." };
    }
  }
}
