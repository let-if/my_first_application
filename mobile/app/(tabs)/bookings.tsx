
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
//   Linking,
//   Alert,
//   Platform,
//   StatusBar,
//   useWindowDimensions,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "expo-router";
// import api from "@/src/services/api";
// import { useAuth } from "@/src/context/AuthContext";
// import { PaymentModal } from "@/components/PaymentModal";
// import { ReviewModal } from "@/components/ReviewModal";

// type BookingStatus = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

// interface Provider {
//   id: string;
//   fullName: string;
//   phoneNumber: string;
// }

// interface Category {
//   id: string;
//   nameEn: string;
//   nameAm: string;
// }

// interface Listing {
//   id: string;
//   title: string;
//   titleAm?: string | null;
//   description: string;
//   priceBirr: number | string;
//   subCity: string;
//   specificArea: string;
//   category: Category;
//   provider: Provider;
// }

// interface Review {
//   id: string;
//   rating: number;
//   comment?: string | null;
// }

// interface Booking {
//   id: string;
//   bookingDate: string;
//   status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
//   totalAmount: number | string;
//   notes?: string | null;
//   createdAt: string;
//   listing: Listing;
//   review?: Review | null;
// }

// const STATUS_FILTERS: { label: string; value: BookingStatus; icon: string }[] = [
//   { label: "All", value: "ALL", icon: "📑" },
//   { label: "Pending", value: "PENDING", icon: "⏳" },
//   { label: "Confirmed", value: "CONFIRMED", icon: "✓" },
//   { label: "Completed", value: "COMPLETED", icon: "★" },
//   { label: "Cancelled", value: "CANCELLED", icon: "✕" },
// ];

// export default function BookingsScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("ALL");

//   const activeCustomerId = user?.id || (user as any)?.userId;

//   // Payment states
//   const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
//   const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [paymentError, setPaymentError] = useState<string | null>(null);

//   // Review state
//   const [reviewModalTarget, setReviewModalTarget] = useState<Booking | null>(null);

//   const {
//     data: bookings,
//     isLoading,
//     isError,
//     refetch,
//     isRefetching,
//   } = useQuery<Booking[]>({
//     queryKey: ["my-bookings", activeCustomerId],
//     queryFn: async () => {
//       if (!activeCustomerId) return [];
//       const res = await api.get(`/bookings/my?customerId=${activeCustomerId}`);
//       return res.data;
//     },
//     enabled: !!activeCustomerId,
//   });

//   const cancelBookingMutation = useMutation({
//     mutationFn: async (bookingId: string) => {
//       const res = await api.patch(`/bookings/${bookingId}/status`, { status: "CANCELLED" });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["my-bookings", activeCustomerId] });
//       Alert.alert("Success", "Booking has been cancelled.");
//     },
//     onError: (err: any) => {
//       Alert.alert("Error", err?.response?.data?.error || "Failed to cancel booking.");
//     },
//   });

//   const handleCancel = (bookingId: string) => {
//     Alert.alert(
//       "Cancel Booking",
//       "Are you sure you want to cancel this service reservation?",
//       [
//         { text: "No, Keep It", style: "cancel" },
//         {
//           text: "Yes, Cancel",
//           style: "destructive",
//           onPress: () => cancelBookingMutation.mutate(bookingId),
//         },
//       ]
//     );
//   };

//   const handleCallProvider = (phone: string) => {
//     Linking.openURL(`tel:${phone}`).catch(() => {
//       Alert.alert("Error", `Could not open dialer for ${phone}`);
//     });
//   };

//   const filteredBookings = (bookings || []).filter((item) => {
//     if (selectedStatus === "ALL") return true;
//     return item.status === selectedStatus;
//   });

//   const handlePay = async (bookingId: string) => {
//     setPaymentError(null);
//     setPayingBookingId(bookingId);
//     try {
//       const res = await api.post("/payments/initialize", { bookingId });
//       if (res.data?.checkout_url) {
//         setCheckoutUrl(res.data.checkout_url);
//         setIsPaymentModalVisible(true);
//       } else {
//         setPaymentError("Could not retrieve payment checkout URL.");
//       }
//     } catch (err: any) {
//       console.error("Payment error:", err);
//       setPaymentError(err.response?.data?.error || "Failed to initialize payment. Try again.");
//     } finally {
//       setPayingBookingId(null);
//     }
//   };

//   const getStatusBadge = (status: Booking["status"]) => {
//     switch (status) {
//       case "PENDING":
//         return { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A", label: "⏳ Pending" };
//       case "CONFIRMED":
//         return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0", label: "✓ Confirmed" };
//       case "COMPLETED":
//         return { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE", label: "★ Completed" };
//       case "CANCELLED":
//         return { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", label: "✕ Cancelled" };
//       default:
//         return { bg: "#F3F4F6", text: "#4B5563", border: "#E5E7EB", label: status };
//     }
//   };

//   const formatDateTime = (dateStr: string) => {
//     if (!dateStr) return { date: "N/A", time: "" };
//     const d = new Date(dateStr);
//     return {
//       date: isNaN(d.getTime())
//         ? dateStr
//         : d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }),
//       time: isNaN(d.getTime())
//         ? ""
//         : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//     };
//   };

//   if (!user) {
//     return (
//       <View style={[styles.authRequiredContainer, { paddingTop: insets.top + 20 }]}>
//         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//         <View style={styles.iconCircleOuter}>
//           <View style={styles.iconCircle}>
//             <Text style={styles.iconText}>📋</Text>
//           </View>
//         </View>
//         <Text style={styles.authTitle}>Sign in to view your bookings</Text>
//         <Text style={styles.authSubtitle}>
//           Track your active service reservations, scheduled coffee ceremonies, and provider details.
//         </Text>
//         <TouchableOpacity
//           style={styles.signInButton}
//           onPress={() => router.push("/auth")}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.signInButtonText}>Sign In / Register →</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       {/* Responsive Top Bar */}
//       <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
//         <View style={styles.headerTitleRow}>
//           <View>
//             <Text style={styles.headerTitle}>My Bookings</Text>
//             <Text style={styles.headerSubtitle}>Manage and track your service requests</Text>
//           </View>
//           <View style={styles.countBadge}>
//             <Text style={styles.countBadgeText}>{(bookings || []).length} Total</Text>
//           </View>
//         </View>

//         {/* Provider Mode Banner */}
//         {user.role === "PROVIDER" && (
//           <TouchableOpacity
//             style={styles.providerBanner}
//             onPress={() => router.push("/provider/bookings")}
//             activeOpacity={0.85}
//           >
//             <View style={styles.providerBannerIconWrap}>
//               <Text style={{ fontSize: 16 }}>🛠️</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.providerBannerTitle}>Provider Mode Active</Text>
//               <Text style={styles.providerBannerSubtitle}>
//                 Switch to Provider Hub to manage incoming client orders
//               </Text>
//             </View>
//             <Text style={styles.providerBannerArrow}>→</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Filter Horizontal Pill Bar */}
//       <View style={styles.filterContainer}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterScroll}
//         >
//           {STATUS_FILTERS.map((filter) => {
//             const isSelected = selectedStatus === filter.value;
//             return (
//               <TouchableOpacity
//                 key={filter.value}
//                 style={[styles.filterPill, isSelected && styles.filterPillActive]}
//                 onPress={() => setSelectedStatus(filter.value)}
//                 activeOpacity={0.75}
//               >
//                 <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
//                   {filter.label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>

//       {/* Error notification banner */}
//       {paymentError ? (
//         <View style={styles.bannerError}>
//           <Text style={styles.bannerErrorText}>⚠️ {paymentError}</Text>
//         </View>
//       ) : null}

//       {/* Main Stream Area */}
//       {isLoading ? (
//         <View style={styles.centerBox}>
//           <ActivityIndicator size="large" color="#047857" />
//           <Text style={styles.loadingText}>Loading your reservations...</Text>
//         </View>
//       ) : isError ? (
//         <View style={styles.centerBox}>
//           <Text style={styles.emptyEmoji}>⚠️</Text>
//           <Text style={styles.emptyTitle}>Could not load bookings</Text>
//           <Text style={styles.emptySubtitle}>Please check your connection and try again.</Text>
//           <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
//             <Text style={styles.retryBtnText}>Retry 🔄</Text>
//           </TouchableOpacity>
//         </View>
//       ) : filteredBookings.length === 0 ? (
//         <View style={styles.centerBox}>
//           <Text style={styles.emptyEmoji}>📭</Text>
//           <Text style={styles.emptyTitle}>No bookings found</Text>
//           <Text style={styles.emptySubtitle}>
//             {selectedStatus === "ALL"
//               ? "You haven't requested any services yet."
//               : `No ${selectedStatus.toLowerCase()} bookings at the moment.`}
//           </Text>
//           <TouchableOpacity
//             style={styles.exploreBtn}
//             onPress={() => router.push("/(tabs)/explore")}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.exploreBtnText}>Explore Services in Addis</Text>
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
//             const badge = getStatusBadge(item.status);
//             const { date, time } = formatDateTime(item.bookingDate);
//             const price = Number(item.totalAmount || item.listing?.priceBirr || 0).toLocaleString();
//             const isPayingThis = payingBookingId === item.id;

//             return (
//               <View style={styles.bookingCard}>
//                 {/* Header Badge Row */}
//                 <View style={styles.cardHeader}>
//                   <View style={styles.categoryBadge}>
//                     <Text style={styles.categoryBadgeText}>
//                       {item.listing?.category?.nameEn || "SERVICE"}
//                     </Text>
//                   </View>

//                   <View
//                     style={[
//                       styles.statusBadge,
//                       { backgroundColor: badge.bg, borderColor: badge.border },
//                     ]}
//                   >
//                     <Text style={[styles.statusBadgeText, { color: badge.text }]}>
//                       {badge.label}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Listing Title */}
//                 <Text style={styles.listingTitle}>
//                   {item.listing?.title || "Requested Service"}
//                 </Text>
//                 {item.listing?.titleAm && (
//                   <Text style={styles.listingTitleAm}>{item.listing.titleAm}</Text>
//                 )}

//                 {/* Schedule & Location Box */}
//                 <View style={styles.metaBox}>
//                   <View style={styles.infoRow}>
//                     <Text style={styles.infoIcon}>📅</Text>
//                     <Text style={styles.infoText}>
//                       <Text style={{ fontWeight: "700", color: "#1F2937" }}>{date}</Text>
//                       {time ? ` at ${time}` : ""}
//                     </Text>
//                   </View>

//                   {item.listing?.subCity && (
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoIcon}>📍</Text>
//                       <Text style={styles.infoText}>
//                         {item.listing.subCity.replace(/_/g, " ")} • {item.listing.specificArea}
//                       </Text>
//                     </View>
//                   )}
//                 </View>

//                 {/* Provider Contact & Chat Actions */}
//                 {item.listing?.provider && (
//                   <View style={styles.providerRow}>
//                     <View style={styles.providerAvatar}>
//                       <Text style={styles.providerAvatarText}>
//                         {item.listing.provider.fullName.charAt(0).toUpperCase()}
//                       </Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.providerName}>{item.listing.provider.fullName}</Text>
//                       <Text style={styles.providerPhone}>📞 {item.listing.provider.phoneNumber}</Text>
//                     </View>

//                     <View style={styles.providerActionButtons}>
//                       <TouchableOpacity
//                         style={styles.chatBtn}
//                         onPress={() => router.push(`/chat/${item.id}` as any)}
//                         activeOpacity={0.8}
//                       >
//                         <Text style={styles.chatBtnText}>💬 Chat</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.callProviderBtn}
//                         onPress={() => handleCallProvider(item.listing.provider.phoneNumber)}
//                         activeOpacity={0.8}
//                       >
//                         <Text style={styles.callProviderBtnText}>Call</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}

//                 {/* Client Note Box */}
//                 {item.notes ? (
//                   <View style={styles.notesContainer}>
//                     <Text style={styles.notesLabel}>Special Instructions:</Text>
//                     <Text style={styles.notesText}>{item.notes}</Text>
//                   </View>
//                 ) : null}

//                 {/* Card Action Footer */}
//                 <View style={styles.cardFooter}>
//                   <View style={styles.priceContainer}>
//                     <Text style={styles.priceLabel}>Estimated Cost</Text>
//                     <Text style={styles.priceValue}>
//                       {price} <Text style={styles.currencyText}>ETB</Text>
//                     </Text>
//                   </View>

//                   <View style={styles.footerActionRow}>
//                     {/* Cancel button */}
//                     {item.status === "PENDING" && (
//                       <TouchableOpacity
//                         style={styles.cancelBtn}
//                         onPress={() => handleCancel(item.id)}
//                         disabled={cancelBookingMutation.isPending}
//                         activeOpacity={0.8}
//                       >
//                         <Text style={styles.cancelBtnText}>Cancel</Text>
//                       </TouchableOpacity>
//                     )}

//                     {/* Pay via Chapa */}
//                     {item.status === "PENDING" && (
//                       <TouchableOpacity
//                         style={[styles.payBtn, isPayingThis && styles.payBtnDisabled]}
//                         onPress={() => handlePay(item.id)}
//                         disabled={isPayingThis}
//                         activeOpacity={0.85}
//                       >
//                         {isPayingThis ? (
//                           <ActivityIndicator color="#FFFFFF" size="small" />
//                         ) : (
//                           <Text style={styles.payBtnText}>Pay with Chapa 💳</Text>
//                         )}
//                       </TouchableOpacity>
//                     )}

//                     {/* Review Service button */}
//                     {item.status === "COMPLETED" && !item.review && (
//                       <TouchableOpacity
//                         style={styles.reviewBtn}
//                         onPress={() => setReviewModalTarget(item)}
//                         activeOpacity={0.85}
//                       >
//                         <Text style={styles.reviewBtnText}>★ Rate Service</Text>
//                       </TouchableOpacity>
//                     )}

//                     {/* Reviewed badge */}
//                     {item.status === "COMPLETED" && item.review && (
//                       <View style={styles.reviewedBadge}>
//                         <Text style={styles.reviewedBadgeText}>
//                           {"★".repeat(item.review.rating)} Rated
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 </View>
//               </View>
//             );
//           }}
//         />
//       )}

//       {/* Chapa Payment WebView Modal */}
//       <PaymentModal
//         visible={isPaymentModalVisible}
//         checkoutUrl={checkoutUrl}
//         onClose={() => setIsPaymentModalVisible(false)}
//         onSuccess={() => {
//           setIsPaymentModalVisible(false);
//           refetch();
//         }}
//       />

//       {/* 5-Star Review Modal */}
//       <ReviewModal
//         visible={!!reviewModalTarget}
//         bookingId={reviewModalTarget?.id || null}
//         listingTitle={reviewModalTarget?.listing?.title}
//         providerName={reviewModalTarget?.listing?.provider?.fullName}
//         onClose={() => setReviewModalTarget(null)}
//         onSuccess={() => refetch()}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   header: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   headerTitleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#0F172A",
//     letterSpacing: -0.4,
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: "#64748B",
//     marginTop: 2,
//   },
//   countBadge: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//   },
//   countBadgeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#047857",
//   },
//   providerBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F0FDF4",
//     borderWidth: 1,
//     borderColor: "#BBF7D0",
//     borderRadius: 12,
//     marginTop: 10,
//     padding: 10,
//     gap: 10,
//   },
//   providerBannerIconWrap: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "#DCFCE7",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   providerBannerTitle: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#166534",
//   },
//   providerBannerSubtitle: {
//     fontSize: 11,
//     color: "#15803D",
//     marginTop: 1,
//   },
//   providerBannerArrow: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#166534",
//   },
//   filterContainer: {
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   filterScroll: {
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   filterPill: {
//     paddingHorizontal: 14,
//     paddingVertical: 7,
//     borderRadius: 20,
//     backgroundColor: "#F1F5F9",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   filterPillActive: {
//     backgroundColor: "#047857",
//     borderColor: "#047857",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   filterPillText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#475569",
//   },
//   filterPillTextActive: {
//     color: "#FFFFFF",
//   },
//   bannerError: {
//     backgroundColor: "#FEF2F2",
//     padding: 10,
//     marginHorizontal: 16,
//     marginTop: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FECACA",
//   },
//   bannerErrorText: {
//     color: "#B91C1C",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   listContent: {
//     padding: 16,
//     gap: 14,
//   },
//   bookingCard: {
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
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   categoryBadge: {
//     backgroundColor: "#F8FAFC",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   categoryBadgeText: {
//     fontSize: 10,
//     fontWeight: "800",
//     color: "#475569",
//     textTransform: "uppercase",
//     letterSpacing: 0.4,
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   statusBadgeText: {
//     fontSize: 11,
//     fontWeight: "800",
//   },
//   listingTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#0F172A",
//     letterSpacing: -0.2,
//   },
//   listingTitleAm: {
//     fontSize: 13,
//     color: "#64748B",
//     marginTop: 2,
//   },
//   metaBox: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 12,
//     padding: 10,
//     marginTop: 10,
//     gap: 6,
//     borderWidth: 1,
//     borderColor: "#F1F5F9",
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   infoIcon: {
//     fontSize: 13,
//   },
//   infoText: {
//     fontSize: 12,
//     color: "#475569",
//     fontWeight: "500",
//   },
//   providerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "#FFFFFF",
//     padding: 10,
//     borderRadius: 12,
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   providerAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   providerAvatarText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     fontSize: 14,
//   },
//   providerName: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#0F172A",
//   },
//   providerPhone: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 1,
//   },
//   providerActionButtons: {
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
//   chatBtnText: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#1D4ED8",
//   },
//   callProviderBtn: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   callProviderBtnText: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   notesContainer: {
//     backgroundColor: "#FFFBEB",
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 10,
//     borderLeftWidth: 3,
//     borderLeftColor: "#F59E0B",
//   },
//   notesLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#92400E",
//   },
//   notesText: {
//     fontSize: 12,
//     color: "#78350F",
//     marginTop: 2,
//     lineHeight: 16,
//   },
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 12,
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#F1F5F9",
//   },
//   priceContainer: {},
//   priceLabel: {
//     fontSize: 10,
//     color: "#64748B",
//     fontWeight: "700",
//     textTransform: "uppercase",
//   },
//   priceValue: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: "#047857",
//     marginTop: 1,
//   },
//   currencyText: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   footerActionRow: {
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//   },
//   cancelBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FECACA",
//     backgroundColor: "#FEF2F2",
//   },
//   cancelBtnText: {
//     color: "#DC2626",
//     fontWeight: "700",
//     fontSize: 12,
//   },
//   payBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   payBtnDisabled: {
//     opacity: 0.7,
//   },
//   payBtnText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     fontSize: 12,
//   },
//   reviewBtn: {
//     backgroundColor: "#F59E0B",
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     shadowColor: "#F59E0B",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   reviewBtnText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     fontSize: 12,
//   },
//   reviewedBadge: {
//     backgroundColor: "#FEF3C7",
//     paddingVertical: 7,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FDE68A",
//   },
//   reviewedBadgeText: {
//     color: "#B45309",
//     fontWeight: "800",
//     fontSize: 11,
//   },
//   centerBox: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//   },
//   loadingText: {
//     fontSize: 13,
//     color: "#64748B",
//     marginTop: 10,
//     fontWeight: "500",
//   },
//   emptyEmoji: {
//     fontSize: 40,
//     marginBottom: 8,
//   },
//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#0F172A",
//   },
//   emptySubtitle: {
//     fontSize: 13,
//     color: "#64748B",
//     textAlign: "center",
//     marginTop: 4,
//     lineHeight: 18,
//     paddingHorizontal: 20,
//   },
//   exploreBtn: {
//     marginTop: 16,
//     backgroundColor: "#047857",
//     paddingVertical: 12,
//     paddingHorizontal: 22,
//     borderRadius: 12,
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   exploreBtnText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "800",
//   },
//   retryBtn: {
//     marginTop: 14,
//     backgroundColor: "#047857",
//     paddingVertical: 9,
//     paddingHorizontal: 18,
//     borderRadius: 10,
//   },
//   retryBtnText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   authRequiredContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 24,
//     backgroundColor: "#FFFFFF",
//   },
//   iconCircleOuter: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#F0FDF4",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#DCFCE7",
//   },
//   iconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconText: {
//     fontSize: 28,
//   },
//   authTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#0F172A",
//     textAlign: "center",
//     letterSpacing: -0.3,
//   },
//   authSubtitle: {
//     fontSize: 13,
//     color: "#64748B",
//     textAlign: "center",
//     marginTop: 6,
//     lineHeight: 20,
//     paddingHorizontal: 16,
//   },
//   signInButton: {
//     backgroundColor: "#047857",
//     paddingVertical: 14,
//     paddingHorizontal: 28,
//     borderRadius: 14,
//     marginTop: 22,
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   signInButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "800",
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
  FlatList,
  RefreshControl,
  Linking,
  Alert,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";
import { PaymentModal } from "@/components/PaymentModal";
import { ReviewModal } from "@/components/ReviewModal";

type BookingStatus = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Provider {
  id: string;
  fullName: string;
  phoneNumber: string;
}

interface Category {
  id: string;
  nameEn: string;
  nameAm: string;
}

interface Listing {
  id: string;
  title: string;
  titleAm?: string | null;
  description: string;
  priceBirr: number | string;
  subCity: string;
  specificArea: string;
  category: Category;
  provider: Provider;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
}

interface Booking {
  id: string;
  bookingDate: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  totalAmount: number | string;
  notes?: string | null;
  createdAt: string;
  listing: Listing;
  review?: Review | null;
}

const STATUS_FILTERS: { label: string; value: BookingStatus; icon: string }[] = [
  { label: "All", value: "ALL", icon: "📑" },
  { label: "Pending", value: "PENDING", icon: "⏳" },
  { label: "Confirmed", value: "CONFIRMED", icon: "✓" },
  { label: "Completed", value: "COMPLETED", icon: "★" },
  { label: "Cancelled", value: "CANCELLED", icon: "✕" },
];

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("ALL");
  const [viewedChatIds, setViewedChatIds] = useState<{ [id: string]: boolean }>({});

  const activeCustomerId = user?.id || (user as any)?.userId;

  // Payment states
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Review state
  const [reviewModalTarget, setReviewModalTarget] = useState<Booking | null>(null);

  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Booking[]>({
    queryKey: ["my-bookings", activeCustomerId],
    queryFn: async () => {
      if (!activeCustomerId) return [];
      const res = await api.get(`/bookings/my?customerId=${activeCustomerId}`);
      return res.data;
    },
    enabled: !!activeCustomerId,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status: "CANCELLED" });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings", activeCustomerId] });
      Alert.alert("Success", "Booking has been cancelled.");
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.response?.data?.error || "Failed to cancel booking.");
    },
  });

  const handleCancel = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this service reservation?",
      [
        { text: "No, Keep It", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => cancelBookingMutation.mutate(bookingId),
        },
      ]
    );
  };

  const handleCallProvider = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Error", `Could not open dialer for ${phone}`);
    });
  };

  const filteredBookings = (bookings || []).filter((item) => {
    if (selectedStatus === "ALL") return true;
    return item.status === selectedStatus;
  });

  const handlePay = async (bookingId: string) => {
    setPaymentError(null);
    setPayingBookingId(bookingId);
    try {
      const res = await api.post("/payments/initialize", { bookingId });
      if (res.data?.checkout_url) {
        setCheckoutUrl(res.data.checkout_url);
        setIsPaymentModalVisible(true);
      } else {
        setPaymentError("Could not retrieve payment checkout URL.");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err.response?.data?.error || "Failed to initialize payment. Try again.");
    } finally {
      setPayingBookingId(null);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING":
        return { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A", label: "⏳ Pending" };
      case "CONFIRMED":
        return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0", label: "✓ Confirmed" };
      case "COMPLETED":
        return { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE", label: "★ Completed" };
      case "CANCELLED":
        return { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", label: "✕ Cancelled" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563", border: "#E5E7EB", label: status };
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return { date: "N/A", time: "" };
    const d = new Date(dateStr);
    return {
      date: isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }),
      time: isNaN(d.getTime())
        ? ""
        : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (!user) {
    return (
      <View style={[styles.authRequiredContainer, { paddingTop: insets.top + 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.iconCircleOuter}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📋</Text>
          </View>
        </View>
        <Text style={styles.authTitle}>Sign in to view your bookings</Text>
        <Text style={styles.authSubtitle}>
          Track your active service reservations, scheduled coffee ceremonies, and provider details.
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/auth")}
          activeOpacity={0.85}
        >
          <Text style={styles.signInButtonText}>Sign In / Register →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Responsive Top Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>My Bookings</Text>
            <Text style={styles.headerSubtitle}>Manage and track your service requests</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{(bookings || []).length} Total</Text>
          </View>
        </View>

        {user.role === "PROVIDER" && (
          <TouchableOpacity
            style={styles.providerBanner}
            onPress={() => router.push("/provider/bookings")}
            activeOpacity={0.85}
          >
            <View style={styles.providerBannerIconWrap}>
              <Text style={{ fontSize: 16 }}>🛠️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.providerBannerTitle}>Provider Mode Active</Text>
              <Text style={styles.providerBannerSubtitle}>
                Switch to Provider Hub to manage incoming client orders
              </Text>
            </View>
            <Text style={styles.providerBannerArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Horizontal Pill Bar */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {STATUS_FILTERS.map((filter) => {
            const isSelected = selectedStatus === filter.value;
            return (
              <TouchableOpacity
                key={filter.value}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setSelectedStatus(filter.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {paymentError ? (
        <View style={styles.bannerError}>
          <Text style={styles.bannerErrorText}>⚠️ {paymentError}</Text>
        </View>
      ) : null}

      {/* Main Stream Area */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={styles.loadingText}>Loading your reservations...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyTitle}>Could not load bookings</Text>
          <Text style={styles.emptySubtitle}>Please check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Retry 🔄</Text>
          </TouchableOpacity>
        </View>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No bookings found</Text>
          <Text style={styles.emptySubtitle}>
            {selectedStatus === "ALL"
              ? "You haven't requested any services yet."
              : `No ${selectedStatus.toLowerCase()} bookings at the moment.`}
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push("/(tabs)/explore")}
            activeOpacity={0.85}
          >
            <Text style={styles.exploreBtnText}>Explore Services in Addis</Text>
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
            const badge = getStatusBadge(item.status);
            const { date, time } = formatDateTime(item.bookingDate);
            const price = Number(item.totalAmount || item.listing?.priceBirr || 0).toLocaleString();
            const isPayingThis = payingBookingId === item.id;
            const hasUnread = !viewedChatIds[item.id]; // Shows badge until clicked/viewed

            return (
              <View style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {item.listing?.category?.nameEn || "SERVICE"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: badge.bg, borderColor: badge.border },
                    ]}
                  >
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.listingTitle}>
                  {item.listing?.title || "Requested Service"}
                </Text>
                {item.listing?.titleAm && (
                  <Text style={styles.listingTitleAm}>{item.listing.titleAm}</Text>
                )}

                <View style={styles.metaBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>
                      <Text style={{ fontWeight: "700", color: "#1F2937" }}>{date}</Text>
                      {time ? ` at ${time}` : ""}
                    </Text>
                  </View>

                  {item.listing?.subCity && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>📍</Text>
                      <Text style={styles.infoText}>
                        {item.listing.subCity.replace(/_/g, " ")} • {item.listing.specificArea}
                      </Text>
                    </View>
                  )}
                </View>

                {item.listing?.provider && (
                  <View style={styles.providerRow}>
                    <View style={styles.providerAvatar}>
                      <Text style={styles.providerAvatarText}>
                        {item.listing.provider.fullName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.providerName}>{item.listing.provider.fullName}</Text>
                      <Text style={styles.providerPhone}>📞 {item.listing.provider.phoneNumber}</Text>
                    </View>

                    <View style={styles.providerActionButtons}>
                      {/* Chat Button with Badge that disappears on click */}
                      <TouchableOpacity
                        style={styles.chatButtonWrapper}
                        onPress={() => {
                          setViewedChatIds((prev) => ({ ...prev, [item.id]: true }));
                          router.push(`/chat/${item.id}` as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={styles.chatButtonInner}>
                          <Text style={styles.chatButtonText}>💬 Chat</Text>
                        </View>
                        {hasUnread && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>!</Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.callProviderBtn}
                        onPress={() => handleCallProvider(item.listing.provider.phoneNumber)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.callProviderBtnText}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {item.notes ? (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Special Instructions:</Text>
                    <Text style={styles.notesText}>{item.notes}</Text>
                  </View>
                ) : null}

                <View style={styles.cardFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Estimated Cost</Text>
                    <Text style={styles.priceValue}>
                      {price} <Text style={styles.currencyText}>ETB</Text>
                    </Text>
                  </View>

                  <View style={styles.footerActionRow}>
                    {item.status === "PENDING" && (
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => handleCancel(item.id)}
                        disabled={cancelBookingMutation.isPending}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    )}

                    {item.status === "PENDING" && (
                      <TouchableOpacity
                        style={[styles.payBtn, isPayingThis && styles.payBtnDisabled]}
                        onPress={() => handlePay(item.id)}
                        disabled={isPayingThis}
                        activeOpacity={0.85}
                      >
                        {isPayingThis ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <Text style={styles.payBtnText}>Pay with Chapa 💳</Text>
                        )}
                      </TouchableOpacity>
                    )}

                    {item.status === "COMPLETED" && !item.review && (
                      <TouchableOpacity
                        style={styles.reviewBtn}
                        onPress={() => setReviewModalTarget(item)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.reviewBtnText}>★ Rate Service</Text>
                      </TouchableOpacity>
                    )}

                    {item.status === "COMPLETED" && item.review && (
                      <View style={styles.reviewedBadge}>
                        <Text style={styles.reviewedBadgeText}>
                          {"★".repeat(item.review.rating)} Rated
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      <PaymentModal
        visible={isPaymentModalVisible}
        checkoutUrl={checkoutUrl}
        onClose={() => setIsPaymentModalVisible(false)}
        onSuccess={() => {
          setIsPaymentModalVisible(false);
          refetch();
        }}
      />

      <ReviewModal
        visible={!!reviewModalTarget}
        bookingId={reviewModalTarget?.id || null}
        listingTitle={reviewModalTarget?.listing?.title}
        providerName={reviewModalTarget?.listing?.provider?.fullName}
        onClose={() => setReviewModalTarget(null)}
        onSuccess={() => refetch()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#0F172A", letterSpacing: -0.4 },
  headerSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
  countBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  countBadgeText: { fontSize: 11, fontWeight: "700", color: "#047857" },
  providerBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    marginTop: 10,
    padding: 10,
    gap: 10,
  },
  providerBannerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  providerBannerTitle: { fontSize: 12, fontWeight: "800", color: "#166534" },
  providerBannerSubtitle: { fontSize: 11, color: "#15803D", marginTop: 1 },
  providerBannerArrow: { fontSize: 16, fontWeight: "800", color: "#166534" },
  filterContainer: { backgroundColor: "#FFFFFF", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterPillActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillText: { fontSize: 12, fontWeight: "700", color: "#475569" },
  filterPillTextActive: { color: "#FFFFFF" },
  bannerError: {
    backgroundColor: "#FEF2F2",
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  bannerErrorText: { color: "#B91C1C", fontSize: 12, fontWeight: "600" },
  listContent: { padding: 16, gap: 14 },
  bookingCard: {
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  categoryBadge: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryBadgeText: { fontSize: 10, fontWeight: "800", color: "#475569", textTransform: "uppercase" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: "800" },
  listingTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", letterSpacing: -0.2 },
  listingTitleAm: { fontSize: 13, color: "#64748B", marginTop: 2 },
  metaBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoIcon: { fontSize: 13 },
  infoText: { fontSize: 12, color: "#475569", fontWeight: "500" },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  providerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
  },
  providerAvatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  providerName: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  providerPhone: { fontSize: 11, color: "#64748B", marginTop: 1 },
  providerActionButtons: { flexDirection: "row", gap: 6, alignItems: "center" },
  chatButtonWrapper: { position: "relative" },
  chatButtonInner: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: { fontSize: 11, fontWeight: "800", color: "#1D4ED8" },
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
  callProviderBtn: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  callProviderBtnText: { fontSize: 11, fontWeight: "800", color: "#047857" },
  notesContainer: {
    backgroundColor: "#FFFBEB",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  notesLabel: { fontSize: 11, fontWeight: "700", color: "#92400E" },
  notesText: { fontSize: 12, color: "#78350F", marginTop: 2, lineHeight: 16 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  priceContainer: {},
  priceLabel: { fontSize: 10, color: "#64748B", fontWeight: "700", textTransform: "uppercase" },
  priceValue: { fontSize: 16, fontWeight: "900", color: "#047857", marginTop: 1 },
  currencyText: { fontSize: 11, fontWeight: "800", color: "#047857" },
  footerActionRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  cancelBtnText: { color: "#DC2626", fontWeight: "700", fontSize: 12 },
  payBtn: {
    backgroundColor: "#047857",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  payBtnDisabled: { opacity: 0.7 },
  payBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  reviewBtn: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  reviewedBadge: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  reviewedBadgeText: { color: "#B45309", fontWeight: "800", fontSize: 11 },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  loadingText: { fontSize: 13, color: "#64748B", marginTop: 10, fontWeight: "500" },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#0F172A" },
  emptySubtitle: { fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 4, lineHeight: 18, paddingHorizontal: 20 },
  exploreBtn: {
    marginTop: 16,
    backgroundColor: "#047857",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  exploreBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  retryBtn: { marginTop: 14, backgroundColor: "#047857", paddingVertical: 9, paddingHorizontal: 18, borderRadius: 10 },
  retryBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  authRequiredContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#FFFFFF" },
  iconCircleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 28 },
  authTitle: { fontSize: 20, fontWeight: "900", color: "#0F172A", textAlign: "center", letterSpacing: -0.3 },
  authSubtitle: { fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 6, lineHeight: 20, paddingHorizontal: 16 },
  signInButton: {
    backgroundColor: "#047857",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 22,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  signInButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});