
// import { Tabs } from "expo-router";
// import React from "react";
// import { StyleSheet, View, Text, Platform } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// interface TabIconProps {
//   focused: boolean;
//   activeEmoji: string;
//   inactiveEmoji: string;
//   label: string;
// }

// function CustomTabItem({ focused, activeEmoji, inactiveEmoji, label }: TabIconProps) {
//   return (
//     <View style={styles.tabItemContainer}>
//       <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
//         <Text style={[styles.iconEmoji, focused && styles.iconEmojiActive]}>
//           {focused ? activeEmoji : inactiveEmoji}
//         </Text>
//       </View>
//       <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
//         {label}
//       </Text>
//     </View>
//   );
// }

// export default function TabLayout() {
//   const insets = useSafeAreaInsets();
  
//   // Safe bottom space for Samsung navigation bars and iPhone Home Indicators
//   const safeBottom = Math.max(insets.bottom, Platform.OS === "android" ? 12 : 8);

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false, // Custom label rendered inside CustomTabItem to prevent clipping
//         tabBarStyle: {
//           backgroundColor: "#FFFFFF",
//           borderTopWidth: 1,
//           borderTopColor: "#E2E8F0",
//           height: 64 + safeBottom,
//           paddingBottom: safeBottom,
//           paddingTop: 8,
//           position: "relative",
//           elevation: 10,
//           shadowColor: "#0F172A",
//           shadowOffset: { width: 0, height: -4 },
//           shadowOpacity: 0.06,
//           shadowRadius: 8,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ focused }) => (
//             <CustomTabItem
//               focused={focused}
//               activeEmoji="🏠"
//               inactiveEmoji="🏡"
//               label="Home"
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: "Explore",
//           tabBarIcon: ({ focused }) => (
//             <CustomTabItem
//               focused={focused}
//               activeEmoji="✨"
//               inactiveEmoji="🔍"
//               label="Services"
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="bookings"
//         options={{
//           title: "Bookings",
//           tabBarIcon: ({ focused }) => (
//             <CustomTabItem
//               focused={focused}
//               activeEmoji="📋"
//               inactiveEmoji="📑"
//               label="Bookings"
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ focused }) => (
//             <CustomTabItem
//               focused={focused}
//               activeEmoji="👤"
//               inactiveEmoji="👥"
//               label="Profile"
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabItemContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: 70,
//     paddingTop: 4,
//   },
//   iconWrapper: {
//     width: 44,
//     height: 30,
//     borderRadius: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 3,
//   },
//   iconWrapperActive: {
//     backgroundColor: "#ECFDF5",
//   },
//   iconEmoji: {
//     fontSize: 18,
//     opacity: 0.65,
//   },
//   iconEmojiActive: {
//     fontSize: 19,
//     opacity: 1,
//   },
//   tabLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "#94A3B8",
//     textAlign: "center",
//   },
//   tabLabelActive: {
//     color: "#047857",
//     fontWeight: "800",
//   },
// });
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.rootContainer}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
  },
});