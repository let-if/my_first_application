
// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Linking,
//   Alert,
//   StatusBar,
//   RefreshControl,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useAuth } from "@/src/context/AuthContext";
// import api from "@/src/services/api";
// import { CreateListingModal } from "@/components/CreateListingModal";

// type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

// interface Review {
//   id: string;
//   rating: number;
//   comment?: string | null;
//   createdAt: string;
// }

// interface Booking {
//   id: string;
//   bookingDate: string;
//   status: BookingStatus;
//   totalAmount: string | number;
//   notes?: string | null;
//   customer?: {
//     id: string;
//     fullName: string;
//     phoneNumber: string;
//     email?: string | null;
//   };
//   listing?: {
//     title: string;
//     priceBirr: string | number;
//   };
//   review?: Review | null;
// }

// const STATUS_BADGE_STYLES: Record<BookingStatus, { bg: string; text: string; border: string; label: string }> = {
//   PENDING: { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A", label: "⏳ Pending" },
//   CONFIRMED: { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE", label: "✓ Confirmed" },
//   COMPLETED: { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0", label: "★ Completed" },
//   CANCELLED: { bg: "#FEE2E2", text: "#B91C1C", border: "#FECACA", label: "✕ Cancelled" },
// };

// export default function ProviderBookingsScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

//   const activeProviderId = user?.id || (user as any)?.userId;

//   useEffect(() => {
//     console.log("[ProviderBookings] Logged-in user:", user);
//     console.log("[ProviderBookings] Resolved providerId:", activeProviderId);
//   }, [user]);

//   const {
//     data: bookings,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isRefetching,
//   } = useQuery<Booking[]>({
//     queryKey: ["provider-bookings", activeProviderId],
//     queryFn: async () => {
//       if (!activeProviderId) return [];
//       const res = await api.get(`/bookings/provider?providerId=${activeProviderId}`);
//       return res.data;
//     },
//     enabled: !!activeProviderId,
//     retry: 1,
//   });

//   const updateStatusMutation = useMutation({
//     mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
//       const res = await api.patch(`/bookings/${bookingId}/status`, { status });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["provider-bookings", activeProviderId] });
//       Alert.alert("Success", "Booking status updated.");
//     },
//     onError: (err: any) => {
//       Alert.alert("Error", err?.response?.data?.error || "Failed to update status.");
//     },
//   });

//   const handleCall = (phoneNumber: string) => {
//     Linking.openURL(`tel:${phoneNumber}`).catch(() => {
//       Alert.alert("Error", `Could not dial ${phoneNumber}`);
//     });
//   };

//   const handleBack = () => {
//     if (router.canGoBack()) {
//       router.back();
//     } else {
//       router.replace("/(tabs)");
//     }
//   };

//   const filteredBookings = (bookings || []).filter((b) => {
//     if (filter === "ALL") return true;
//     return b.status === filter;
//   });

//   // Calculate Provider Overall Rating Metric
//   const completedReviews = (bookings || [])
//     .map((b) => b.review)
//     .filter((r): r is Review => !!r && typeof r.rating === "number");

//   const totalReviewsCount = completedReviews.length;
//   const averageRating =
//     totalReviewsCount > 0
//       ? (
//           completedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount
//         ).toFixed(1)
//       : null;

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       {/* Top Header with Back Button & Post Service CTA */}
//       <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
//         <View style={styles.navLeft}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={handleBack}
//             activeOpacity={0.7}
//             hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//           >
//             <Text style={styles.backButtonIcon}>←</Text>
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.screenHeader}>Provider Hub</Text>
//             <Text style={styles.screenSubtitle}>Manage client requests & orders</Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.postServiceBtn}
//           onPress={() => setIsCreateModalOpen(true)}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.postServiceBtnText}>+ Post Service</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Provider Performance Metric Banner */}
//       <View style={styles.metricsBanner}>
//         <View style={styles.metricItem}>
//           <Text style={styles.metricLabel}>Total Orders</Text>
//           <Text style={styles.metricValue}>{(bookings || []).length}</Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metricItem}>
//           <Text style={styles.metricLabel}>Rating</Text>
//           <Text style={[styles.metricValue, { color: "#D97706" }]}>
//             {averageRating ? `★ ${averageRating}` : "New"}
//           </Text>
//         </View>
//         <View style={styles.metricDivider} />
//         <View style={styles.metricItem}>
//           <Text style={styles.metricLabel}>Client Reviews</Text>
//           <Text style={styles.metricValue}>{totalReviewsCount}</Text>
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterRow}>
//         {(["ALL", "CONFIRMED", "PENDING", "COMPLETED"] as const).map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[styles.filterChip, filter === tab && styles.filterChipActive]}
//             onPress={() => setFilter(tab)}
//             activeOpacity={0.75}
//           >
//             <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
//               {tab === "ALL"
//                 ? "All Orders"
//                 : tab === "CONFIRMED"
//                 ? "Confirmed"
//                 : tab.charAt(0) + tab.slice(1).toLowerCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {isLoading ? (
//         <View style={styles.centerBox}>
//           <ActivityIndicator size="large" color="#047857" />
//           <Text style={styles.loadingText}>Loading provider orders...</Text>
//         </View>
//       ) : isError ? (
//         <View style={styles.centerBox}>
//           <Text style={styles.emptyEmoji}>⚠️</Text>
//           <Text style={styles.emptyTitle}>Could not load orders</Text>
//           <Text style={[styles.emptySubtitle, { color: "#DC2626", marginTop: 6 }]}>
//             {(error as any)?.response?.data?.error || (error as any)?.message || "Server connection failed"}
//           </Text>
//           <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
//             <Text style={styles.retryBtnText}>Retry 🔄</Text>
//           </TouchableOpacity>
//         </View>
//       ) : filteredBookings.length === 0 ? (
//         <View style={styles.centerBox}>
//           <Text style={styles.emptyEmoji}>📭</Text>
//           <Text style={styles.emptyTitle}>No orders found</Text>
//           <Text style={styles.emptySubtitle}>No {filter.toLowerCase()} orders for your listings at the moment.</Text>
//           <TouchableOpacity style={[styles.retryBtn, { marginTop: 16 }]} onPress={() => refetch()} activeOpacity={0.8}>
//             <Text style={styles.retryBtnText}>Refresh 🔄</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredBookings}
//           keyExtractor={(item) => item.id}
//           refreshControl={
//             <RefreshControl
//               refreshing={isRefetching}
//               onRefresh={refetch}
//               colors={["#047857"]}
//               tintColor="#047857"
//             />
//           }
//           contentContainerStyle={[
//             styles.listContent,
//             { paddingBottom: Math.max(insets.bottom + 40, 60) },
//           ]}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => {
//             const badge = STATUS_BADGE_STYLES[item.status] || STATUS_BADGE_STYLES.PENDING;

//             return (
//               <View style={styles.card}>
//                 <View style={styles.cardHeader}>
//                   <Text style={styles.listingTitle}>{item.listing?.title || "Service Order"}</Text>
//                   <View
//                     style={[
//                       styles.statusBadge,
//                       { backgroundColor: badge.bg, borderColor: badge.border },
//                     ]}
//                   >
//                     <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
//                   </View>
//                 </View>

//                 {/* Price & Schedule Info */}
//                 <View style={styles.metaContainer}>
//                   <View style={styles.priceRow}>
//                     <Text style={styles.priceLabel}>Total Amount:</Text>
//                     <Text style={styles.priceText}>
//                       {Number(item.totalAmount).toLocaleString()} <Text style={styles.currencyText}>ETB</Text>
//                     </Text>
//                   </View>
//                   <Text style={styles.dateText}>📅 Scheduled: {new Date(item.bookingDate).toLocaleString()}</Text>
//                 </View>

//                 {/* Customer Instruction Notes */}
//                 {item.notes ? (
//                   <View style={styles.notesBox}>
//                     <Text style={styles.notesLabel}>Client Note:</Text>
//                     <Text style={styles.notesText}>{item.notes}</Text>
//                   </View>
//                 ) : null}

//                 {/* Customer Contact Details & Chat / Call Actions */}
//                 {item.customer && (
//                   <View style={styles.customerBox}>
//                     <View style={styles.customerAvatar}>
//                       <Text style={styles.customerAvatarText}>
//                         {item.customer.fullName ? item.customer.fullName.charAt(0).toUpperCase() : "C"}
//                       </Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.customerName}>{item.customer.fullName}</Text>
//                       <Text style={styles.customerPhone}>📞 {item.customer.phoneNumber}</Text>
//                     </View>

//                     <View style={styles.clientActionButtons}>
//                       <TouchableOpacity
//                         style={styles.chatBtn}
//                         onPress={() => router.push(`/chat/${item.id}` as any)}
//                         activeOpacity={0.8}
//                       >
//                         <Text style={styles.chatBtnText}>💬 Chat</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.callBtn}
//                         onPress={() => handleCall(item.customer!.phoneNumber)}
//                         activeOpacity={0.8}
//                       >
//                         <Text style={styles.callBtnText}>Call</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}

//                 {/* Delivered Customer Review Section */}
//                 {item.review ? (
//                   <View style={styles.reviewFeedbackBox}>
//                     <View style={styles.reviewFeedbackHeader}>
//                       <Text style={styles.reviewStars}>{"★".repeat(item.review.rating)}</Text>
//                       <Text style={styles.reviewRatingNumber}>{item.review.rating}.0 / 5.0 Rating</Text>
//                     </View>
//                     {item.review.comment ? (
//                       <Text style={styles.reviewCommentText}>"{item.review.comment}"</Text>
//                     ) : (
//                       <Text style={styles.reviewCommentEmpty}>Client left a rating without written feedback.</Text>
//                     )}
//                   </View>
//                 ) : item.status === "COMPLETED" ? (
//                   <View style={styles.awaitingReviewBadge}>
//                     <Text style={styles.awaitingReviewText}>⏳ Awaiting customer review submission</Text>
//                   </View>
//                 ) : null}

//                 {/* Action Buttons */}
//                 <View style={styles.actionRow}>
//                   {item.status === "PENDING" && (
//                     <TouchableOpacity
//                       style={[styles.actionBtn, styles.confirmBtn]}
//                       onPress={() => updateStatusMutation.mutate({ bookingId: item.id, status: "CONFIRMED" })}
//                       activeOpacity={0.85}
//                     >
//                       <Text style={styles.btnText}>Accept & Confirm Order</Text>
//                     </TouchableOpacity>
//                   )}

//                   {item.status === "CONFIRMED" && (
//                     <TouchableOpacity
//                       style={[styles.actionBtn, styles.completeBtn]}
//                       onPress={() => updateStatusMutation.mutate({ bookingId: item.id, status: "COMPLETED" })}
//                       activeOpacity={0.85}
//                     >
//                       <Text style={styles.btnText}>Mark Job as Completed ✓</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             );
//           }}
//         />
//       )}

//       {/* Post New Service Listing Modal */}
//       <CreateListingModal
//         visible={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         onSuccess={() => refetch()}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8FAFC" },
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
//   navLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     flex: 1,
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
//   backButtonIcon: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#0F172A",
//   },
//   screenHeader: { fontSize: 18, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 },
//   screenSubtitle: { fontSize: 11, color: "#64748B", marginTop: 1 },
//   postServiceBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 9,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   postServiceBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
//   metricsBanner: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
//   metricItem: { alignItems: "center" },
//   metricLabel: { fontSize: 11, fontWeight: "700", color: "#64748B" },
//   metricValue: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginTop: 2 },
//   metricDivider: { width: 1, height: 26, backgroundColor: "#E2E8F0" },
//   filterRow: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     gap: 8,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   filterChip: {
//     paddingHorizontal: 14,
//     paddingVertical: 7,
//     borderRadius: 20,
//     backgroundColor: "#F1F5F9",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   filterChipActive: {
//     backgroundColor: "#047857",
//     borderColor: "#047857",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   filterText: { fontSize: 12, fontWeight: "700", color: "#475569" },
//   filterTextActive: { color: "#FFFFFF" },
//   listContent: { padding: 16, gap: 14 },
//   centerBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
//   loadingText: { marginTop: 10, color: "#64748B", fontSize: 13, fontWeight: "500" },
//   emptyEmoji: { fontSize: 36, marginBottom: 8 },
//   emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
//   emptySubtitle: { fontSize: 12, color: "#64748B", marginTop: 4, textAlign: "center" },
//   retryBtn: {
//     backgroundColor: "#047857",
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   retryBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: 8,
//   },
//   listingTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", flex: 1, letterSpacing: -0.2 },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   statusText: { fontSize: 11, fontWeight: "800" },
//   metaContainer: {
//     marginTop: 8,
//     backgroundColor: "#F8FAFC",
//     padding: 10,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//     gap: 4,
//   },
//   priceRow: {
//     flexDirection: "row",
//     alignItems: "baseline",
//     gap: 6,
//   },
//   priceLabel: { fontSize: 11, color: "#64748B", fontWeight: "700" },
//   priceText: { fontSize: 15, fontWeight: "900", color: "#047857" },
//   currencyText: { fontSize: 11, fontWeight: "800", color: "#047857" },
//   dateText: { fontSize: 12, color: "#475569", fontWeight: "500" },
//   notesBox: {
//     marginTop: 10,
//     backgroundColor: "#FFFBEB",
//     padding: 10,
//     borderRadius: 10,
//     borderLeftWidth: 3,
//     borderLeftColor: "#F59E0B",
//   },
//   notesLabel: { fontSize: 11, fontWeight: "800", color: "#92400E" },
//   notesText: { fontSize: 12, color: "#78350F", marginTop: 2, lineHeight: 16 },
//   customerBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#F1F5F9",
//   },
//   customerAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   customerAvatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },
//   customerName: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
//   customerPhone: { fontSize: 11, color: "#64748B", marginTop: 1 },
//   clientActionButtons: {
//     flexDirection: "row",
//     gap: 6,
//   },
//   chatBtn: {
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   chatBtnText: { fontSize: 11, fontWeight: "800", color: "#1D4ED8" },
//   callBtn: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   callBtnText: { fontSize: 11, fontWeight: "800", color: "#047857" },
//   reviewFeedbackBox: {
//     marginTop: 12,
//     backgroundColor: "#FEF3C7",
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#FDE68A",
//   },
//   reviewFeedbackHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   reviewStars: { fontSize: 15, color: "#D97706", letterSpacing: 2 },
//   reviewRatingNumber: { fontSize: 11, fontWeight: "900", color: "#92400E" },
//   reviewCommentText: { fontSize: 12, fontStyle: "italic", color: "#78350F", lineHeight: 17 },
//   reviewCommentEmpty: { fontSize: 11, fontStyle: "italic", color: "#B45309" },
//   awaitingReviewBadge: {
//     marginTop: 10,
//     backgroundColor: "#F1F5F9",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   awaitingReviewText: { fontSize: 11, color: "#64748B", fontWeight: "700" },
//   actionRow: { flexDirection: "row", gap: 8, marginTop: 12 },
//   actionBtn: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   confirmBtn: { backgroundColor: "#047857", shadowColor: "#047857" },
//   completeBtn: { backgroundColor: "#059669", shadowColor: "#059669" },
//   btnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
// });
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import api from "@/src/services/api";
import { CreateListingModal } from "@/components/CreateListingModal";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

interface Booking {
  id: string;
  bookingDate: string;
  status: BookingStatus;
  totalAmount: string | number;
  notes?: string | null;
  customer?: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
  };
  listing?: {
    title: string;
    priceBirr: string | number;
  };
  review?: Review | null;
}

const STATUS_BADGE_STYLES: Record<BookingStatus, { bg: string; text: string; border: string; label: string }> = {
  PENDING: { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A", label: "⏳ Pending" },
  CONFIRMED: { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE", label: "✓ Confirmed" },
  COMPLETED: { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0", label: "★ Completed" },
  CANCELLED: { bg: "#FEE2E2", text: "#B91C1C", border: "#FECACA", label: "✕ Cancelled" },
};

export default function ProviderBookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewedChatIds, setViewedChatIds] = useState<{ [id: string]: boolean }>({});

  const activeProviderId = user?.id || (user as any)?.userId;

  useEffect(() => {
    console.log("[ProviderBookings] Logged-in user:", user);
    console.log("[ProviderBookings] Resolved providerId:", activeProviderId);
  }, [user]);

  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Booking[]>({
    queryKey: ["provider-bookings", activeProviderId],
    queryFn: async () => {
      if (!activeProviderId) return [];
      const res = await api.get(`/bookings/provider?providerId=${activeProviderId}`);
      return res.data;
    },
    enabled: !!activeProviderId,
    retry: 1,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-bookings", activeProviderId] });
      Alert.alert("Success", "Booking status updated.");
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.response?.data?.error || "Failed to update status.");
    },
  });

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert("Error", `Could not dial ${phoneNumber}`);
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const filteredBookings = (bookings || []).filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  // Calculate Provider Overall Rating Metric
  const completedReviews = (bookings || [])
    .map((b) => b.review)
    .filter((r): r is Review => !!r && typeof r.rating === "number");

  const totalReviewsCount = completedReviews.length;
  const averageRating =
    totalReviewsCount > 0
      ? (
          completedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount
        ).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header with Back Button & Post Service CTA */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.screenHeader}>Provider Hub</Text>
            <Text style={styles.screenSubtitle}>Manage client requests & orders</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.postServiceBtn}
          onPress={() => setIsCreateModalOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.postServiceBtnText}>+ Post Service</Text>
        </TouchableOpacity>
      </View>

      {/* Provider Performance Metric Banner */}
      <View style={styles.metricsBanner}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Orders</Text>
          <Text style={styles.metricValue}>{(bookings || []).length}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Rating</Text>
          <Text style={[styles.metricValue, { color: "#D97706" }]}>
            {averageRating ? `★ ${averageRating}` : "New"}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Client Reviews</Text>
          <Text style={styles.metricValue}>{totalReviewsCount}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(["ALL", "CONFIRMED", "PENDING", "COMPLETED"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, filter === tab && styles.filterChipActive]}
            onPress={() => setFilter(tab)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
              {tab === "ALL"
                ? "All Orders"
                : tab === "CONFIRMED"
                ? "Confirmed"
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={styles.loadingText}>Loading provider orders...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyTitle}>Could not load orders</Text>
          <Text style={[styles.emptySubtitle, { color: "#DC2626", marginTop: 6 }]}>
            {(error as any)?.response?.data?.error || (error as any)?.message || "Server connection failed"}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Retry 🔄</Text>
          </TouchableOpacity>
        </View>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptySubtitle}>No {filter.toLowerCase()} orders for your listings at the moment.</Text>
          <TouchableOpacity style={[styles.retryBtn, { marginTop: 16 }]} onPress={() => refetch()} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Refresh 🔄</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#047857"]}
              tintColor="#047857"
            />
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom + 40, 60) },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const badge = STATUS_BADGE_STYLES[item.status] || STATUS_BADGE_STYLES.PENDING;
            const hasUnread = !viewedChatIds[item.id]; // Shows red exclamation badge until viewed

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.listingTitle}>{item.listing?.title || "Service Order"}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: badge.bg, borderColor: badge.border },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                {/* Price & Schedule Info */}
                <View style={styles.metaContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total Amount:</Text>
                    <Text style={styles.priceText}>
                      {Number(item.totalAmount).toLocaleString()} <Text style={styles.currencyText}>ETB</Text>
                    </Text>
                  </View>
                  <Text style={styles.dateText}>📅 Scheduled: {new Date(item.bookingDate).toLocaleString()}</Text>
                </View>

                {/* Customer Instruction Notes */}
                {item.notes ? (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesLabel}>Client Note:</Text>
                    <Text style={styles.notesText}>{item.notes}</Text>
                  </View>
                ) : null}

                {/* Customer Contact Details & Chat / Call Actions */}
                {item.customer && (
                  <View style={styles.customerBox}>
                    <View style={styles.customerAvatar}>
                      <Text style={styles.customerAvatarText}>
                        {item.customer.fullName ? item.customer.fullName.charAt(0).toUpperCase() : "C"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.customerName}>{item.customer.fullName}</Text>
                      <Text style={styles.customerPhone}>📞 {item.customer.phoneNumber}</Text>
                    </View>

                    <View style={styles.clientActionButtons}>
                      {/* Chat Button with Noticeable Unread Badge */}
                      <TouchableOpacity
                        style={styles.chatButtonWrapper}
                        onPress={() => {
                          setViewedChatIds((prev) => ({ ...prev, [item.id]: true }));
                          router.push(`/chat/${item.id}` as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={styles.chatBtn}>
                          <Text style={styles.chatBtnText}>💬 Chat</Text>
                        </View>
                        {hasUnread && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>!</Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.callBtn}
                        onPress={() => handleCall(item.customer!.phoneNumber)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.callBtnText}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Delivered Customer Review Section */}
                {item.review ? (
                  <View style={styles.reviewFeedbackBox}>
                    <View style={styles.reviewFeedbackHeader}>
                      <Text style={styles.reviewStars}>{"★".repeat(item.review.rating)}</Text>
                      <Text style={styles.reviewRatingNumber}>{item.review.rating}.0 / 5.0 Rating</Text>
                    </View>
                    {item.review.comment ? (
                      <Text style={styles.reviewCommentText}>"{item.review.comment}"</Text>
                    ) : (
                      <Text style={styles.reviewCommentEmpty}>Client left a rating without written feedback.</Text>
                    )}
                  </View>
                ) : item.status === "COMPLETED" ? (
                  <View style={styles.awaitingReviewBadge}>
                    <Text style={styles.awaitingReviewText}>⏳ Awaiting customer review submission</Text>
                  </View>
                ) : null}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  {item.status === "PENDING" && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.confirmBtn]}
                      onPress={() => updateStatusMutation.mutate({ bookingId: item.id, status: "CONFIRMED" })}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnText}>Accept & Confirm Order</Text>
                    </TouchableOpacity>
                  )}

                  {item.status === "CONFIRMED" && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.completeBtn]}
                      onPress={() => updateStatusMutation.mutate({ bookingId: item.id, status: "COMPLETED" })}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnText}>Mark Job as Completed ✓</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Post New Service Listing Modal */}
      <CreateListingModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
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
  navLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
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
  backButtonIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  screenHeader: { fontSize: 18, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 },
  screenSubtitle: { fontSize: 11, color: "#64748B", marginTop: 1 },
  postServiceBtn: {
    backgroundColor: "#047857",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  postServiceBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  metricsBanner: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  metricItem: { alignItems: "center" },
  metricLabel: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  metricValue: { fontSize: 16, fontWeight: "900", color: "#0F172A", marginTop: 2 },
  metricDivider: { width: 1, height: 26, backgroundColor: "#E2E8F0" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: { fontSize: 12, fontWeight: "700", color: "#475569" },
  filterTextActive: { color: "#FFFFFF" },
  listContent: { padding: 16, gap: 14 },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  loadingText: { marginTop: 10, color: "#64748B", fontSize: 13, fontWeight: "500" },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  emptySubtitle: { fontSize: 12, color: "#64748B", marginTop: 4, textAlign: "center" },
  retryBtn: {
    backgroundColor: "#047857",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  listingTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", flex: 1, letterSpacing: -0.2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: "800" },
  metaContainer: {
    marginTop: 8,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  priceLabel: { fontSize: 11, color: "#64748B", fontWeight: "700" },
  priceText: { fontSize: 15, fontWeight: "900", color: "#047857" },
  currencyText: { fontSize: 11, fontWeight: "800", color: "#047857" },
  dateText: { fontSize: 12, color: "#475569", fontWeight: "500" },
  notesBox: {
    marginTop: 10,
    backgroundColor: "#FFFBEB",
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  notesLabel: { fontSize: 11, fontWeight: "800", color: "#92400E" },
  notesText: { fontSize: 12, color: "#78350F", marginTop: 2, lineHeight: 16 },
  customerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
  },
  customerAvatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },
  customerName: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  customerPhone: { fontSize: 11, color: "#64748B", marginTop: 1 },
  clientActionButtons: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  chatButtonWrapper: {
    position: "relative",
  },
  chatBtn: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBtnText: { fontSize: 11, fontWeight: "800", color: "#1D4ED8" },
  unreadBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#DC2626",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  unreadBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  callBtn: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  callBtnText: { fontSize: 11, fontWeight: "800", color: "#047857" },
  reviewFeedbackBox: {
    marginTop: 12,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  reviewFeedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewStars: { fontSize: 15, color: "#D97706", letterSpacing: 2 },
  reviewRatingNumber: { fontSize: 11, fontWeight: "900", color: "#92400E" },
  reviewCommentText: { fontSize: 12, fontStyle: "italic", color: "#78350F", lineHeight: 17 },
  reviewCommentEmpty: { fontSize: 11, fontStyle: "italic", color: "#B45309" },
  awaitingReviewBadge: {
    marginTop: 10,
    backgroundColor: "#F1F5F9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  awaitingReviewText: { fontSize: 11, color: "#64748B", fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmBtn: { backgroundColor: "#047857", shadowColor: "#047857" },
  completeBtn: { backgroundColor: "#059669", shadowColor: "#059669" },
  btnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
});