
// import axios from "axios";
// import { Platform } from "react-native";
// import * as SecureStore from "expo-secure-store";

// // Use localhost when running on PC browser, or your Wi-Fi IP for native phones
// export const BASE_URL =
//   Platform.OS === "web"
//     ? "http://localhost:5000/api"
//     : "http://192.168.1.10:5000/api";

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(async (config) => {
//   try {
//     let token: string | null = null;

//     if (Platform.OS === "web") {
//       // In the browser, use standard localStorage
//       token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
//     } else {
//       // On mobile native, use Expo SecureStore
//       token = await SecureStore.getItemAsync("user_token");
//     }

//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.error("Error retrieving token:", error);
//   }
//   return config;
// });

// export default api;
import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Use Render in production / live testing, or local addresses during active local development
const getBaseUrl = () => {
  // If you want to force production testing even on your local device, 
  // you can set this to true or check process.env.NODE_ENV === 'production'
  const useLiveBackend = true; // Set to false if you want to switch back to local testing

  if (useLiveBackend) {
    return "https://my-first-application-lr95.onrender.com/api";
  }

  return Platform.OS === "web"
    ? "http://localhost:5000/api"
    : "http://192.168.1.10:5000/api";
};

export const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased slightly for cloud cold-starts if needed
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  try {
    let token: string | null = null;

    if (Platform.OS === "web") {
      // In the browser, use standard localStorage
      token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
    } else {
      // On mobile native, use Expo SecureStore
      token = await SecureStore.getItemAsync("user_token");
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
  return config;
});

export default api;