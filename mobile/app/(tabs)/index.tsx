
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   StatusBar,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useQuery } from "@tanstack/react-query";
// import api from "@/src/services/api";
// import { useAuth } from "@/src/context/AuthContext";

// const SUBCITIES = [
//   { label: "All Addis", amLabel: "መላው አዲስ", value: "ALL" },
//   { label: "Bole", amLabel: "ቦሌ", value: "BOLE" },
//   { label: "Yeka", amLabel: "የካ", value: "YEKA" },
//   { label: "Arada", amLabel: "አራዳ", value: "ARADA" },
//   { label: "Kirkos", amLabel: "ቂርቆስ", value: "KIRKOS" },
//   { label: "Lideta", amLabel: "ልደታ", value: "LIDETA" },
//   { label: "Nifas Silk", amLabel: "ንፋስ ስልክ", value: "NIFAS_SILK_LAFTO" },
//   { label: "Lemi Kura", amLabel: "ለሚ ኩራ", value: "LEMI_KURA" },
// ];

// interface Category {
//   id: string;
//   nameEn: string;
//   nameAm: string;
//   icon?: string;
// }

// interface Listing {
//   id: string;
//   title: string;
//   priceBirr: number | string;
//   subCity: string;
//   categoryId: string;
// }

// export default function HomeScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { user, logout } = useAuth();

//   const [lang, setLang] = useState<"en" | "am">("en");
//   const [selectedSubcity, setSelectedSubcity] = useState("ALL");

//   // Fetch Categories
//   const { data: categories, isLoading: isCatLoading } = useQuery<Category[]>({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await api.get("/categories");
//       return res.data;
//     },
//   });

//   // Fetch Listings for real-time counting
//   const { data: listings } = useQuery<Listing[]>({
//     queryKey: ["home-listings", selectedSubcity],
//     queryFn: async () => {
//       const url = selectedSubcity === "ALL" ? "/listings" : `/listings?subCity=${selectedSubcity}`;
//       const res = await api.get(url);
//       return res.data;
//     },
//   });

//   const getListingCount = (categoryId: string) => {
//     if (!listings) return 0;
//     return listings.filter((l) => l.categoryId === categoryId).length;
//   };

//   const handleCategoryPress = (categoryId: string) => {
//     router.push({
//       pathname: "/(tabs)/explore",
//       params: {
//         categoryId,
//         subcity: selectedSubcity,
//       },
//     });
//   };

//   const getCategoryTheme = (nameEn: string) => {
//     const n = nameEn.toLowerCase();
//     if (n.includes("coffee") || n.includes("jebena") || n.includes("traditional")) {
//       return { emoji: "☕", bg: "#FEF3C7", iconColor: "#92400E" };
//     }
//     if (n.includes("catering") || n.includes("enjera") || n.includes("food")) {
//       return { emoji: "🍲", bg: "#FFEDD5", iconColor: "#9A3412" };
//     }
//     if (n.includes("plumbing") || n.includes("repair") || n.includes("maintenance")) {
//       return { emoji: "🔧", bg: "#DBEAFE", iconColor: "#1E40AF" };
//     }
//     if (n.includes("clean") || n.includes("maid")) {
//       return { emoji: "✨", bg: "#E0E7FF", iconColor: "#3730A3" };
//     }
//     if (n.includes("delivery") || n.includes("courier") || n.includes("errand")) {
//       return { emoji: "📦", bg: "#DCFCE7", iconColor: "#166534" };
//     }
//     return { emoji: "⚡", bg: "#ECFDF5", iconColor: "#065F46" };
//   };

//   return (
//     <View style={styles.screenWrapper}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       {/* Decorative ambient background glows */}
//       <View style={styles.glowTopLeft} pointerEvents="none" />
//       <View style={styles.glowTopRight} pointerEvents="none" />

//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={[
//           styles.scrollContent,
//           {
//             paddingTop: Math.max(insets.top + 8, 16),
//             paddingBottom: Math.max(insets.bottom + 80, 100),
//           },
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Top Brand Header */}
//         <View style={styles.header}>
//           <View style={styles.brandGroup}>
//             <View style={styles.flagBadge}>
//               <Text style={{ fontSize: 16 }}>🇪🇹</Text>
//             </View>
//             <View>
//               <Text style={styles.appName}>
//                 {lang === "en" ? "Ethio Services" : "የኢትዮጵያ አገልግሎቶች"}
//               </Text>
//               <Text style={styles.appSubtitle}>
//                 {lang === "en" ? "Addis Ababa Verified Marketplace" : "በአዲስ አበባ ታማኝ የቤትና የዝግጅት አገልግሎቶች"}
//               </Text>
//             </View>
//           </View>

//           {/* Language Toggle Pill */}
//           <TouchableOpacity
//             activeOpacity={0.8}
//             style={styles.langButton}
//             onPress={() => setLang(lang === "en" ? "am" : "en")}
//           >
//             <Text style={styles.langText}>
//               {lang === "en" ? "አማርኛ" : "English"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar Shortcut to Explore */}
//         <TouchableOpacity
//           style={styles.searchShortcut}
//           activeOpacity={0.88}
//           onPress={() => router.push("/(tabs)/explore")}
//         >
//           <Text style={styles.searchIcon}>🔍</Text>
//           <Text style={styles.searchPlaceholder}>
//             {lang === "en"
//               ? "Search coffee ceremony, catering, cleaning..."
//               : "የቡና ዝግጅት፣ ምግብ፣ ፅዳት እና ሌሎች አገልግሎቶችን ይፈልጉ..."}
//           </Text>
//           <View style={styles.searchArrowBadge}>
//             <Text style={styles.searchArrowText}>→</Text>
//           </View>
//         </TouchableOpacity>

//         {/* User Account / Auth Banner */}
//         <View style={styles.authCard}>
//           {user ? (
//             <View style={styles.loggedInRow}>
//               <View style={styles.userAvatarContainer}>
//                 <View style={styles.userAvatar}>
//                   <Text style={styles.userAvatarText}>
//                     {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
//                   </Text>
//                 </View>
//                 <View style={styles.onlineDot} />
//               </View>

//               <View style={styles.userInfo}>
//                 <View style={styles.userNameRow}>
//                   <Text style={styles.userName} numberOfLines={1}>
//                     {user.fullName}
//                   </Text>
//                   {user.role === "PROVIDER" && (
//                     <View style={styles.proPill}>
//                       <Text style={styles.proPillText}>PRO</Text>
//                     </View>
//                   )}
//                 </View>
//                 <Text style={styles.userRole}>
//                   {user.role === "PROVIDER"
//                     ? lang === "en" ? "🛠️ Provider Active" : "🛠️ አገልግሎት ሰጪ"
//                     : lang === "en" ? "🛍️ Customer Account" : "🛍️ ደንበኛ"} • {user.phoneNumber}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={styles.logoutBtn}
//                 onPress={logout}
//                 activeOpacity={0.75}
//               >
//                 <Text style={styles.logoutBtnText}>
//                   {lang === "en" ? "Sign Out" : "ውጣ"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.loggedOutRow}>
//               <View style={styles.guestIconBadge}>
//                 <Text style={{ fontSize: 20 }}>✨</Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.authPromptTitle}>
//                   {lang === "en" ? "Join Addis Ababa's Pro Network" : "ታማኝ ባለሙያዎችን በቀላሉ ይዘዙ"}
//                 </Text>
//                 <Text style={styles.authPromptSubtitle}>
//                   {lang === "en" ? "Sign in to book and track services in real time" : "በስልክ ቁጥርዎ በደቂቃዎች ውስጥ ይመዝገቡ"}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.signInBtn}
//                 onPress={() => router.push("/auth")}
//                 activeOpacity={0.85}
//               >
//                 <Text style={styles.signInBtnText}>
//                   {lang === "en" ? "Sign In" : "ይግቡ"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Feature Trust Strip */}
//         <View style={styles.trustStrip}>
//           <View style={styles.trustItem}>
//             <Text style={styles.trustEmoji}>🔒</Text>
//             <Text style={styles.trustLabel}>
//               {lang === "en" ? "Chapa Secure" : "ደህንነቱ የተጠበቀ"}
//             </Text>
//           </View>
//           <View style={styles.trustDivider} />
//           <View style={styles.trustItem}>
//             <Text style={styles.trustEmoji}>✓</Text>
//             <Text style={styles.trustLabel}>
//               {lang === "en" ? "Verified Pros" : "የተረጋገጡ"}
//             </Text>
//           </View>
//           <View style={styles.trustDivider} />
//           <View style={styles.trustItem}>
//             <Text style={styles.trustEmoji}>⚡</Text>
//             <Text style={styles.trustLabel}>
//               {lang === "en" ? "Instant Booking" : "ፈጣን ቀጠሮ"}
//             </Text>
//           </View>
//         </View>

//         {/* SubCity Filter Section */}
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>
//               {lang === "en" ? "Select Subcity" : "በክፍለ ከተማ ይምረጡ"}
//             </Text>
//             <Text style={styles.sectionSubtitle}>
//               {lang === "en" ? "Filter local experts near your area" : "በአቅራቢያዎ ያሉ አገልግሎቶችን ያግኙ"}
//             </Text>
//           </View>

//           <View style={styles.activeSubCityPill}>
//             <Text style={styles.activeSubCityPillText}>
//               📍 {selectedSubcity === "ALL"
//                 ? lang === "en" ? "All Addis" : "መላው አዲስ"
//                 : SUBCITIES.find((s) => s.value === selectedSubcity)?.label}
//             </Text>
//           </View>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.chipScroll}
//           contentContainerStyle={styles.chipScrollContent}
//         >
//           {SUBCITIES.map((sub) => {
//             const isSelected = selectedSubcity === sub.value;
//             return (
//               <TouchableOpacity
//                 key={sub.value}
//                 activeOpacity={0.75}
//                 style={[styles.chip, isSelected && styles.chipActive]}
//                 onPress={() => setSelectedSubcity(sub.value)}
//               >
//                 <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
//                   {lang === "en" ? sub.label : sub.amLabel}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>

//         {/* Categories Section Header */}
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>
//               {lang === "en" ? "Service Categories" : "የአገልግሎት ዘርፎች"}
//             </Text>
//             <Text style={styles.sectionSubtitle}>
//               {lang === "en" ? "Explore top rated traditional & home services" : "የሚፈልጉትን ዘርፍ መርጠው ይመልከቱ"}
//             </Text>
//           </View>

//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: "/(tabs)/explore",
//                 params: { categoryId: "ALL", subcity: selectedSubcity },
//               })
//             }
//             activeOpacity={0.7}
//             style={styles.viewAllBtn}
//           >
//             <Text style={styles.seeAllText}>
//               {lang === "en" ? "View All →" : "ሁሉንም →"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Fixed Proportional Grid */}
//         {isCatLoading ? (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color="#047857" />
//             <Text style={styles.loadingText}>
//               {lang === "en" ? "Loading verified services in Addis..." : "የአገልግሎት ዘርፎችን በማዘጋጀት ላይ..."}
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.gridContainer}>
//             {categories?.map((cat) => {
//               const count = getListingCount(cat.id);
//               const theme = getCategoryTheme(cat.nameEn);

//               return (
//                 <View key={cat.id} style={styles.gridColumn}>
//                   <TouchableOpacity
//                     activeOpacity={0.85}
//                     style={styles.card}
//                     onPress={() => handleCategoryPress(cat.id)}
//                   >
//                     <View style={[styles.iconCircle, { backgroundColor: theme.bg }]}>
//                       <Text style={styles.categoryEmoji}>{theme.emoji}</Text>
//                     </View>

//                     <Text style={styles.cardTitle} numberOfLines={2}>
//                       {lang === "en" ? cat.nameEn : cat.nameAm}
//                     </Text>

//                     <View style={styles.badgeRow}>
//                       <View style={styles.countDot} />
//                       <Text style={styles.countText}>
//                         {count} {lang === "en" ? "Active" : "አገልግሎቶች"}
//                       </Text>
//                     </View>

//                     <View style={styles.cardActionRow}>
//                       <Text style={styles.cardActionText}>
//                         {lang === "en" ? "Explore" : "ይመልከቱ"}
//                       </Text>
//                       <Text style={styles.cardActionArrow}>→</Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               );
//             })}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screenWrapper: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     position: "relative",
//   },
//   glowTopLeft: {
//     position: "absolute",
//     top: -60,
//     left: -60,
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: "rgba(16, 185, 129, 0.12)",
//   },
//   glowTopRight: {
//     position: "absolute",
//     top: 120,
//     right: -80,
//     width: 220,
//     height: 220,
//     borderRadius: 110,
//     backgroundColor: "rgba(4, 120, 87, 0.08)",
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   brandGroup: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     flex: 1,
//   },
//   flagBadge: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#ECFDF5",
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   appName: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#0F172A",
//     letterSpacing: -0.4,
//   },
//   appSubtitle: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 1,
//     fontWeight: "500",
//   },
//   langButton: {
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 7,
//     paddingHorizontal: 13,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: "#047857",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   langText: {
//     color: "#047857",
//     fontWeight: "800",
//     fontSize: 12,
//   },
//   searchShortcut: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     marginBottom: 14,
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   searchIcon: {
//     fontSize: 15,
//     marginRight: 10,
//   },
//   searchPlaceholder: {
//     flex: 1,
//     fontSize: 13,
//     color: "#94A3B8",
//     fontWeight: "500",
//   },
//   searchArrowBadge: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   searchArrowText: {
//     color: "#047857",
//     fontWeight: "800",
//     fontSize: 13,
//   },
//   authCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     marginBottom: 12,
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   loggedInRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   userAvatarContainer: {
//     position: "relative",
//   },
//   userAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   userAvatarText: {
//     color: "#FFFFFF",
//     fontWeight: "900",
//     fontSize: 17,
//   },
//   onlineDot: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#10B981",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   userInfo: {
//     flex: 1,
//   },
//   userNameRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   userName: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#0F172A",
//     flexShrink: 1,
//   },
//   proPill: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//   },
//   proPillText: {
//     color: "#047857",
//     fontSize: 9,
//     fontWeight: "900",
//   },
//   userRole: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 2,
//     fontWeight: "500",
//   },
//   logoutBtn: {
//     paddingVertical: 7,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#FECACA",
//   },
//   logoutBtnText: {
//     color: "#DC2626",
//     fontWeight: "700",
//     fontSize: 11,
//   },
//   loggedOutRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   guestIconBadge: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   authPromptTitle: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#0F172A",
//   },
//   authPromptSubtitle: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 1,
//   },
//   signInBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   signInBtnText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     fontSize: 12,
//   },
//   trustStrip: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 9,
//     paddingHorizontal: 8,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     marginBottom: 14,
//   },
//   trustItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   trustEmoji: {
//     fontSize: 12,
//   },
//   trustLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#475569",
//   },
//   trustDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: "#E2E8F0",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: "#0F172A",
//     letterSpacing: -0.2,
//   },
//   sectionSubtitle: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 1,
//   },
//   activeSubCityPill: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//   },
//   activeSubCityPillText: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   viewAllBtn: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//   },
//   seeAllText: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   chipScroll: {
//     marginBottom: 14,
//   },
//   chipScrollContent: {
//     gap: 8,
//   },
//   chip: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.02,
//     shadowRadius: 2,
//   },
//   chipActive: {
//     backgroundColor: "#047857",
//     borderColor: "#047857",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   chipText: {
//     fontSize: 12,
//     color: "#475569",
//     fontWeight: "600",
//   },
//   chipTextActive: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//   },
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginHorizontal: -6,
//   },
//   gridColumn: {
//     width: "50%",
//     paddingHorizontal: 6,
//     marginBottom: 12,
//   },
//   card: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     borderRadius: 18,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   iconCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.04,
//     shadowRadius: 4,
//   },
//   categoryEmoji: {
//     fontSize: 24,
//   },
//   cardTitle: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#0F172A",
//     textAlign: "center",
//     height: 36,
//     letterSpacing: -0.2,
//   },
//   badgeRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     marginTop: 6,
//     backgroundColor: "#F8FAFC",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//   },
//   countDot: {
//     width: 5,
//     height: 5,
//     borderRadius: 2.5,
//     backgroundColor: "#10B981",
//   },
//   countText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: "#64748B",
//   },
//   cardActionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 3,
//     marginTop: 8,
//   },
//   cardActionText: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   cardActionArrow: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   loaderContainer: {
//     paddingVertical: 40,
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 13,
//     color: "#64748B",
//     fontWeight: "500",
//   },
// });
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

const SUBCITIES = [
  { label: "All Addis", amLabel: "መላው አዲስ", value: "ALL" },
  { label: "Bole", amLabel: "ቦሌ", value: "BOLE" },
  { label: "Yeka", amLabel: "የካ", value: "YEKA" },
  { label: "Arada", amLabel: "አራዳ", value: "ARADA" },
  { label: "Kirkos", amLabel: "ቂርቆስ", value: "KIRKOS" },
  { label: "Lideta", amLabel: "ልደታ", value: "LIDETA" },
  { label: "Nifas Silk", amLabel: "ንፋስ ስልክ", value: "NIFAS_SILK_LAFTO" },
  { label: "Lemi Kura", amLabel: "ለሚ ኩራ", value: "LEMI_KURA" },
];

interface Category {
  id: string;
  nameEn: string;
  nameAm: string;
  icon?: string;
}

interface Listing {
  id: string;
  title: string;
  priceBirr: number | string;
  subCity: string;
  categoryId: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [lang, setLang] = useState<"en" | "am">("en");
  const [selectedSubcity, setSelectedSubcity] = useState("ALL");

  // Fetch Categories
  const { data: categories, isLoading: isCatLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  // Fetch Listings for real-time counting
  const { data: listings } = useQuery<Listing[]>({
    queryKey: ["home-listings", selectedSubcity],
    queryFn: async () => {
      const url = selectedSubcity === "ALL" ? "/listings" : `/listings?subCity=${selectedSubcity}`;
      const res = await api.get(url);
      return res.data;
    },
  });

  const getListingCount = (categoryId: string) => {
    if (!listings) return 0;
    return listings.filter((l) => l.categoryId === categoryId).length;
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: {
        categoryId,
        subcity: selectedSubcity,
      },
    });
  };

  const getCategoryTheme = (nameEn: string) => {
    const n = nameEn.toLowerCase();
    if (n.includes("coffee") || n.includes("jebena") || n.includes("traditional")) {
      return { emoji: "☕", bg: "#FEF3C7", iconColor: "#92400E" };
    }
    if (n.includes("catering") || n.includes("enjera") || n.includes("food")) {
      return { emoji: "🍲", bg: "#FFEDD5", iconColor: "#9A3412" };
    }
    if (n.includes("plumbing") || n.includes("repair") || n.includes("maintenance")) {
      return { emoji: "🔧", bg: "#DBEAFE", iconColor: "#1E40AF" };
    }
    if (n.includes("clean") || n.includes("maid")) {
      return { emoji: "✨", bg: "#E0E7FF", iconColor: "#3730A3" };
    }
    if (n.includes("delivery") || n.includes("courier") || n.includes("errand")) {
      return { emoji: "📦", bg: "#DCFCE7", iconColor: "#166534" };
    }
    return { emoji: "⚡", bg: "#ECFDF5", iconColor: "#065F46" };
  };

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Decorative ambient background glows */}
      <View style={styles.glowTopLeft} pointerEvents="none" />
      <View style={styles.glowTopRight} pointerEvents="none" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 8, 16),
            paddingBottom: Math.max(insets.bottom + 80, 100),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Header */}
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <View style={styles.flagBadge}>
              <Text style={{ fontSize: 16 }}>🇪🇹</Text>
            </View>
            <View>
              <Text style={styles.appName}>
                {lang === "en" ? "Ethio Services" : "የኢትዮጵያ አገልግሎቶች"}
              </Text>
              <Text style={styles.appSubtitle}>
                {lang === "en" ? "Addis Ababa Verified Marketplace" : "በአዲስ አበባ ታማኝ የቤትና የዝግጅት አገልግሎቶች"}
              </Text>
            </View>
          </View>

          {/* Language Toggle Pill */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.langButton}
            onPress={() => setLang(lang === "en" ? "am" : "en")}
          >
            <Text style={styles.langText}>
              {lang === "en" ? "አማርኛ" : "English"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar Shortcut to Explore */}
        <TouchableOpacity
          style={styles.searchShortcut}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/explore")}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>
            {lang === "en"
              ? "Search coffee ceremony, catering, cleaning..."
              : "የቡና ዝግጅት፣ ምግብ፣ ፅዳት እና ሌሎች አገልግሎቶችን ይፈልጉ..."}
          </Text>
          <View style={styles.searchArrowBadge}>
            <Text style={styles.searchArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* User Account / Auth Banner */}
        <View style={styles.authCard}>
          {user ? (
            <View style={styles.loggedInRow}>
              <View style={styles.userAvatarContainer}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </Text>
                </View>
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.fullName}
                  </Text>
                  {user.role === "PROVIDER" && (
                    <View style={styles.proPill}>
                      <Text style={styles.proPillText}>PRO</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userRole}>
                  {user.role === "PROVIDER"
                    ? lang === "en" ? "🛠️ Provider Active" : "🛠️ አገልግሎት ሰጪ"
                    : lang === "en" ? "🛍️ Customer Account" : "🛍️ ደንበኛ"} • {user.phoneNumber}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={logout}
                activeOpacity={0.75}
              >
                <Text style={styles.logoutBtnText}>
                  {lang === "en" ? "Sign Out" : "ውጣ"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loggedOutRow}>
              <View style={styles.guestIconBadge}>
                <Text style={{ fontSize: 20 }}>✨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.authPromptTitle}>
                  {lang === "en" ? "Join Addis Ababa's Pro Network" : "ታማኝ ባለሙያዎችን በቀላሉ ይዘዙ"}
                </Text>
                <Text style={styles.authPromptSubtitle}>
                  {lang === "en" ? "Sign in to book and track services in real time" : "በስልክ ቁጥርዎ በደቂቃዎች ውስጥ ይመዝገቡ"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.signInBtn}
                onPress={() => router.push("/auth")}
                activeOpacity={0.85}
              >
                <Text style={styles.signInBtnText}>
                  {lang === "en" ? "Sign In" : "ይግቡ"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Feature Trust Strip */}
        <View style={styles.trustStrip}>
          <View style={styles.trustItem}>
            <Text style={styles.trustEmoji}>🔒</Text>
            <Text style={styles.trustLabel}>
              {lang === "en" ? "Chapa Secure" : "ደህንነቱ የተጠበቀ"}
            </Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustEmoji}>✓</Text>
            <Text style={styles.trustLabel}>
              {lang === "en" ? "Verified Pros" : "የተረጋገጡ"}
            </Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustEmoji}>⚡</Text>
            <Text style={styles.trustLabel}>
              {lang === "en" ? "Instant Booking" : "ፈጣን ቀጠሮ"}
            </Text>
          </View>
        </View>

        {/* SubCity Filter Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {lang === "en" ? "Select Subcity" : "በክፍለ ከተማ ይምረጡ"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {lang === "en" ? "Filter local experts near your area" : "በአቅራቢያዎ ያሉ አገልግሎቶችን ያግኙ"}
            </Text>
          </View>

          <View style={styles.activeSubCityPill}>
            <Text style={styles.activeSubCityPillText}>
              📍 {selectedSubcity === "ALL"
                ? lang === "en" ? "All Addis" : "መላው አዲስ"
                : SUBCITIES.find((s) => s.value === selectedSubcity)?.label}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipScrollContent}
        >
          {SUBCITIES.map((sub) => {
            const isSelected = selectedSubcity === sub.value;
            return (
              <TouchableOpacity
                key={sub.value}
                activeOpacity={0.75}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedSubcity(sub.value)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {lang === "en" ? sub.label : sub.amLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Categories Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {lang === "en" ? "Service Categories" : "የአገልግሎት ዘርፎች"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {lang === "en" ? "Explore top rated traditional & home services" : "የሚፈልጉትን ዘርፍ መርጠው ይመልከቱ"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)/explore",
                params: { categoryId: "ALL", subcity: selectedSubcity },
              })
            }
            activeOpacity={0.7}
            style={styles.viewAllBtn}
          >
            <Text style={styles.seeAllText}>
              {lang === "en" ? "View All →" : "ሁሉንም →"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fixed Proportional Grid */}
        {isCatLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#047857" />
            <Text style={styles.loadingText}>
              {lang === "en" ? "Loading verified services in Addis..." : "የአገልግሎት ዘርፎችን በማዘጋጀት ላይ..."}
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {categories?.map((cat) => {
              const count = getListingCount(cat.id);
              const theme = getCategoryTheme(cat.nameEn);

              return (
                <View key={cat.id} style={styles.gridColumn}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.card}
                    onPress={() => handleCategoryPress(cat.id)}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: theme.bg }]}>
                      <Text style={styles.categoryEmoji}>{theme.emoji}</Text>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {lang === "en" ? cat.nameEn : cat.nameAm}
                    </Text>

                    <View style={styles.badgeRow}>
                      <View style={styles.countDot} />
                      <Text style={styles.countText}>
                        {count} {lang === "en" ? "Active" : "አገልግሎቶች"}
                      </Text>
                    </View>

                    <View style={styles.cardActionRow}>
                      <Text style={styles.cardActionText}>
                        {lang === "en" ? "Explore" : "ይመልከቱ"}
                      </Text>
                      <Text style={styles.cardActionArrow}>→</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#F8FAFC",
    position: "relative",
  },
  glowTopLeft: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  glowTopRight: {
    position: "absolute",
    top: 120,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(4, 120, 87, 0.08)",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  flagBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
    fontWeight: "500",
  },
  langButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#047857",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  langText: {
    color: "#047857",
    fontWeight: "800",
    fontSize: 12,
  },
  searchShortcut: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  searchArrowBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  searchArrowText: {
    color: "#047857",
    fontWeight: "800",
    fontSize: 13,
  },
  authCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  loggedInRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatarContainer: {
    position: "relative",
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  userAvatarText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 17,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    flexShrink: 1,
  },
  proPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  proPillText: {
    color: "#047857",
    fontSize: 9,
    fontWeight: "900",
  },
  userRole: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  logoutBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutBtnText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 11,
  },
  loggedOutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  guestIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  authPromptTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  authPromptSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  signInBtn: {
    backgroundColor: "#047857",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  signInBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trustEmoji: {
    fontSize: 12,
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E2E8F0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  activeSubCityPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  activeSubCityPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#047857",
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
  },
  chipScroll: {
    marginBottom: 14,
  },
  chipScrollContent: {
    gap: 8,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  chipActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridColumn: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    height: 36,
    letterSpacing: -0.2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  countDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  cardActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 8,
  },
  cardActionText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#047857",
  },
  cardActionArrow: {
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
});