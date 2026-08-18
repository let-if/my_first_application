// import axios from "axios";
// import * as SecureStore from "expo-secure-store";

// export const BASE_URL = "http://10.169.66.159/api";

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(async (config) => {
//   try {
//     const token = await SecureStore.getItemAsync("user_token");
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.error("Error retrieving token:", error);
//   }
//   return config;
// });

// export default api;
// mobile/src/services/api.ts
import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Use localhost when running on PC browser, or your Wi-Fi IP for native phones
export const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : "http://192.168.1.10:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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