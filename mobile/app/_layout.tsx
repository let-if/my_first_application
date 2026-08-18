
// import React from "react";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { View, StyleSheet, Platform, Text } from "react-native";
// import { AuthProvider } from "@/src/context/AuthContext";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const isWeb = Platform.OS === "web";

//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <View style={isWeb ? styles.desktopCanvas : styles.nativeContainer}>
//           {isWeb ? (
//             <View style={styles.phoneFrame}>
//               <View style={styles.statusBar}>
//                 <Text style={styles.timeText}>9:41</Text>
//                 <View style={styles.dynamicIsland} />
//                 <View style={styles.statusIcons}>
//                   <Text style={styles.signalIcon}>📶</Text>
//                   <Text style={styles.batteryIcon}>🔋</Text>
//                 </View>
//               </View>

//               <View style={styles.phoneScreen}>
//                 <Stack screenOptions={{ headerShown: false }}>
//                   <Stack.Screen name="(tabs)" />
//                   <Stack.Screen name="auth" options={{ presentation: "modal" }} />
//                   <Stack.Screen name="+not-found" />
//                 </Stack>
//               </View>

//               <View style={styles.bottomBarContainer}>
//                 <View style={styles.homeIndicator} />
//               </View>
//             </View>
//           ) : (
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="(tabs)" />
//               <Stack.Screen name="auth" options={{ presentation: "modal" }} />
//               <Stack.Screen name="+not-found" />
//             </Stack>
//           )}
//           <StatusBar style="auto" />
//         </View>
//       </AuthProvider>
//     </QueryClientProvider>
//   );
// }

// const styles = StyleSheet.create({
//   nativeContainer: { flex: 1, backgroundColor: "#F9FAFB" },
//   desktopCanvas: {
//     flex: 1,
//     height: "100vh" as any,
//     backgroundColor: "#0B0F19",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     overflow: "hidden",
//   },
//   phoneFrame: {
//     width: 395,
//     height: "94vh" as any,
//     maxHeight: 844,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 48,
//     borderWidth: 8,
//     borderColor: "#1E293B",
//     display: "flex" as any,
//     flexDirection: "column",
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 18 },
//     shadowOpacity: 0.5,
//     shadowRadius: 28,
//     elevation: 20,
//   },
//   statusBar: {
//     height: 44,
//     backgroundColor: "#F9FAFB",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 22,
//     zIndex: 100,
//   },
//   timeText: { fontSize: 13, fontWeight: "700", color: "#111827", width: 45 },
//   dynamicIsland: { width: 105, height: 22, backgroundColor: "#111827", borderRadius: 12 },
//   statusIcons: { flexDirection: "row", alignItems: "center", gap: 4, width: 45, justifyContent: "flex-end" },
//   signalIcon: { fontSize: 11 },
//   batteryIcon: { fontSize: 13 },
//   phoneScreen: { flex: 1, width: "100%", height: "100%", backgroundColor: "#F9FAFB", overflow: "hidden" },
//   bottomBarContainer: { height: 22, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" },
//   homeIndicator: { width: 130, height: 4, backgroundColor: "#94A3B8", borderRadius: 2 },
// });
// mobile/app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, StyleSheet, Platform, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/src/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const isWeb = Platform.OS === "web";
  const [currentTime, setCurrentTime] = useState("9:41");

  useEffect(() => {
    if (isWeb) {
      const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}`);
      };
      updateTime();
      const interval = setInterval(updateTime, 10000);
      return () => clearInterval(interval);
    }
  }, [isWeb]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View style={isWeb ? styles.desktopCanvas : styles.nativeContainer}>
            {isWeb ? (
              <View style={styles.phoneFrame}>
                {/* Mock Phone Status Bar for Desktop Preview */}
                <View style={styles.statusBar}>
                  <Text style={styles.timeText}>{currentTime}</Text>
                  <View style={styles.dynamicIsland}>
                    <View style={styles.islandCameraDot} />
                  </View>
                  <View style={styles.statusIcons}>
                    <Text style={styles.signalIcon}>📶</Text>
                    <Text style={styles.wifiIcon}>􀙇</Text>
                    <Text style={styles.batteryIcon}>🔋</Text>
                  </View>
                </View>

                {/* Simulated Screen Container */}
                <View style={styles.phoneScreen}>
                  <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="auth" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
                    <Stack.Screen name="provider/bookings" options={{ animation: "slide_from_right" }} />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </View>

                {/* Simulated Home Indicator Bar */}
                <View style={styles.bottomBarContainer}>
                  <View style={styles.homeIndicator} />
                </View>
              </View>
            ) : (
              <View style={styles.nativeContainer}>
                <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="auth" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
                  <Stack.Screen name="provider/bookings" options={{ animation: "slide_from_right" }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </View>
            )}
            <StatusBar style="dark" />
          </View>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  desktopCanvas: {
    flex: 1,
    height: "100vh" as any,
    backgroundColor: "#090D16",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    overflow: "hidden",
    backgroundImage: "radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.15), transparent 70%)" as any,
  },
  phoneFrame: {
    width: 395,
    height: "94vh" as any,
    maxHeight: 850,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    borderWidth: 9,
    borderColor: "#1E293B",
    display: "flex" as any,
    flexDirection: "column",
    overflow: "hidden",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.2,
    shadowRadius: 36,
    elevation: 24,
  },
  statusBar: {
    height: 44,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    width: 50,
  },
  dynamicIsland: {
    width: 108,
    height: 24,
    backgroundColor: "#0F172A",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 8,
  },
  islandCameraDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E293B",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: 50,
    justifyContent: "flex-end",
  },
  signalIcon: {
    fontSize: 11,
  },
  wifiIcon: {
    fontSize: 11,
    color: "#0F172A",
    fontWeight: "700",
  },
  batteryIcon: {
    fontSize: 13,
  },
  phoneScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  bottomBarContainer: {
    height: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  homeIndicator: {
    width: 130,
    height: 4,
    backgroundColor: "#94A3B8",
    borderRadius: 2,
  },
});