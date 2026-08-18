// // mobile/components/ReviewModal.tsx
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/src/services/api";
// import { useAuth } from "@/src/context/AuthContext";

// interface ReviewModalProps {
//   visible: boolean;
//   bookingId: string | null;
//   listingTitle?: string;
//   providerName?: string;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// export function ReviewModal({
//   visible,
//   bookingId,
//   listingTitle,
//   providerName,
//   onClose,
//   onSuccess,
// }: ReviewModalProps) {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const [rating, setRating] = useState<number>(5);
//   const [comment, setComment] = useState<string>("");

//   const submitReviewMutation = useMutation({
//     mutationFn: async (payload: {
//       bookingId: string;
//       customerId: string;
//       rating: number;
//       comment?: string;
//     }) => {
//       const res = await api.post("/reviews", payload);
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
//       Alert.alert("Thank You! ⭐", "Your review has been submitted.");
//       setComment("");
//       setRating(5);
//       onClose();
//       if (onSuccess) onSuccess();
//     },
//     onError: (err: any) => {
//       Alert.alert("Review Failed", err?.response?.data?.error || "Could not submit review.");
//     },
//   });

//   const handleSubmit = () => {
//     const customerId = user?.id || (user as any)?.userId;
//     if (!customerId || !bookingId) {
//       Alert.alert("Error", "Missing booking details.");
//       return;
//     }

//     submitReviewMutation.mutate({
//       bookingId,
//       customerId,
//       rating,
//       comment: comment.trim() || undefined,
//     });
//   };

//   if (!visible || !bookingId) return null;

//   return (
//     <View style={styles.overlayRoot}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.backdrop} />
//       </TouchableWithoutFeedback>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={styles.sheetWrapper}
//       >
//         <View style={styles.sheetContent}>
//           {/* Grabber */}
//           <View style={styles.grabberWrapper}>
//             <View style={styles.grabber} />
//           </View>

//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.modalTitle}>Rate Your Experience</Text>
//               <Text style={styles.modalSubtitle} numberOfLines={1}>
//                 {listingTitle || "Completed Service"} {providerName ? `by ${providerName}` : ""}
//               </Text>
//             </View>
//             <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//               <Text style={styles.closeBtnText}>✕</Text>
//             </TouchableOpacity>
//           </View>

//           {/* 5-Star Selector */}
//           <View style={styles.starsContainer}>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <TouchableOpacity
//                 key={star}
//                 onPress={() => setRating(star)}
//                 style={styles.starBtn}
//                 activeOpacity={0.7}
//               >
//                 <Text style={[styles.starIcon, star <= rating ? styles.starFilled : styles.starEmpty]}>
//                   ★
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <Text style={styles.ratingText}>
//             {rating === 5
//               ? "⭐⭐⭐⭐⭐ Outstanding (በጣም ጥሩ)"
//               : rating === 4
//               ? "⭐⭐⭐⭐ Great (ጥሩ)"
//               : rating === 3
//               ? "⭐⭐⭐ Average (መካከለኛ)"
//               : rating === 2
//               ? "⭐⭐ Poor (ዝቅተኛ)"
//               : "⭐ Bad (በጣም ዝቅተኛ)"}
//           </Text>

//           {/* Comment Input */}
//           <Text style={styles.inputLabel}>Feedback or Appreciation (Optional):</Text>
//           <TextInput
//             style={styles.textArea}
//             placeholder="Share feedback on punctuality, service quality, or setup..."
//             placeholderTextColor="#9CA3AF"
//             value={comment}
//             onChangeText={setComment}
//             multiline
//             numberOfLines={3}
//           />

//           {/* Submit Action */}
//           <TouchableOpacity
//             style={[styles.submitBtn, submitReviewMutation.isPending && styles.submitBtnDisabled]}
//             onPress={handleSubmit}
//             disabled={submitReviewMutation.isPending}
//             activeOpacity={0.85}
//           >
//             {submitReviewMutation.isPending ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <Text style={styles.submitBtnText}>Submit Review ✓</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlayRoot: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: 9999,
//     justifyContent: "flex-end",
//   },
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   sheetWrapper: {
//     width: "100%",
//     justifyContent: "flex-end",
//   },
//   sheetContent: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 10,
//   },
//   grabberWrapper: {
//     alignItems: "center",
//     paddingTop: 8,
//     paddingBottom: 4,
//   },
//   grabber: {
//     width: 36,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#D1D5DB",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   modalTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
//   modalSubtitle: { fontSize: 11, color: "#6B7280", marginTop: 2 },
//   closeBtn: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeBtnText: { fontSize: 12, fontWeight: "700", color: "#4B5563" },
//   starsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 12,
//     marginTop: 16,
//     marginBottom: 6,
//   },
//   starBtn: { padding: 4 },
//   starIcon: { fontSize: 34 },
//   starFilled: { color: "#F59E0B" },
//   starEmpty: { color: "#D1D5DB" },
//   ratingText: {
//     textAlign: "center",
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#4B5563",
//     marginBottom: 12,
//   },
//   inputLabel: { fontSize: 12, fontWeight: "700", color: "#374151", marginBottom: 6 },
//   textArea: {
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 13,
//     color: "#111827",
//     height: 75,
//     textAlignVertical: "top",
//   },
//   submitBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 14,
//   },
//   submitBtnDisabled: { opacity: 0.7 },
//   submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
// });
// mobile/components/ReviewModal.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

interface ReviewModalProps {
  visible: boolean;
  bookingId: string | null;
  listingTitle?: string;
  providerName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({
  visible,
  bookingId,
  listingTitle,
  providerName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const submitReviewMutation = useMutation({
    mutationFn: async (payload: {
      bookingId: string;
      customerId: string;
      rating: number;
      comment?: string;
    }) => {
      const res = await api.post("/reviews", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      Alert.alert("Thank You! ⭐", "Your review has been successfully submitted.");
      setComment("");
      setRating(5);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      Alert.alert("Review Failed", err?.response?.data?.error || "Could not submit review.");
    },
  });

  const handleSubmit = () => {
    const customerId = user?.id || (user as any)?.userId;
    if (!customerId || !bookingId) {
      Alert.alert("Error", "Missing booking details.");
      return;
    }

    submitReviewMutation.mutate({
      bookingId,
      customerId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  if (!visible || !bookingId) return null;

  return (
    <View style={styles.overlayRoot}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
          {/* Grabber */}
          <View style={styles.grabberWrapper}>
            <View style={styles.grabber} />
          </View>

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Rate Your Experience</Text>
              <Text style={styles.modalSubtitle} numberOfLines={1}>
                {listingTitle || "Completed Service"} {providerName ? `by ${providerName}` : ""}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.75}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 5-Star Selector */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.starIcon, star <= rating ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 5
              ? "⭐⭐⭐⭐⭐ Outstanding (በጣም ጥሩ)"
              : rating === 4
              ? "⭐⭐⭐⭐ Great (ጥሩ)"
              : rating === 3
              ? "⭐⭐⭐ Average (መካከለኛ)"
              : rating === 2
              ? "⭐⭐ Poor (ዝቅተኛ)"
              : "⭐ Bad (በጣም ዝቅተኛ)"}
          </Text>

          {/* Comment Input */}
          <Text style={styles.inputLabel}>Feedback or Appreciation (Optional):</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share feedback on punctuality, service quality, or setup..."
            placeholderTextColor="#94A3B8"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
          />

          {/* Submit Action */}
          <TouchableOpacity
            style={[styles.submitBtn, submitReviewMutation.isPending && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitReviewMutation.isPending}
            activeOpacity={0.85}
          >
            {submitReviewMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Review ✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  sheetWrapper: {
    width: "100%",
    justifyContent: "flex-end",
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  grabberWrapper: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: { fontSize: 17, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2, fontWeight: "500" },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { fontSize: 13, fontWeight: "800", color: "#475569" },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 18,
    marginBottom: 6,
  },
  starBtn: { padding: 4 },
  starIcon: { fontSize: 36 },
  starFilled: { color: "#F59E0B" },
  starEmpty: { color: "#E2E8F0" },
  ratingText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
    marginBottom: 16,
    backgroundColor: "#ECFDF5",
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  inputLabel: { fontSize: 12, fontWeight: "800", color: "#334155", marginBottom: 6 },
  textArea: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#047857",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.2 },
});