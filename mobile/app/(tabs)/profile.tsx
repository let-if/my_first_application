
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Modal,
//   Alert,
//   StatusBar,
//   ActivityIndicator,
//   useWindowDimensions,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useQueryClient } from "@tanstack/react-query";
// import { useAuth } from "@/src/context/AuthContext";
// import api from "@/src/services/api";

// export default function ProfileScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();
//   const { user, logout } = useAuth();
//   const queryClient = useQueryClient();

//   const userId = user?.id || (user as any)?.userId;

//   // Edit Profile Modal States
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [fullName, setFullName] = useState(user?.fullName || "");
//   const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isSwitchingRole, setIsSwitchingRole] = useState(false);

//   const handleLogout = () => {
//     Alert.alert(
//       "Log Out",
//       "Are you sure you want to log out of your Ethio Services account?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Log Out",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await logout();
//               router.replace("/(tabs)");
//             } catch (e) {
//               Alert.alert("Logout Error", "Could not log out. Please try again.");
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleBack = () => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.replace("/(tabs)");
//     }
//   };

//   // 1. Handle Profile & Password Updates
//   const handleUpdateProfile = async () => {
//     setIsUpdating(true);
//     try {
//       const payload: any = {
//         fullName: fullName.trim(),
//         phoneNumber: phoneNumber.trim(),
//       };

//       if (newPassword.trim()) {
//         if (!currentPassword.trim()) {
//           Alert.alert("Error", "Please enter your current password to set a new one.");
//           setIsUpdating(false);
//           return;
//         }
//         payload.currentPassword = currentPassword;
//         payload.newPassword = newPassword;
//       }

//       await api.patch(`/users/${userId}`, payload);
      
//       // Refresh user auth query cache
//       queryClient.invalidateQueries({ queryKey: ["current-user"] });

//       setCurrentPassword("");
//       setNewPassword("");
//       setIsEditModalOpen(false);
//       Alert.alert("Success", "Profile information updated successfully!");
//     } catch (err: any) {
//       console.error("Update profile error:", err);
//       Alert.alert("Error", err?.response?.data?.error || "Failed to update profile.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // 2. Handle Role Switch (Customer <-> Provider)
//   const handleToggleRole = async () => {
//     const nextRole = user?.role === "PROVIDER" ? "CUSTOMER" : "PROVIDER";
//     setIsSwitchingRole(true);
//     try {
//       await api.patch(`/users/${userId}/role`, { role: nextRole });
//       queryClient.invalidateQueries({ queryKey: ["current-user"] });
//       Alert.alert("Success", `Switched to ${nextRole} mode successfully!`);
//     } catch (err: any) {
//       console.error("Role switch error:", err);
//       Alert.alert("Error", err?.response?.data?.error || "Failed to switch role.");
//     } finally {
//       setIsSwitchingRole(false);
//     }
//   };

//   if (!user) {
//     return (
//       <View style={[styles.authContainer, { paddingTop: insets.top + 20 }]}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//         <View style={styles.guestNavRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={handleBack}
//             activeOpacity={0.7}
//             hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//           >
//             <Text style={styles.backButtonIcon}>←</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.guestContent}>
//           <View style={styles.guestAvatarOuter}>
//             <View style={styles.guestAvatarInner}>
//               <Text style={{ fontSize: 32 }}>👤</Text>
//             </View>
//           </View>
//           <Text style={styles.guestTitle}>Welcome to Ethio Services</Text>
//           <Text style={styles.guestSubtitle}>
//             Sign in to manage your appointments, track live orders, rate local providers, or manage your service listings across Addis Ababa.
//           </Text>

//           <View style={styles.benefitsBox}>
//             <View style={styles.benefitRow}>
//               <Text style={styles.benefitIcon}>✓</Text>
//               <Text style={styles.benefitText}>Track scheduled coffee ceremonies & caterers</Text>
//             </View>
//             <View style={styles.benefitRow}>
//               <Text style={styles.benefitIcon}>✓</Text>
//               <Text style={styles.benefitText}>Secure Telebirr & CBE Birr payments via Chapa</Text>
//             </View>
//             <View style={styles.benefitRow}>
//               <Text style={styles.benefitIcon}>✓</Text>
//               <Text style={styles.benefitText}>Direct phone contact with verified local pros</Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.primaryBtn}
//             onPress={() => router.push("/auth")}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.primaryBtnText}>Sign In / Register →</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   const isProvider = user.role === "PROVIDER" || user.role === "ADMIN";
//   const userEmail = (user as any).email;

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       {/* Top Ambient Light Glow */}
//       <View style={styles.ambientGlow} pointerEvents="none" />

//       {/* Navigation Top Bar */}
//       <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={handleBack}
//           activeOpacity={0.7}
//           hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//         >
//           <Text style={styles.backButtonIcon}>←</Text>
//         </TouchableOpacity>

//         <Text style={styles.screenHeaderTitle}>My Profile</Text>

//         <View style={styles.statusPill}>
//           <View style={styles.liveDot} />
//           <Text style={styles.statusPillText}>Active</Text>
//         </View>
//       </View>

//       <ScrollView
//         style={styles.scrollArea}
//         contentContainerStyle={[
//           styles.scrollContent,
//           { paddingBottom: Math.max(insets.bottom + 80, 100) },
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Profile Card */}
//         <View style={styles.headerCard}>
//           <View style={styles.avatarWrapper}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>
//                 {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
//               </Text>
//             </View>
//             <View style={styles.verifiedCheckBadge}>
//               <Text style={styles.verifiedCheckText}>✓</Text>
//             </View>
//           </View>

//           <Text style={styles.userName}>{user.fullName}</Text>
//           <Text style={styles.userPhone}>📞 {user.phoneNumber}</Text>
//           {userEmail ? <Text style={styles.userEmail}>✉️ {userEmail}</Text> : null}

//           <View style={styles.badgeGroup}>
//             <View style={[styles.roleBadge, isProvider ? styles.providerBadge : styles.customerBadge]}>
//               <Text style={[styles.roleText, isProvider ? styles.providerRoleText : styles.customerRoleText]}>
//                 {isProvider ? "🛠️ SERVICE PROVIDER" : "👤 CUSTOMER ACCOUNT"}
//               </Text>
//             </View>
//             <View style={styles.cityBadge}>
//               <Text style={styles.cityBadgeText}>📍 Addis Ababa</Text>
//             </View>
//           </View>

//           {/* Edit Profile Button */}
//           <TouchableOpacity
//             style={styles.editProfileBtn}
//             onPress={() => {
//               setFullName(user.fullName || "");
//               setPhoneNumber(user.phoneNumber || "");
//               setIsEditModalOpen(true);
//             }}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.editProfileBtnText}>✏️ Edit Profile & Password</Text>
//           </TouchableOpacity>
//         </View>

//         {/* User Management / Mode Switcher Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionHeader}>Account Mode & Role</Text>
//           <View style={styles.modeSwitchBox}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.menuTitle}>Switch Account Mode</Text>
//               <Text style={styles.menuSubtitle}>
//                 Currently in {isProvider ? "Provider Hub" : "Customer"} mode
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.modeSwitchBtn}
//               onPress={handleToggleRole}
//               disabled={isSwitchingRole}
//               activeOpacity={0.8}
//             >
//               {isSwitchingRole ? (
//                 <ActivityIndicator color="#FFFFFF" size="small" />
//               ) : (
//                 <Text style={styles.modeSwitchBtnText}>
//                   Switch to {isProvider ? "Customer" : "Provider"}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Provider Hub Section (Only for Providers) */}
//         {isProvider && (
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Provider Hub & Orders</Text>

//             <TouchableOpacity
//               style={[styles.menuItem, styles.providerHighlightTile]}
//               onPress={() => router.push("/provider/bookings")}
//               activeOpacity={0.8}
//             >
//               <View style={styles.menuLeft}>
//                 <View style={[styles.iconWrap, { backgroundColor: "#DCFCE7" }]}>
//                   <Text style={styles.menuIcon}>💼</Text>
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.menuTitle, { color: "#166534" }]}>Provider Operations Dashboard</Text>
//                   <Text style={styles.menuSubtitle}>Manage customer requests, accept jobs & track ratings</Text>
//                 </View>
//               </View>
//               <Text style={[styles.chevron, { color: "#166534" }]}>→</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Activity & Bookings */}
//         <View style={styles.section}>
//           <Text style={styles.sectionHeader}>Activity & Reservations</Text>

//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => router.push("/(tabs)/bookings")}
//             activeOpacity={0.75}
//           >
//             <View style={styles.menuLeft}>
//               <View style={[styles.iconWrap, { backgroundColor: "#ECFDF5" }]}>
//                 <Text style={styles.menuIcon}>📋</Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.menuTitle}>My Bookings & Invoices</Text>
//                 <Text style={styles.menuSubtitle}>View active, confirmed and completed appointments</Text>
//               </View>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => router.push("/(tabs)/explore")}
//             activeOpacity={0.75}
//           >
//             <View style={styles.menuLeft}>
//               <View style={[styles.iconWrap, { backgroundColor: "#EFF6FF" }]}>
//                 <Text style={styles.menuIcon}>🔍</Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.menuTitle}>Browse Services</Text>
//                 <Text style={styles.menuSubtitle}>Search pros by subcity (Bole, Yeka, Kirkos...)</Text>
//               </View>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Security & System */}
//         <View style={styles.section}>
//           <Text style={styles.sectionHeader}>Preferences & Security</Text>

//           <View style={styles.infoTile}>
//             <View style={styles.menuLeft}>
//               <View style={[styles.iconWrap, { backgroundColor: "#F8FAFC" }]}>
//                 <Text style={styles.menuIcon}>🔒</Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.menuTitle}>Payment Escrow Protection</Text>
//                 <Text style={styles.menuSubtitle}>Secured via Chapa with Telebirr & CBE Birr</Text>
//               </View>
//             </View>
//             <Text style={styles.activeCheck}>✓ Active</Text>
//           </View>
//         </View>

//         {/* Log Out Action */}
//         <View style={[styles.section, { marginTop: 24 }]}>
//           <TouchableOpacity
//             style={styles.logoutBtn}
//             onPress={handleLogout}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.logoutBtnText}>Log Out of Account</Text>
//           </TouchableOpacity>
//           <Text style={styles.versionNote}>Ethio Services v1.0.4 • Addis Ababa, ET</Text>
//         </View>
//       </ScrollView>

//       {/* Edit Profile & Security Modal */}
//       <Modal
//         visible={isEditModalOpen}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setIsEditModalOpen(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Edit Profile & Security</Text>
//               <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
//                 <Text style={styles.modalCloseText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Full Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={fullName}
//                   onChangeText={setFullName}
//                   placeholder="Enter full name"
//                   placeholderTextColor="#94A3B8"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Phone Number</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={phoneNumber}
//                   onChangeText={setPhoneNumber}
//                   placeholder="09... / +251..."
//                   placeholderTextColor="#94A3B8"
//                   keyboardType="phone-pad"
//                 />
//               </View>

//               <View style={styles.divider} />

//               <Text style={styles.securitySubheading}>Change Password (Optional)</Text>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>Current Password</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={currentPassword}
//                   onChangeText={setCurrentPassword}
//                   placeholder="Required if changing password"
//                   placeholderTextColor="#94A3B8"
//                   secureTextEntry
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>New Password</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={newPassword}
//                   onChangeText={setNewPassword}
//                   placeholder="Enter new password"
//                   placeholderTextColor="#94A3B8"
//                   secureTextEntry
//                 />
//               </View>

//               <TouchableOpacity
//                 style={[styles.modalSaveBtn, isUpdating && styles.modalSaveBtnDisabled]}
//                 onPress={handleUpdateProfile}
//                 disabled={isUpdating}
//                 activeOpacity={0.85}
//               >
//                 {isUpdating ? (
//                   <ActivityIndicator color="#FFFFFF" size="small" />
//                 ) : (
//                   <Text style={styles.modalSaveBtnText}>Save Changes</Text>
//                 )}
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8FAFC" },
//   ambientGlow: {
//     position: "absolute",
//     top: -80,
//     right: -80,
//     width: 220,
//     height: 220,
//     borderRadius: 110,
//     backgroundColor: "rgba(16, 185, 129, 0.08)",
//   },
//   topBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   backButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   backButtonIcon: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
//   screenHeaderTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", letterSpacing: -0.2 },
//   statusPill: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//   },
//   liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669", marginRight: 5 },
//   statusPillText: { fontSize: 11, fontWeight: "800", color: "#065F46" },
//   scrollArea: { flex: 1 },
//   scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
//   headerCard: {
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 2,
//     marginBottom: 16,
//   },
//   avatarWrapper: { position: "relative", marginBottom: 12 },
//   avatar: {
//     width: 76,
//     height: 76,
//     borderRadius: 38,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   avatarText: { fontSize: 28, fontWeight: "900", color: "#FFFFFF" },
//   verifiedCheckBadge: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: "#059669",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   verifiedCheckText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
//   userName: { fontSize: 20, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 },
//   userPhone: { fontSize: 13, color: "#475569", marginTop: 4, fontWeight: "600" },
//   userEmail: { fontSize: 12, color: "#64748B", marginTop: 2 },
//   badgeGroup: { flexDirection: "row", gap: 8, marginTop: 12 },
//   roleBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
//   providerBadge: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
//   customerBadge: { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" },
//   roleText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
//   providerRoleText: { color: "#047857" },
//   customerRoleText: { color: "#475569" },
//   cityBadge: { backgroundColor: "#F8FAFC", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0" },
//   cityBadgeText: { fontSize: 10, fontWeight: "700", color: "#64748B" },
//   editProfileBtn: {
//     marginTop: 16,
//     backgroundColor: "#F0FDF4",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#BBF7D0",
//   },
//   editProfileBtnText: { color: "#166534", fontSize: 12, fontWeight: "800" },
//   section: { marginBottom: 16 },
//   sectionHeader: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#64748B",
//     textTransform: "uppercase",
//     marginBottom: 8,
//     paddingLeft: 4,
//     letterSpacing: 0.4,
//   },
//   modeSwitchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     padding: 14,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     gap: 10,
//   },
//   modeSwitchBtn: {
//     backgroundColor: "#047857",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   modeSwitchBtnText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.02,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   providerHighlightTile: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
//   infoTile: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 14,
//     paddingHorizontal: 14,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   menuLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
//   iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
//   menuIcon: { fontSize: 17 },
//   menuTitle: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
//   menuSubtitle: { fontSize: 11, color: "#64748B", marginTop: 2 },
//   chevron: { fontSize: 18, color: "#94A3B8", fontWeight: "800", marginLeft: 8 },
//   activeCheck: { fontSize: 11, fontWeight: "800", color: "#059669", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
//   logoutBtn: { backgroundColor: "#FEF2F2", paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#FECACA" },
//   logoutBtnText: { color: "#DC2626", fontWeight: "800", fontSize: 13 },
//   versionNote: { fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 12 },
//   authContainer: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
//   guestNavRow: { marginBottom: 20 },
//   guestContent: { alignItems: "center" },
//   guestAvatarOuter: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#F0FDF4",
//     borderWidth: 1,
//     borderColor: "#DCFCE7",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 16,
//   },
//   guestAvatarInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" },
//   guestTitle: { fontSize: 20, fontWeight: "900", color: "#0F172A", textAlign: "center", letterSpacing: -0.3 },
//   guestSubtitle: { fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 8, lineHeight: 19, paddingHorizontal: 10 },
//   benefitsBox: {
//     width: "100%",
//     backgroundColor: "#F8FAFC",
//     borderRadius: 16,
//     padding: 14,
//     marginTop: 20,
//     marginBottom: 24,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   benefitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
//   benefitIcon: { fontSize: 13, fontWeight: "900", color: "#047857" },
//   benefitText: { fontSize: 12, fontWeight: "600", color: "#334155", flex: 1 },
//   primaryBtn: {
//     width: "100%",
//     backgroundColor: "#047857",
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: "center",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   primaryBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
//   modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.5)", justifyContent: "flex-end" },
//   modalContent: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: "85%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//     paddingBottom: 12,
//   },
//   modalTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
//   modalCloseText: { fontSize: 18, fontWeight: "800", color: "#64748B" },
//   modalForm: { gap: 14, paddingBottom: 24 },
//   inputGroup: { gap: 6 },
//   inputLabel: { fontSize: 12, fontWeight: "700", color: "#475569" },
//   input: {
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1.5,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     fontSize: 13,
//     color: "#0F172A",
//   },
//   divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
//   securitySubheading: { fontSize: 12, fontWeight: "800", color: "#0F172A" },
//   modalSaveBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   modalSaveBtnDisabled: { opacity: 0.7 },
//   modalSaveBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
// });
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import api from "@/src/services/api";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id || (user as any)?.userId;

  // Edit Profile Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your Ethio Services account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(tabs)");
            } catch (e) {
              Alert.alert("Logout Error", "Could not log out. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  // 1. Handle Profile & Password Updates
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const payload: any = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      if (newPassword.trim()) {
        if (!currentPassword.trim()) {
          Alert.alert("Error", "Please enter your current password to set a new one.");
          setIsUpdating(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await api.patch(`/users/${userId}`, payload);
      
      // Refresh user auth query cache
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      setCurrentPassword("");
      setNewPassword("");
      setIsEditModalOpen(false);
      Alert.alert("Success", "Profile information updated successfully!");
    } catch (err: any) {
      console.error("Update profile error:", err);
      Alert.alert("Error", err?.response?.data?.error || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. Handle Role Switch (Customer <-> Provider)
  const handleToggleRole = async () => {
    const nextRole = user?.role === "PROVIDER" ? "CUSTOMER" : "PROVIDER";
    setIsSwitchingRole(true);
    try {
      await api.patch(`/users/${userId}/role`, { role: nextRole });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      Alert.alert("Success", `Switched to ${nextRole} mode successfully!`);
    } catch (err: any) {
      console.error("Role switch error:", err);
      Alert.alert("Error", err?.response?.data?.error || "Failed to switch role.");
    } finally {
      setIsSwitchingRole(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.authContainer, { paddingTop: insets.top + 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.guestNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guestContent}>
          <View style={styles.guestAvatarOuter}>
            <View style={styles.guestAvatarInner}>
              <Text style={{ fontSize: 32 }}>👤</Text>
            </View>
          </View>
          <Text style={styles.guestTitle}>Welcome to Ethio Services</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to manage your appointments, track live orders, rate local providers, or manage your service listings across Addis Ababa.
          </Text>

          <View style={styles.benefitsBox}>
            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Track scheduled coffee ceremonies & caterers</Text>
            </View>
            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Secure Telebirr & CBE Birr payments via Chapa</Text>
            </View>
            <View style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Direct phone contact with verified local pros</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/auth")}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Sign In / Register →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isProvider = user.role === "PROVIDER" || user.role === "ADMIN";
  const userEmail = (user as any).email;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Ambient Light Glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      {/* Navigation Top Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.screenHeaderTitle}>My Profile</Text>

        <View style={styles.statusPill}>
          <View style={styles.liveDot} />
          <Text style={styles.statusPillText}>Active</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 80, 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
            <View style={styles.verifiedCheckBadge}>
              <Text style={styles.verifiedCheckText}>✓</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userPhone}>📞 {user.phoneNumber}</Text>
          {userEmail ? <Text style={styles.userEmail}>✉️ {userEmail}</Text> : null}

          <View style={styles.badgeGroup}>
            <View style={[styles.roleBadge, isProvider ? styles.providerBadge : styles.customerBadge]}>
              <Text style={[styles.roleText, isProvider ? styles.providerRoleText : styles.customerRoleText]}>
                {isProvider ? "🛠️ SERVICE PROVIDER" : "👤 CUSTOMER ACCOUNT"}
              </Text>
            </View>
            <View style={styles.cityBadge}>
              <Text style={styles.cityBadgeText}>📍 Addis Ababa</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => {
              setFullName(user.fullName || "");
              setPhoneNumber(user.phoneNumber || "");
              setIsEditModalOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.editProfileBtnText}>✏️ Edit Profile & Password</Text>
          </TouchableOpacity>
        </View>

        {/* User Management / Mode Switcher Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Mode & Role</Text>
          <View style={styles.modeSwitchBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Switch Account Mode</Text>
              <Text style={styles.menuSubtitle}>
                Currently in {isProvider ? "Provider Hub" : "Customer"} mode
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modeSwitchBtn}
              onPress={handleToggleRole}
              disabled={isSwitchingRole}
              activeOpacity={0.8}
            >
              {isSwitchingRole ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.modeSwitchBtnText}>
                  Switch to {isProvider ? "Customer" : "Provider"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Provider Hub Section (Only for Providers) */}
        {isProvider && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Provider Hub & Orders</Text>

            <TouchableOpacity
              style={[styles.menuItem, styles.providerHighlightTile]}
              onPress={() => router.push("/provider/bookings")}
              activeOpacity={0.8}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconWrap, { backgroundColor: "#DCFCE7" }]}>
                  <Text style={styles.menuIcon}>💼</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuTitle, { color: "#166534" }]}>Provider Operations Dashboard</Text>
                  <Text style={styles.menuSubtitle}>Manage customer requests, accept jobs & track ratings</Text>
                </View>
              </View>
              <Text style={[styles.chevron, { color: "#166534" }]}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Activity & Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Activity & Reservations</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/bookings")}
            activeOpacity={0.75}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconWrap, { backgroundColor: "#ECFDF5" }]}>
                <Text style={styles.menuIcon}>📋</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>My Bookings & Invoices</Text>
                <Text style={styles.menuSubtitle}>View active, confirmed and completed appointments</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/explore")}
            activeOpacity={0.75}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconWrap, { backgroundColor: "#EFF6FF" }]}>
                <Text style={styles.menuIcon}>🔍</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Browse Services</Text>
                <Text style={styles.menuSubtitle}>Search pros by subcity (Bole, Yeka, Kirkos...)</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Security & System */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences & Security</Text>

          <View style={styles.infoTile}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconWrap, { backgroundColor: "#F8FAFC" }]}>
                <Text style={styles.menuIcon}>🔒</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuTitle}>Payment Escrow Protection</Text>
                <Text style={styles.menuSubtitle}>Secured via Chapa with Telebirr & CBE Birr</Text>
              </View>
            </View>
            <Text style={styles.activeCheck}>✓ Active</Text>
          </View>
        </View>

        {/* Log Out Action */}
        <View style={[styles.section, { marginTop: 24 }]}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutBtnText}>Log Out of Account</Text>
          </TouchableOpacity>
          <Text style={styles.versionNote}>Ethio Services v1.0.4 • Addis Ababa, ET</Text>
        </View>
      </ScrollView>

      {/* Edit Profile & Security Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile & Security</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)} hitSlop={10}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="09... / +251..."
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.divider} />

              <Text style={styles.securitySubheading}>Change Password (Optional)</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Required if changing password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.modalSaveBtn, isUpdating && styles.modalSaveBtnDisabled]}
                onPress={handleUpdateProfile}
                disabled={isUpdating}
                activeOpacity={0.85}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSaveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  ambientGlow: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButtonIcon: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  screenHeaderTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", letterSpacing: -0.2 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669", marginRight: 5 },
  statusPillText: { fontSize: 11, fontWeight: "800", color: "#065F46" },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  headerCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: { fontSize: 28, fontWeight: "900", color: "#FFFFFF" },
  verifiedCheckBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#059669",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedCheckText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  userName: { fontSize: 20, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 },
  userPhone: { fontSize: 13, color: "#475569", marginTop: 4, fontWeight: "600" },
  userEmail: { fontSize: 12, color: "#64748B", marginTop: 2 },
  badgeGroup: { flexDirection: "row", gap: 8, marginTop: 12 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  providerBadge: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
  customerBadge: { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" },
  roleText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  providerRoleText: { color: "#047857" },
  customerRoleText: { color: "#475569" },
  cityBadge: { backgroundColor: "#F8FAFC", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  cityBadgeText: { fontSize: 10, fontWeight: "700", color: "#64748B" },
  editProfileBtn: {
    marginTop: 16,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  editProfileBtnText: { color: "#166534", fontSize: 12, fontWeight: "800" },
  section: { marginBottom: 16 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
    paddingLeft: 4,
    letterSpacing: 0.4,
  },
  modeSwitchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  modeSwitchBtn: {
    backgroundColor: "#047857",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modeSwitchBtnText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  providerHighlightTile: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  infoTile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuIcon: { fontSize: 17 },
  menuTitle: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  menuSubtitle: { fontSize: 11, color: "#64748B", marginTop: 2 },
  chevron: { fontSize: 18, color: "#94A3B8", fontWeight: "800", marginLeft: 8 },
  activeCheck: { fontSize: 11, fontWeight: "800", color: "#059669", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  logoutBtn: { backgroundColor: "#FEF2F2", paddingVertical: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "#FECACA" },
  logoutBtnText: { color: "#DC2626", fontWeight: "800", fontSize: 13 },
  versionNote: { fontSize: 11, color: "#94A3B8", textAlign: "center", marginTop: 12 },
  authContainer: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
  guestNavRow: { marginBottom: 20 },
  guestContent: { alignItems: "center" },
  guestAvatarOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  guestAvatarInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" },
  guestTitle: { fontSize: 20, fontWeight: "900", color: "#0F172A", textAlign: "center", letterSpacing: -0.3 },
  guestSubtitle: { fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 8, lineHeight: 19, paddingHorizontal: 10 },
  benefitsBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    marginBottom: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  benefitIcon: { fontSize: 13, fontWeight: "900", color: "#047857" },
  benefitText: { fontSize: 12, fontWeight: "600", color: "#334155", flex: 1 },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#047857",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  
  /* --- Corrected Modal Styles for Exact Screen Matching --- */
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: "rgba(15, 23, 42, 0.6)",
  //   justifyContent: "flex-end", // Positions modal cleanly as a bottom sheet
  // },
  // modalContent: {
  //   backgroundColor: "#FFFFFF",
  //   borderTopLeftRadius: 24,
  //   borderTopRightRadius: 24,
  //   paddingHorizontal: 20,
  //   paddingTop: 20,
  //   paddingBottom: 34,
  //   maxHeight: "82%",
  //   width: "100%",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: -4 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 10,
  //   elevation: 5,
  // },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    width: "90%",
    maxWidth: 380, // Keeps it tight and perfectly proportioned on any phone screen
    maxHeight: "80%",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  modalCloseText: { fontSize: 18, fontWeight: "800", color: "#64748B", padding: 4 },
  modalForm: { gap: 12, paddingBottom: 10 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: "700", color: "#475569" },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
  },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 4 },
  securitySubheading: { fontSize: 12, fontWeight: "800", color: "#0F172A", marginTop: 2 },
  modalSaveBtn: {
    backgroundColor: "#047857",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  modalSaveBtnDisabled: { opacity: 0.7 },
  modalSaveBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
});