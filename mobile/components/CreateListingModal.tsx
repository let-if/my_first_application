// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/src/services/api";
// import { useAuth } from "@/src/context/AuthContext";

// interface Category {
//   id: string;
//   nameEn: string;
//   nameAm: string;
//   icon?: string;
// }

// const ADDIS_SUBCITIES = [
//   { label: "Bole (ቦሌ)", value: "BOLE" },
//   { label: "Kirkos (ቂርቆስ)", value: "KIRKOS" },
//   { label: "Yeka (የካ)", value: "YEKA" },
//   { label: "Arada (አራዳ)", value: "ARADA" },
//   { label: "Lideta (ልደታ)", value: "LIDETA" },
//   { label: "Lemi Kura (ለሚ ኩራ)", value: "LEMI_KURA" },
//   { label: "Nifas Silk (ንፋስ ስልክ)", value: "NIFAS_SILK_LAFTO" },
//   { label: "Addis Ketema (አዲስ ከተማ)", value: "ADDIS_KETEMA" },
//   { label: "Gullele (ጉለሌ)", value: "GULLELE" },
//   { label: "Kolfe Keranio (ኮልፌ ቀራኒዮ)", value: "KOLFE_KERANIO" },
//   { label: "Akaky Kaliti (አቃቂ ቃሊቲ)", value: "AKAKY_KALITI" },
// ];

// interface CreateListingModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// export function CreateListingModal({ visible, onClose, onSuccess }: CreateListingModalProps) {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const [title, setTitle] = useState("");
//   const [titleAm, setTitleAm] = useState("");
//   const [description, setDescription] = useState("");
//   const [priceBirr, setPriceBirr] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubCity, setSelectedSubCity] = useState<string>("BOLE");
//   const [specificArea, setSpecificArea] = useState("");

//   const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await api.get("/categories");
//       return res.data;
//     },
//     enabled: visible,
//   });

//   const createListingMutation = useMutation({
//     mutationFn: async (payload: any) => {
//       const res = await api.post("/listings", payload);
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["listings"] });
//       queryClient.invalidateQueries({ queryKey: ["provider-listings"] });
//       Alert.alert("Success 🎉", "Your service listing is now live!");
//       resetForm();
//       onClose();
//       if (onSuccess) onSuccess();
//     },
//     onError: (err: any) => {
//       Alert.alert("Error", err?.response?.data?.error || "Could not publish listing.");
//     },
//   });

//   const resetForm = () => {
//     setTitle("");
//     setTitleAm("");
//     setDescription("");
//     setPriceBirr("");
//     setSelectedCategory("");
//     setSelectedSubCity("BOLE");
//     setSpecificArea("");
//   };

//   const handleSubmit = () => {
//     const activeProviderId = user?.id || (user as any)?.userId;

//     if (!activeProviderId) {
//       Alert.alert("Error", "Provider session missing. Please re-login.");
//       return;
//     }
//     if (!title.trim()) {
//       Alert.alert("Required", "Please enter a service title.");
//       return;
//     }
//     if (!selectedCategory) {
//       Alert.alert("Required", "Please select a service category.");
//       return;
//     }
//     if (!priceBirr || isNaN(Number(priceBirr)) || Number(priceBirr) <= 0) {
//       Alert.alert("Required", "Please enter a valid price in Birr.");
//       return;
//     }
//     if (!description.trim()) {
//       Alert.alert("Required", "Please enter a short description.");
//       return;
//     }

//     createListingMutation.mutate({
//       providerId: activeProviderId,
//       categoryId: selectedCategory,
//       title: title.trim(),
//       titleAm: titleAm.trim() || undefined,
//       description: description.trim(),
//       priceBirr: Number(priceBirr),
//       subCity: selectedSubCity,
//       specificArea: specificArea.trim() || "Addis Ababa",
//       images: [],
//     });
//   };

//   if (!visible) return null;

//   return (
//     <View style={styles.overlayRoot}>
//       {/* Background dim that dismisses on tap */}
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.backdrop} />
//       </TouchableWithoutFeedback>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={styles.sheetWrapper}
//       >
//         <View style={styles.sheetContent}>
//           {/* Top Grabber */}
//           <View style={styles.grabberWrapper}>
//             <View style={styles.grabber} />
//           </View>

//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.modalTitle}>Post New Service</Text>
//               <Text style={styles.modalSubtitle}>Addis Ababa service listing</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.closeBtn}
//               onPress={onClose}
//               hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//             >
//               <Text style={styles.closeBtnText}>✕</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Scrollable Form */}
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.formScroll}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Category Selector */}
//             <Text style={styles.label}>Service Category *</Text>
//             {isCategoriesLoading ? (
//               <ActivityIndicator size="small" color="#047857" style={{ marginVertical: 6 }} />
//             ) : (
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
//                 {(categories || []).map((cat) => {
//                   const isSelected = selectedCategory === cat.id;
//                   return (
//                     <TouchableOpacity
//                       key={cat.id}
//                       style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
//                       onPress={() => setSelectedCategory(cat.id)}
//                     >
//                       <Text
//                         style={[
//                           styles.categoryChipText,
//                           isSelected && styles.categoryChipTextActive,
//                         ]}
//                       >
//                         {cat.nameEn} ({cat.nameAm})
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             )}

//             {/* Title (EN) */}
//             <Text style={styles.label}>Service Title (English) *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. Master Jebena Coffee Ceremony"
//               value={title}
//               onChangeText={setTitle}
//               placeholderTextColor="#9CA3AF"
//             />

//             {/* Title (AM) */}
//             <Text style={styles.label}>Service Title (Amharic / አማርኛ)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="ምሳሌ፡ የባህል ጀበና ቡና ዝግጅት"
//               value={titleAm}
//               onChangeText={setTitleAm}
//               placeholderTextColor="#9CA3AF"
//             />

//             {/* SubCity */}
//             <Text style={styles.label}>SubCity (ክፍለ ከተማ) *</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
//               {ADDIS_SUBCITIES.map((sc) => {
//                 const isSelected = selectedSubCity === sc.value;
//                 return (
//                   <TouchableOpacity
//                     key={sc.value}
//                     style={[styles.subCityChip, isSelected && styles.subCityChipActive]}
//                     onPress={() => setSelectedSubCity(sc.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.subCityChipText,
//                         isSelected && styles.subCityChipTextActive,
//                       ]}
//                     >
//                       {sc.label}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </ScrollView>

//             {/* Specific Area */}
//             <Text style={styles.label}>Specific Area / Landmark</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. Atlas, near Edna Mall / Megenagna"
//               value={specificArea}
//               onChangeText={setSpecificArea}
//               placeholderTextColor="#9CA3AF"
//             />

//             {/* Price */}
//             <Text style={styles.label}>Starting Price (ETB / ብር) *</Text>
//             <View style={styles.priceInputWrapper}>
//               <TextInput
//                 style={styles.priceInput}
//                 placeholder="1200"
//                 keyboardType="numeric"
//                 value={priceBirr}
//                 onChangeText={setPriceBirr}
//                 placeholderTextColor="#9CA3AF"
//               />
//               <Text style={styles.currencySuffix}>ETB</Text>
//             </View>

//             {/* Description */}
//             <Text style={styles.label}>Description & Service Inclusions *</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="Explain what is included, preparation time..."
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={3}
//               placeholderTextColor="#9CA3AF"
//             />

//             {/* Submit */}
//             <TouchableOpacity
//               style={[styles.submitBtn, createListingMutation.isPending && styles.submitBtnDisabled]}
//               onPress={handleSubmit}
//               disabled={createListingMutation.isPending}
//               activeOpacity={0.85}
//             >
//               {createListingMutation.isPending ? (
//                 <ActivityIndicator color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.submitBtnText}>Publish Service Listing ✓</Text>
//               )}
//             </TouchableOpacity>
//           </ScrollView>
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
//     maxHeight: 520,
//     paddingBottom: 16,
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
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   modalTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
//   modalSubtitle: { fontSize: 11, color: "#6B7280" },
//   closeBtn: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeBtnText: { fontSize: 12, fontWeight: "700", color: "#4B5563" },
//   formScroll: {
//     paddingHorizontal: 16,
//     paddingTop: 6,
//     paddingBottom: 20,
//   },
//   label: { fontSize: 11, fontWeight: "700", color: "#374151", marginTop: 8, marginBottom: 4 },
//   input: {
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     fontSize: 13,
//     color: "#111827",
//   },
//   textArea: { height: 65, textAlignVertical: "top" },
//   chipRow: { flexDirection: "row", marginBottom: 2 },
//   categoryChip: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 14,
//     backgroundColor: "#F3F4F6",
//     marginRight: 6,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   categoryChipActive: { backgroundColor: "#047857", borderColor: "#047857" },
//   categoryChipText: { fontSize: 11, fontWeight: "600", color: "#4B5563" },
//   categoryChipTextActive: { color: "#FFFFFF" },
//   subCityChip: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 14,
//     backgroundColor: "#F3F4F6",
//     marginRight: 6,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   subCityChipActive: { backgroundColor: "#065F46", borderColor: "#065F46" },
//   subCityChipText: { fontSize: 11, fontWeight: "600", color: "#4B5563" },
//   subCityChipTextActive: { color: "#FFFFFF" },
//   priceInputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },
//   priceInput: { flex: 1, paddingVertical: 7, fontSize: 13, fontWeight: "700", color: "#111827" },
//   currencySuffix: { fontSize: 12, fontWeight: "800", color: "#047857", marginLeft: 6 },
//   submitBtn: {
//     backgroundColor: "#047857",
//     paddingVertical: 11,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 14,
//     marginBottom: 10,
//   },
//   submitBtnDisabled: { opacity: 0.7 },
//   submitBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
// });
// components/CreateListingModal.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

interface Category {
  id: string;
  nameEn: string;
  nameAm: string;
  icon?: string;
}

const ADDIS_SUBCITIES = [
  { label: "Bole (ቦሌ)", value: "BOLE" },
  { label: "Kirkos (ቂርቆስ)", value: "KIRKOS" },
  { label: "Yeka (የካ)", value: "YEKA" },
  { label: "Arada (አራዳ)", value: "ARADA" },
  { label: "Lideta (ልደታ)", value: "LIDETA" },
  { label: "Lemi Kura (ለሚ ኩራ)", value: "LEMI_KURA" },
  { label: "Nifas Silk (ንፋስ ስልክ)", value: "NIFAS_SILK_LAFTO" },
  { label: "Addis Ketema (አዲስ ከተማ)", value: "ADDIS_KETEMA" },
  { label: "Gullele (ጉለሌ)", value: "GULLELE" },
  { label: "Kolfe Keranio (ኮልፌ ቀራኒዮ)", value: "KOLFE_KERANIO" },
  { label: "Akaky Kaliti (አቃቂ ቃሊቲ)", value: "AKAKY_KALITI" },
];

interface CreateListingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function CreateListingModal({ visible, onClose, onSuccess }: CreateListingModalProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [description, setDescription] = useState("");
  const [priceBirr, setPriceBirr] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCity, setSelectedSubCity] = useState<string>("BOLE");
  const [specificArea, setSpecificArea] = useState("");

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
    enabled: visible,
  });

  const createListingMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/listings", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-listings"] });
      Alert.alert("Success 🎉", "Your service listing is now live across Addis Ababa!");
      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.response?.data?.error || "Could not publish listing.");
    },
  });

  const resetForm = () => {
    setTitle("");
    setTitleAm("");
    setDescription("");
    setPriceBirr("");
    setSelectedCategory("");
    setSelectedSubCity("BOLE");
    setSpecificArea("");
  };

  const handleSubmit = () => {
    const activeProviderId = user?.id || (user as any)?.userId;

    if (!activeProviderId) {
      Alert.alert("Error", "Provider session missing. Please re-login.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a service title.");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Required", "Please select a service category.");
      return;
    }
    if (!priceBirr || isNaN(Number(priceBirr)) || Number(priceBirr) <= 0) {
      Alert.alert("Required", "Please enter a valid starting price in Birr.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Required", "Please enter a short description.");
      return;
    }

    createListingMutation.mutate({
      providerId: activeProviderId,
      categoryId: selectedCategory,
      title: title.trim(),
      titleAm: titleAm.trim() || undefined,
      description: description.trim(),
      priceBirr: Number(priceBirr),
      subCity: selectedSubCity,
      specificArea: specificArea.trim() || "Addis Ababa",
      images: [],
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.overlayRoot}>
      {/* Background dim */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom + 10, 20) }]}>
          {/* Top Grabber */}
          <View style={styles.grabberWrapper}>
            <View style={styles.grabber} />
          </View>

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Post New Service</Text>
              <Text style={styles.modalSubtitle}>Addis Ababa Provider Marketplace</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Form */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formScroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Category Selector */}
            <Text style={styles.label}>Service Category *</Text>
            {isCategoriesLoading ? (
              <ActivityIndicator size="small" color="#047857" style={{ marginVertical: 8 }} />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {(categories || []).map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                      onPress={() => setSelectedCategory(cat.id)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.nameEn} ({cat.nameAm})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Title (EN) */}
            <Text style={styles.label}>Service Title (English) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Master Jebena Coffee Ceremony"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            {/* Title (AM) */}
            <Text style={styles.label}>Service Title (Amharic / አማርኛ)</Text>
            <TextInput
              style={styles.input}
              placeholder="ምሳሌ፡ የባህል ጀበና ቡና ዝግጅት"
              placeholderTextColor="#94A3B8"
              value={titleAm}
              onChangeText={setTitleAm}
            />

            {/* SubCity */}
            <Text style={styles.label}>SubCity (ክፍለ ከተማ) *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {ADDIS_SUBCITIES.map((sc) => {
                const isSelected = selectedSubCity === sc.value;
                return (
                  <TouchableOpacity
                    key={sc.value}
                    style={[styles.subCityChip, isSelected && styles.subCityChipActive]}
                    onPress={() => setSelectedSubCity(sc.value)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.subCityChipText,
                        isSelected && styles.subCityChipTextActive,
                      ]}
                    >
                      {sc.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Specific Area */}
            <Text style={styles.label}>Specific Area / Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Atlas, near Edna Mall / Megenagna"
              placeholderTextColor="#94A3B8"
              value={specificArea}
              onChangeText={setSpecificArea}
            />

            {/* Price */}
            <Text style={styles.label}>Starting Price (ETB / ብር) *</Text>
            <View style={styles.priceInputWrapper}>
              <TextInput
                style={styles.priceInput}
                placeholder="1200"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={priceBirr}
                onChangeText={setPriceBirr}
              />
              <Text style={styles.currencySuffix}>ETB</Text>
            </View>

            {/* Description */}
            <Text style={styles.label}>Description & Service Inclusions *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Explain what is included, ingredients, duration..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, createListingMutation.isPending && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={createListingMutation.isPending}
              activeOpacity={0.85}
            >
              {createListingMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Publish Service Listing ✓</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },
  sheetWrapper: {
    width: "100%",
    justifyContent: "flex-end",
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.82,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  grabberWrapper: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: { fontSize: 17, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 12, color: "#64748B", marginTop: 1 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { fontSize: 13, fontWeight: "800", color: "#475569" },
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  label: { fontSize: 12, fontWeight: "800", color: "#334155", marginTop: 12, marginBottom: 5 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  textArea: { height: 75, textAlignVertical: "top" },
  chipRow: { gap: 8, paddingVertical: 2 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: { backgroundColor: "#047857", borderColor: "#047857" },
  categoryChipText: { fontSize: 12, fontWeight: "700", color: "#475569" },
  categoryChipTextActive: { color: "#FFFFFF" },
  subCityChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subCityChipActive: { backgroundColor: "#047857", borderColor: "#047857" },
  subCityChipText: { fontSize: 12, fontWeight: "700", color: "#475569" },
  subCityChipTextActive: { color: "#FFFFFF" },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  priceInput: { flex: 1, paddingVertical: 10, fontSize: 14, fontWeight: "800", color: "#0F172A" },
  currencySuffix: { fontSize: 13, fontWeight: "900", color: "#047857", marginLeft: 6 },
  submitBtn: {
    backgroundColor: "#047857",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.2 },
});