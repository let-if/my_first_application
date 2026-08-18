// mobile/src/utils/storage.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const Storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};