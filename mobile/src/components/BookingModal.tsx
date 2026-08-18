// // mobile/src/components/BookingModal.tsx
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { useRouter } from "expo-router";
// import api from "@/src/services/api";
// import { useAuth } from "@/src/context/AuthContext";

// export interface BookingListing {
//   id: string;
//   title: string;
//   titleAm?: string | null;
//   description: string;
//   priceBirr: number | string;
//   subCity: string;
//   specificArea: string;
//   isVerified: boolean;
//   category: {
//     nameEn: string;
//     nameAm: string;
//   };
//   provider: {
//     id: string;
//     fullName: string;
//     phoneNumber: string;
//   };
// }

// interface BookingModalProps {
//   visible: boolean;
//   listing: BookingListing | null;
//   onClose: () => void;
// }

// const TIME_SLOTS = [
//   { id: "morning", label: "Morning (ጥዋት)", time: "09:00 AM" },
//   { id: "afternoon", label: "Afternoon (ከሰዓት)", time: "02:00 PM" },
//   { id: "evening", label: "Evening (ምሽት)", time: "05:30 PM" },
// ];

// export const BookingModal: React.FC<BookingModalProps> = ({
//   visible,
//   listing,
//   onClose,
// }) => {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [selectedDayOffset, setSelectedDayOffset] = useState(0);
//   const [selectedSlot, setSelectedSlot] = useState("morning");
//   const [notes, setNotes] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   if (!visible || !listing) return null;

//   const getDateOption = (offsetDays: number) => {
//     const d = new Date();
//     d.setDate(d.getDate() + offsetDays);
//     const dayName =
//       offsetDays === 0
//         ? "Today (ዛሬ)"
//         : offsetDays === 1
//         ? "Tomorrow (ነገ)"
//         : d.toLocaleDateString("en-US", { weekday: "short" });
//     const formattedDate = d.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//     return { dayName, formattedDate, rawDate: d };
//   };

//   const dayOptions = [getDateOption(0), getDateOption(1), getDateOption(2)];

//   const handleConfirmBooking = async () => {
//     if (!user) {
//       onClose();
//       router.push("/auth");
//       return;
//     }

//     setErrorMessage("");
//     setIsSubmitting(true);

//     try {
//       const chosenDate = new Date(dayOptions[selectedDayOffset].rawDate);
//       const slotTime =
//         TIME_SLOTS.find((s) => s.id === selectedSlot)?.time || "09:00 AM";

//       const [time, modifier] = slotTime.split(" ");
//       let [hours, minutes] = time.split(":").map(Number);
//       if (modifier === "PM" && hours < 12) hours += 12;
//       if (modifier === "AM" && hours === 12) hours = 0;
//       chosenDate.setHours(hours, minutes, 0, 0);

//       await api.post("/bookings", {
//         listingId: listing.id,
//         customerId: user.id,
//         bookingDate: chosenDate.toISOString(),
//         notes: notes.trim(),
//       });

//       setBookingSuccess(true);
//     } catch (err: any) {
//       console.error("Booking error response:", err.response?.data);
//       setErrorMessage(
//         err.response?.data?.error ||
//           "Failed to book service. Please check your connection."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleModalClose = () => {
//     setBookingSuccess(false);
//     setErrorMessage("");
//     setNotes("");
//     setSelectedDayOffset(0);
//     onClose();
//   };

//   const priceNum = Number(listing.priceBirr);

//   return (
//     <View style={styles.phoneOverlay}>
//       <TouchableOpacity
//         style={styles.backdropTapArea}
//         activeOpacity={1}
//         onPress={handleModalClose}
//       />

//       <View style={styles.sheetContainer}>
//         {/* Header Bar */}
//         <View style={styles.headerBar}>
//           <View style={styles.dragHandle} />
//           <View style={styles.headerRow}>
//             <Text style={styles.modalHeaderTitle}>Service Details</Text>
//             <TouchableOpacity onPress={handleModalClose} style={styles.closeCircle}>
//               <Text style={styles.closeText}>✕</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {bookingSuccess ? (
//           <ScrollView
//             contentContainerStyle={styles.successScroll}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.successBadge}>
//               <Text style={styles.successBadgeText}>🎉</Text>
//             </View>
//             <Text style={styles.successTitle}>Booking Requested!</Text>
//             <Text style={styles.successSubtitle}>
//               Your request for{" "}
//               <Text style={{ fontWeight: "700", color: "#111827" }}>
//                 {listing.title}
//               </Text>{" "}
//               has been placed with {listing.provider.fullName}.
//             </Text>

//             <View style={styles.successCard}>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>📅 Date & Time</Text>
//                 <Text style={styles.summaryValue}>
//                   {dayOptions[selectedDayOffset].dayName} (
//                   {TIME_SLOTS.find((s) => s.id === selectedSlot)?.time})
//                 </Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>💰 Amount</Text>
//                 <Text style={styles.summaryPrice}>
//                   {priceNum.toLocaleString()} ETB
//                 </Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>📍 Area</Text>
//                 <Text style={styles.summaryValue}>{listing.specificArea}</Text>
//               </View>
//               <View style={styles.summaryItem}>
//                 <Text style={styles.summaryLabel}>📋 Status</Text>
//                 <Text style={styles.statusPending}>Pending Provider Confirmation</Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.doneButton}
//               onPress={handleModalClose}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.doneButtonText}>Done</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         ) : (
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             {/* Provider Info Card */}
//             <View style={styles.providerCard}>
//               <View style={styles.avatarCircle}>
//                 <Text style={styles.avatarText}>
//                   {listing.provider.fullName
//                     ? listing.provider.fullName.charAt(0).toUpperCase()
//                     : "P"}
//                 </Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <View style={styles.providerNameRow}>
//                   <Text style={styles.providerName}>
//                     {listing.provider.fullName}
//                   </Text>
//                   {listing.isVerified && (
//                     <View style={styles.verifiedTag}>
//                       <Text style={styles.verifiedTagText}>✓ Verified</Text>
//                     </View>
//                   )}
//                 </View>
//                 <Text style={styles.providerPhone}>
//                   📞 {listing.provider.phoneNumber}
//                 </Text>
//               </View>
//             </View>

//             {/* Service Titles & Location */}
//             <Text style={styles.serviceTitle}>{listing.title}</Text>
//             {listing.titleAm ? (
//               <Text style={styles.serviceTitleAm}>{listing.titleAm}</Text>
//             ) : null}

//             <Text style={styles.locationText}>
//               📍 {listing.subCity.replace(/_/g, " ")} • {listing.specificArea}
//             </Text>

//             <Text style={styles.descriptionText}>{listing.description}</Text>

//             <View style={styles.divider} />

//             {/* Date Selector */}
//             <Text style={styles.sectionLabel}>Select Booking Day</Text>
//             <View style={styles.dateRow}>
//               {dayOptions.map((opt, idx) => {
//                 const isSelected = selectedDayOffset === idx;
//                 return (
//                   <TouchableOpacity
//                     key={idx}
//                     style={[
//                       styles.dateCard,
//                       isSelected && styles.dateCardActive,
//                     ]}
//                     onPress={() => setSelectedDayOffset(idx)}
//                     activeOpacity={0.7}
//                   >
//                     <Text
//                       style={[
//                         styles.dayName,
//                         isSelected && styles.dayNameActive,
//                       ]}
//                     >
//                       {opt.dayName}
//                     </Text>
//                     <Text
//                       style={[
//                         styles.dateSub,
//                         isSelected && styles.dateSubActive,
//                       ]}
//                     >
//                       {opt.formattedDate}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             {/* Time Slot Selector */}
//             <Text style={styles.sectionLabel}>Select Time Slot</Text>
//             <View style={styles.slotRow}>
//               {TIME_SLOTS.map((slot) => {
//                 const isSelected = selectedSlot === slot.id;
//                 return (
//                   <TouchableOpacity
//                     key={slot.id}
//                     style={[
//                       styles.slotPill,
//                       isSelected && styles.slotPillActive,
//                     ]}
//                     onPress={() => setSelectedSlot(slot.id)}
//                     activeOpacity={0.7}
//                   >
//                     <Text
//                       style={[
//                         styles.slotText,
//                         isSelected && styles.slotTextActive,
//                       ]}
//                     >
//                       {slot.label}
//                     </Text>
//                     <Text
//                       style={[
//                         styles.slotSub,
//                         isSelected && styles.slotSubActive,
//                       ]}
//                     >
//                       {slot.time}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>

//             {/* Instructions Input */}
//             <Text style={styles.sectionLabel}>
//               Instructions / Exact Address (ማስታወሻ)
//             </Text>
//             <TextInput
//               style={styles.notesInput}
//               placeholder="e.g. House No. 402, near total station. Please call before arriving."
//               placeholderTextColor="#9CA3AF"
//               multiline
//               numberOfLines={2}
//               value={notes}
//               onChangeText={setNotes}
//             />

//             {errorMessage ? (
//               <View style={styles.errorBox}>
//                 <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
//               </View>
//             ) : null}

//             {/* Price & Checkout Footer */}
//             <View style={styles.costBox}>
//               <View>
//                 <Text style={styles.totalLabel}>Total Estimate</Text>
//                 <Text style={styles.totalPrice}>
//                   {priceNum.toLocaleString()}{" "}
//                   <Text style={styles.currText}>ETB</Text>
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={[
//                   styles.confirmBtn,
//                   isSubmitting && styles.confirmBtnDisabled,
//                 ]}
//                 onPress={handleConfirmBooking}
//                 disabled={isSubmitting}
//                 activeOpacity={0.85}
//               >
//                 {isSubmitting ? (
//                   <ActivityIndicator color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.confirmBtnText}>
//                     {user ? "Confirm Reservation" : "Sign In to Book"}
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   phoneOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.55)",
//     justifyContent: "flex-end",
//     zIndex: 1000,
//   },
//   backdropTapArea: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   sheetContainer: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     maxHeight: "88%",
//     width: "100%",
//     paddingBottom: 24,
//     zIndex: 1001,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 25,
//   },
//   headerBar: {
//     alignItems: "center",
//     paddingTop: 8,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   dragHandle: {
//     width: 36,
//     height: 4,
//     backgroundColor: "#D1D5DB",
//     borderRadius: 2,
//     marginBottom: 8,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 18,
//   },
//   modalHeaderTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   closeCircle: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#4B5563",
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//   },
//   providerCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     padding: 10,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     gap: 10,
//     marginBottom: 10,
//   },
//   avatarCircle: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: {
//     color: "#FFFFFF",
//     fontWeight: "800",
//     fontSize: 16,
//   },
//   providerNameRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   providerName: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   verifiedTag: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 5,
//     paddingVertical: 1,
//     borderRadius: 4,
//   },
//   verifiedTagText: {
//     color: "#047857",
//     fontSize: 9,
//     fontWeight: "700",
//   },
//   providerPhone: {
//     fontSize: 11,
//     color: "#4B5563",
//     marginTop: 1,
//   },
//   serviceTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#111827",
//   },
//   serviceTitleAm: {
//     fontSize: 13,
//     color: "#047857",
//     fontWeight: "600",
//     marginTop: 1,
//   },
//   locationText: {
//     fontSize: 11,
//     color: "#6B7280",
//     fontWeight: "500",
//     marginTop: 4,
//     marginBottom: 6,
//   },
//   descriptionText: {
//     fontSize: 12,
//     color: "#374151",
//     lineHeight: 17,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#E5E7EB",
//     marginVertical: 10,
//   },
//   sectionLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 6,
//   },
//   dateRow: {
//     flexDirection: "row",
//     gap: 6,
//     marginBottom: 10,
//   },
//   dateCard: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1.5,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   dateCardActive: {
//     borderColor: "#047857",
//     backgroundColor: "#ECFDF5",
//   },
//   dayName: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#4B5563",
//   },
//   dayNameActive: {
//     color: "#047857",
//   },
//   dateSub: {
//     fontSize: 10,
//     color: "#6B7280",
//     marginTop: 1,
//   },
//   dateSubActive: {
//     color: "#065F46",
//   },
//   slotRow: {
//     flexDirection: "row",
//     gap: 6,
//     marginBottom: 10,
//   },
//   slotPill: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1.5,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     paddingVertical: 6,
//     alignItems: "center",
//   },
//   slotPillActive: {
//     borderColor: "#047857",
//     backgroundColor: "#ECFDF5",
//   },
//   slotText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: "#4B5563",
//   },
//   slotTextActive: {
//     color: "#047857",
//   },
//   slotSub: {
//     fontSize: 9,
//     color: "#6B7280",
//     marginTop: 1,
//   },
//   slotSubActive: {
//     color: "#065F46",
//     fontWeight: "600",
//   },
//   notesInput: {
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 12,
//     color: "#111827",
//     textAlignVertical: "top",
//     minHeight: 50,
//     marginBottom: 10,
//   },
//   errorBox: {
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#FCA5A5",
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   errorText: {
//     color: "#B91C1C",
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   costBox: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     padding: 10,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   totalLabel: {
//     fontSize: 9,
//     color: "#6B7280",
//     textTransform: "uppercase",
//     fontWeight: "700",
//   },
//   totalPrice: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   currText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#047857",
//   },
//   confirmBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//   },
//   confirmBtnDisabled: {
//     opacity: 0.7,
//   },
//   confirmBtnText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   successScroll: {
//     padding: 18,
//     alignItems: "center",
//   },
//   successBadge: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//   },
//   successBadgeText: {
//     fontSize: 28,
//   },
//   successTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#111827",
//   },
//   successSubtitle: {
//     fontSize: 12,
//     color: "#4B5563",
//     textAlign: "center",
//     marginTop: 4,
//     lineHeight: 17,
//   },
//   successCard: {
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     padding: 12,
//     width: "100%",
//     marginVertical: 14,
//     gap: 8,
//   },
//   summaryItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   summaryLabel: {
//     fontSize: 11,
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   summaryValue: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#1F2937",
//   },
//   summaryPrice: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#047857",
//   },
//   statusPending: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: "#D97706",
//     backgroundColor: "#FEF3C7",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   doneButton: {
//     backgroundColor: "#047857",
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   doneButtonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "700",
//   },
// });
// mobile/src/components/BookingModal.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import api from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

export interface BookingListing {
  id: string;
  title: string;
  titleAm?: string | null;
  description: string;
  priceBirr: number | string;
  subCity: string;
  specificArea: string;
  isVerified: boolean;
  category: {
    nameEn: string;
    nameAm: string;
  };
  provider: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
}

interface BookingModalProps {
  visible: boolean;
  listing: BookingListing | null;
  onClose: () => void;
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning (ጥዋት)", time: "09:00 AM" },
  { id: "afternoon", label: "Afternoon (ከሰዓት)", time: "02:00 PM" },
  { id: "evening", label: "Evening (ምሽት)", time: "05:30 PM" },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  listing,
  onClose,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("morning");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!visible || !listing) return null;

  const getDateOption = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dayName =
      offsetDays === 0
        ? "Today (ዛሬ)"
        : offsetDays === 1
        ? "Tomorrow (ነገ)"
        : d.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return { dayName, formattedDate, rawDate: d };
  };

  const dayOptions = [getDateOption(0), getDateOption(1), getDateOption(2)];

  const handleConfirmBooking = async () => {
    if (!user) {
      onClose();
      router.push("/auth");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const chosenDate = new Date(dayOptions[selectedDayOffset].rawDate);
      const slotTime =
        TIME_SLOTS.find((s) => s.id === selectedSlot)?.time || "09:00 AM";

      const [time, modifier] = slotTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      chosenDate.setHours(hours, minutes, 0, 0);

      await api.post("/bookings", {
        listingId: listing.id,
        customerId: user.id,
        bookingDate: chosenDate.toISOString(),
        notes: notes.trim(),
      });

      setBookingSuccess(true);
    } catch (err: any) {
      console.error("Booking error response:", err.response?.data);
      setErrorMessage(
        err.response?.data?.error ||
          "Failed to book service. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setBookingSuccess(false);
    setErrorMessage("");
    setNotes("");
    setSelectedDayOffset(0);
    onClose();
  };

  const priceNum = Number(listing.priceBirr);

  return (
    <View style={styles.phoneOverlay}>
      <TouchableOpacity
        style={styles.backdropTapArea}
        activeOpacity={1}
        onPress={handleModalClose}
      />

      <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.dragHandle} />
          <View style={styles.headerRow}>
            <Text style={styles.modalHeaderTitle}>Service Reservation</Text>
            <TouchableOpacity onPress={handleModalClose} style={styles.closeCircle} activeOpacity={0.75}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {bookingSuccess ? (
          <ScrollView
            contentContainerStyle={styles.successScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>🎉</Text>
            </View>
            <Text style={styles.successTitle}>Booking Requested!</Text>
            <Text style={styles.successSubtitle}>
              Your request for{" "}
              <Text style={{ fontWeight: "800", color: "#0F172A" }}>
                {listing.title}
              </Text>{" "}
              has been successfully placed with {listing.provider.fullName}.
            </Text>

            <View style={styles.successCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>📅 Date & Time</Text>
                <Text style={styles.summaryValue}>
                  {dayOptions[selectedDayOffset].dayName} (
                  {TIME_SLOTS.find((s) => s.id === selectedSlot)?.time})
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>💰 Amount</Text>
                <Text style={styles.summaryPrice}>
                  {priceNum.toLocaleString()} ETB
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>📍 Area</Text>
                <Text style={styles.summaryValue}>{listing.specificArea}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>📋 Status</Text>
                <Text style={styles.statusPending}>Pending Provider Confirmation</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleModalClose}
              activeOpacity={0.85}
            >
              <Text style={styles.doneButtonText}>Done ✓</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Provider Info Card */}
            <View style={styles.providerCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {listing.provider.fullName
                    ? listing.provider.fullName.charAt(0).toUpperCase()
                    : "P"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.providerNameRow}>
                  <Text style={styles.providerName}>
                    {listing.provider.fullName}
                  </Text>
                  {listing.isVerified && (
                    <View style={styles.verifiedTag}>
                      <Text style={styles.verifiedTagText}>✓ Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.providerPhone}>
                  📞 {listing.provider.phoneNumber}
                </Text>
              </View>
            </View>

            {/* Service Titles & Location */}
            <Text style={styles.serviceTitle}>{listing.title}</Text>
            {listing.titleAm ? (
              <Text style={styles.serviceTitleAm}>{listing.titleAm}</Text>
            ) : null}

            <Text style={styles.locationText}>
              📍 {listing.subCity.replace(/_/g, " ")} • {listing.specificArea}
            </Text>

            <Text style={styles.descriptionText} numberOfLines={3}>{listing.description}</Text>

            <View style={styles.divider} />

            {/* Date Selector */}
            <Text style={styles.sectionLabel}>Select Booking Day</Text>
            <View style={styles.dateRow}>
              {dayOptions.map((opt, idx) => {
                const isSelected = selectedDayOffset === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.dateCard,
                      isSelected && styles.dateCardActive,
                    ]}
                    onPress={() => setSelectedDayOffset(idx)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.dayName,
                        isSelected && styles.dayNameActive,
                      ]}
                    >
                      {opt.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dateSub,
                        isSelected && styles.dateSubActive,
                      ]}
                    >
                      {opt.formattedDate}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time Slot Selector */}
            <Text style={styles.sectionLabel}>Select Time Slot</Text>
            <View style={styles.slotRow}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotPill,
                      isSelected && styles.slotPillActive,
                    ]}
                    onPress={() => setSelectedSlot(slot.id)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.slotTextActive,
                      ]}
                    >
                      {slot.label}
                    </Text>
                    <Text
                      style={[
                        styles.slotSub,
                        isSelected && styles.slotSubActive,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Instructions Input */}
            <Text style={styles.sectionLabel}>
              Instructions / Exact Address (ማስታወሻ)
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. House No. 402, near total station. Please call before arriving."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
              value={notes}
              onChangeText={setNotes}
            />

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            {/* Price & Checkout Footer */}
            <View style={styles.costBox}>
              <View>
                <Text style={styles.totalLabel}>Total Estimate</Text>
                <Text style={styles.totalPrice}>
                  {priceNum.toLocaleString()}{" "}
                  <Text style={styles.currText}>ETB</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  isSubmitting && styles.confirmBtnDisabled,
                ]}
                onPress={handleConfirmBooking}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>
                    {user ? "Confirm Reservation ✓" : "Sign In to Book →"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  backdropTapArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    width: "100%",
    zIndex: 1001,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 25,
  },
  headerBar: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 2,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  closeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 17,
  },
  providerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  providerName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  verifiedTag: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedTagText: {
    color: "#047857",
    fontSize: 9,
    fontWeight: "800",
  },
  providerPhone: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  serviceTitleAm: {
    fontSize: 13,
    color: "#047857",
    fontWeight: "700",
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  dateCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  dateCardActive: {
    borderColor: "#047857",
    backgroundColor: "#ECFDF5",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },
  dayNameActive: {
    color: "#047857",
  },
  dateSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  dateSubActive: {
    color: "#065F46",
  },
  slotRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  slotPill: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  slotPillActive: {
    borderColor: "#047857",
    backgroundColor: "#ECFDF5",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  slotText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
  },
  slotTextActive: {
    color: "#047857",
  },
  slotSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  slotSubActive: {
    color: "#065F46",
  },
  notesInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
    textAlignVertical: "top",
    minHeight: 65,
    marginBottom: 14,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "700",
  },
  costBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  totalLabel: {
    fontSize: 10,
    color: "#64748B",
    textTransform: "uppercase",
    fontWeight: "800",
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: "900",
    color: "#047857",
    marginTop: 1,
  },
  currText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
  },
  confirmBtn: {
    backgroundColor: "#047857",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnDisabled: {
    opacity: 0.65,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  successScroll: {
    padding: 24,
    alignItems: "center",
  },
  successBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ECFDF5",
    borderWidth: 1.5,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  successBadgeText: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  successCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginVertical: 18,
    gap: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: "#047857",
  },
  statusPending: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B45309",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  doneButton: {
    backgroundColor: "#047857",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});