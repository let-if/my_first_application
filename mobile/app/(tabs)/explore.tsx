
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
// } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import api from "@/src/services/api";
// import { BookingModal, BookingListing } from "@/src/components/BookingModal";

// const SUBCITIES = [
//   { label: "All Addis", value: "ALL" },
//   { label: "Bole (ቦሌ)", value: "BOLE" },
//   { label: "Kirkos (ቂርቆስ)", value: "KIRKOS" },
//   { label: "Yeka (የካ)", value: "YEKA" },
//   { label: "Arada (አራዳ)", value: "ARADA" },
//   { label: "Lideta (ልደታ)", value: "LIDETA" },
//   { label: "Lemi Kura (ለሚ ኩራ)", value: "LEMI_KURA" },
//   { label: "Nifas Silk (ንፋስ ስልክ)", value: "NIFAS_SILK_LAFTO" },
//   { label: "Addis Ketema (አዲስ ከተማ)", value: "ADDIS_KETEMA" },
//   { label: "Gullele (ጉለሌ)", value: "GULLELE" },
//   { label: "Kolfe (ኮልፌ)", value: "KOLFE_KERANIO" },
//   { label: "Akaky (አቃቂ)", value: "AKAKY_KALITI" },
// ];

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
//   isVerified: boolean;
//   images: string[];
//   category: Category;
//   provider: Provider;
//   createdAt: string;
//   averageRating?: number;
//   reviewCount?: number;
// }

// export default function ExploreScreen() {
//   const router = useRouter();
//   const params = useLocalSearchParams<{ categoryId?: string; subcity?: string }>();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSubcity, setSelectedSubcity] = useState(params.subcity || "ALL");
//   const [selectedCategory, setSelectedCategory] = useState(params.categoryId || "ALL");

//   // Booking Modal State
//   const [activeBookingListing, setActiveBookingListing] = useState<BookingListing | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (params.subcity) setSelectedSubcity(params.subcity);
//     if (params.categoryId) setSelectedCategory(params.categoryId);
//   }, [params.subcity, params.categoryId]);

//   const { data: categories } = useQuery<Category[]>({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await api.get("/categories");
//       return res.data;
//     },
//   });

//   const {
//     data: listings,
//     isLoading,
//     isError,
//     refetch,
//     isRefetching,
//   } = useQuery<Listing[]>({
//     queryKey: ["listings", selectedSubcity, selectedCategory],
//     queryFn: async () => {
//       const queryParts: string[] = [];
//       if (selectedSubcity !== "ALL") queryParts.push(`subCity=${encodeURIComponent(selectedSubcity)}`);
//       if (selectedCategory !== "ALL") queryParts.push(`categoryId=${encodeURIComponent(selectedCategory)}`);

//       const url = queryParts.length > 0 ? `/listings?${queryParts.join("&")}` : "/listings";
//       const res = await api.get(url);
//       return res.data;
//     },
//   });

//   const filteredListings = useMemo(() => {
//     if (!listings) return [];
//     if (!searchQuery.trim()) return listings;

//     const q = searchQuery.toLowerCase().trim();
//     return listings.filter(
//       (item) =>
//         item.title.toLowerCase().includes(q) ||
//         (item.titleAm && item.titleAm.toLowerCase().includes(q)) ||
//         item.description.toLowerCase().includes(q) ||
//         item.specificArea.toLowerCase().includes(q) ||
//         item.provider?.fullName?.toLowerCase().includes(q) ||
//         item.category?.nameEn?.toLowerCase().includes(q) ||
//         (item.category?.nameAm && item.category.nameAm.toLowerCase().includes(q))
//     );
//   }, [listings, searchQuery]);

//   const formatSubCityName = (enumVal: string) => {
//     return enumVal
//       .replace(/_/g, " ")
//       .toLowerCase()
//       .replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   const handleOpenBooking = (item: Listing) => {
//     setActiveBookingListing(item as unknown as BookingListing);
//     setIsModalOpen(true);
//   };

//   const renderListingCard = ({ item }: { item: Listing }) => {
//     const formattedPrice = Number(item.priceBirr).toLocaleString();
//     const hasRatings = (item.reviewCount ?? 0) > 0;

//     return (
//       <TouchableOpacity
//         activeOpacity={0.88}
//         style={styles.card}
//         onPress={() => handleOpenBooking(item)}
//       >
//         <View style={styles.cardHeader}>
//           <View style={styles.providerInfo}>
//             <View style={styles.avatarCircle}>
//               <Text style={styles.avatarText}>
//                 {item.provider?.fullName ? item.provider.fullName.charAt(0).toUpperCase() : "P"}
//               </Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <View style={styles.nameRow}>
//                 <Text style={styles.providerName}>{item.provider?.fullName}</Text>
//                 {item.isVerified && (
//                   <View style={styles.verifiedBadge}>
//                     <Text style={styles.verifiedText}>✓ Verified</Text>
//                   </View>
//                 )}
//               </View>
//               <Text style={styles.categorySubtext}>
//                 {item.category?.nameEn} {item.category?.nameAm ? `(${item.category.nameAm})` : ""}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.subcityTag}>
//             <Text style={styles.subcityTagText}>📍 {formatSubCityName(item.subCity)}</Text>
//           </View>
//         </View>

//         <Text style={styles.listingTitle}>{item.title}</Text>
//         {item.titleAm ? <Text style={styles.listingTitleAm}>{item.titleAm}</Text> : null}
//         <Text style={styles.specificAreaText}>📌 {item.specificArea}</Text>
//         <Text style={styles.listingDesc} numberOfLines={2}>
//           {item.description}
//         </Text>

//         <View style={styles.cardFooter}>
//           {/* Real-time Star Rating & Review Count */}
//           <View style={styles.ratingBox}>
//             <Text style={styles.starIcon}>★</Text>
//             <Text style={styles.ratingNumber}>
//               {hasRatings ? Number(item.averageRating).toFixed(1) : "New"}
//             </Text>
//             <Text style={styles.reviewCountText}>
//               ({item.reviewCount || 0} {item.reviewCount === 1 ? "review" : "reviews"})
//             </Text>
//           </View>

//           <View style={styles.actionRow}>
//             <View style={styles.priceContainer}>
//               <Text style={styles.priceLabel}>Price</Text>
//               <View style={styles.priceRow}>
//                 <Text style={styles.priceValue}>{formattedPrice}</Text>
//                 <Text style={styles.priceCurrency}>ETB</Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.bookButton}
//               activeOpacity={0.8}
//               onPress={() => handleOpenBooking(item)}
//             >
//               <Text style={styles.bookButtonText}>Book Service</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchHeader}>
//         <View style={styles.searchBox}>
//           <Text style={styles.searchIcon}>🔍</Text>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search service, area (e.g. Bole Atlas, ቡና)..."
//             placeholderTextColor="#9CA3AF"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Text style={styles.clearSearchText}>✕</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       <View style={styles.filterSection}>
//         {/* Categories Bar */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
//           <TouchableOpacity
//             style={[styles.categoryPill, selectedCategory === "ALL" && styles.categoryPillActive]}
//             onPress={() => setSelectedCategory("ALL")}
//           >
//             <Text style={[styles.categoryPillText, selectedCategory === "ALL" && styles.categoryPillTextActive]}>
//               ✨ All Categories
//             </Text>
//           </TouchableOpacity>
//           {categories?.map((cat) => (
//             <TouchableOpacity
//               key={cat.id}
//               style={[styles.categoryPill, selectedCategory === cat.id && styles.categoryPillActive]}
//               onPress={() => setSelectedCategory(cat.id)}
//             >
//               <Text style={[styles.categoryPillText, selectedCategory === cat.id && styles.categoryPillTextActive]}>
//                 {cat.nameEn}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* SubCity Pills */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
//           {SUBCITIES.map((sub) => {
//             const isSelected = selectedSubcity === sub.value;
//             return (
//               <TouchableOpacity
//                 key={sub.value}
//                 style={[styles.subcityPill, isSelected && styles.subcityPillActive]}
//                 onPress={() => setSelectedSubcity(sub.value)}
//               >
//                 <Text style={[styles.subcityPillText, isSelected && styles.subcityPillTextActive]}>
//                   {sub.label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>

//       {isLoading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#047857" />
//           <Text style={styles.helperText}>Finding verified services in Addis...</Text>
//         </View>
//       ) : isError ? (
//         <View style={styles.centerContainer}>
//           <Text style={styles.errorEmoji}>⚠️</Text>
//           <Text style={styles.errorTitle}>Could not load listings</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       ) : filteredListings.length === 0 ? (
//         <View style={styles.centerContainer}>
//           <Text style={styles.emptyEmoji}>🔎</Text>
//           <Text style={styles.emptyTitle}>No services found</Text>
//           <Text style={styles.emptySubtitle}>Try changing your subcity filter or category selection.</Text>
//           {(selectedSubcity !== "ALL" || selectedCategory !== "ALL" || searchQuery.length > 0) && (
//             <TouchableOpacity
//               style={styles.resetBtn}
//               onPress={() => {
//                 setSelectedSubcity("ALL");
//                 setSelectedCategory("ALL");
//                 setSearchQuery("");
//               }}
//             >
//               <Text style={styles.resetBtnText}>Reset All Filters</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         <FlatList
//           data={filteredListings}
//           keyExtractor={(item) => item.id}
//           renderItem={renderListingCard}
//           refreshControl={
//             <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#047857"]} tintColor="#047857" />
//           }
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       {/* Interactive Booking Modal */}
//       <BookingModal
//         visible={isModalOpen}
//         listing={activeBookingListing}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },
//   searchHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, backgroundColor: "#FFFFFF" },
//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   searchIcon: { fontSize: 13, marginRight: 6 },
//   searchInput: { flex: 1, fontSize: 13, color: "#111827" },
//   clearSearchText: { fontSize: 13, color: "#9CA3AF", fontWeight: "700", paddingHorizontal: 4 },
//   filterSection: {
//     backgroundColor: "#FFFFFF",
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//     gap: 6,
//   },
//   filterScrollContent: { paddingHorizontal: 16, gap: 6 },
//   categoryPill: {
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 20,
//     backgroundColor: "#F3F4F6",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   categoryPillActive: { backgroundColor: "#047857", borderColor: "#047857" },
//   categoryPillText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },
//   categoryPillTextActive: { color: "#FFFFFF" },
//   subcityPill: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 14,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },
//   subcityPillActive: { backgroundColor: "#ECFDF5", borderColor: "#047857" },
//   subcityPillText: { fontSize: 11, fontWeight: "500", color: "#6B7280" },
//   subcityPillTextActive: { color: "#047857", fontWeight: "700" },
//   listContent: { padding: 16, gap: 14, paddingBottom: 30 },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
//   providerInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
//   avatarCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
//   nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
//   providerName: { fontSize: 13, fontWeight: "700", color: "#111827" },
//   verifiedBadge: { backgroundColor: "#ECFDF5", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
//   verifiedText: { color: "#047857", fontSize: 10, fontWeight: "700" },
//   categorySubtext: { fontSize: 11, color: "#6B7280", marginTop: 1 },
//   subcityTag: { backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
//   subcityTagText: { fontSize: 11, fontWeight: "600", color: "#374151" },
//   listingTitle: { fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 2 },
//   listingTitleAm: { fontSize: 13, color: "#6B7280", marginBottom: 4 },
//   specificAreaText: { fontSize: 11, color: "#047857", fontWeight: "600", marginBottom: 6 },
//   listingDesc: { fontSize: 12, color: "#4B5563", lineHeight: 18, marginBottom: 12 },
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//   },
//   ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
//   starIcon: { color: "#F59E0B", fontSize: 15 },
//   ratingNumber: { fontSize: 13, fontWeight: "800", color: "#111827" },
//   reviewCountText: { fontSize: 11, color: "#6B7280" },
//   actionRow: { flexDirection: "row", alignItems: "center", gap: 12 },
//   priceContainer: {},
//   priceLabel: { fontSize: 10, color: "#6B7280", textTransform: "uppercase", fontWeight: "600" },
//   priceRow: { flexDirection: "row", alignItems: "baseline", gap: 3, marginTop: 1 },
//   priceValue: { fontSize: 16, fontWeight: "800", color: "#047857" },
//   priceCurrency: { fontSize: 11, fontWeight: "700", color: "#047857" },
//   bookButton: { backgroundColor: "#047857", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
//   bookButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
//   centerContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
//   helperText: { marginTop: 12, fontSize: 13, color: "#6B7280" },
//   errorEmoji: { fontSize: 32, marginBottom: 8 },
//   errorTitle: { fontSize: 15, fontWeight: "700", color: "#991B1B" },
//   retryButton: { marginTop: 12, backgroundColor: "#047857", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
//   retryButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
//   emptyEmoji: { fontSize: 34, marginBottom: 6 },
//   emptyTitle: { fontSize: 15, fontWeight: "700", color: "#374151" },
//   emptySubtitle: { fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 4 },
//   resetBtn: { marginTop: 12, backgroundColor: "#047857", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
//   resetBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
// });
import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "@/src/services/api";
import { BookingModal, BookingListing } from "@/src/components/BookingModal";

const SUBCITIES = [
  { label: "All Addis", value: "ALL" },
  { label: "Bole (ቦሌ)", value: "BOLE" },
  { label: "Kirkos (ቂርቆስ)", value: "KIRKOS" },
  { label: "Yeka (የካ)", value: "YEKA" },
  { label: "Arada (አራዳ)", value: "ARADA" },
  { label: "Lideta (ልደታ)", value: "LIDETA" },
  { label: "Lemi Kura (ለሚ ኩራ)", value: "LEMI_KURA" },
  { label: "Nifas Silk (ንፋስ ስልክ)", value: "NIFAS_SILK_LAFTO" },
  { label: "Addis Ketema (አዲስ ከተማ)", value: "ADDIS_KETEMA" },
  { label: "Gullele (ጉለሌ)", value: "GULLELE" },
  { label: "Kolfe (ኮልፌ)", value: "KOLFE_KERANIO" },
  { label: "Akaky (አቃቂ)", value: "AKAKY_KALITI" },
];

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
  isVerified: boolean;
  images: string[];
  category: Category;
  provider: Provider;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
}

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ categoryId?: string; subcity?: string }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcity, setSelectedSubcity] = useState(params.subcity || "ALL");
  const [selectedCategory, setSelectedCategory] = useState(params.categoryId || "ALL");

  // Booking Modal State
  const [activeBookingListing, setActiveBookingListing] = useState<BookingListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (params.subcity) setSelectedSubcity(params.subcity);
    if (params.categoryId) setSelectedCategory(params.categoryId);
  }, [params.subcity, params.categoryId]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  const {
    data: listings,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Listing[]>({
    queryKey: ["listings", selectedSubcity, selectedCategory],
    queryFn: async () => {
      const queryParts: string[] = [];
      if (selectedSubcity !== "ALL") queryParts.push(`subCity=${encodeURIComponent(selectedSubcity)}`);
      if (selectedCategory !== "ALL") queryParts.push(`categoryId=${encodeURIComponent(selectedCategory)}`);

      const url = queryParts.length > 0 ? `/listings?${queryParts.join("&")}` : "/listings";
      const res = await api.get(url);
      return res.data;
    },
  });

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    if (!searchQuery.trim()) return listings;

    const q = searchQuery.toLowerCase().trim();
    return listings.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.titleAm && item.titleAm.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        item.specificArea.toLowerCase().includes(q) ||
        item.provider?.fullName?.toLowerCase().includes(q) ||
        item.category?.nameEn?.toLowerCase().includes(q) ||
        (item.category?.nameAm && item.category.nameAm.toLowerCase().includes(q))
    );
  }, [listings, searchQuery]);

  const formatSubCityName = (enumVal: string) => {
    return enumVal
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleOpenBooking = (item: Listing) => {
    setActiveBookingListing(item as unknown as BookingListing);
    setIsModalOpen(true);
  };

  const renderListingCard = ({ item }: { item: Listing }) => {
    const formattedPrice = Number(item.priceBirr).toLocaleString();
    const hasRatings = (item.reviewCount ?? 0) > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.card}
        onPress={() => handleOpenBooking(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.providerInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {item.provider?.fullName ? item.provider.fullName.charAt(0).toUpperCase() : "P"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.providerName}>{item.provider?.fullName}</Text>
                {item.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>
              <Text style={styles.categorySubtext}>
                {item.category?.nameEn} {item.category?.nameAm ? `(${item.category.nameAm})` : ""}
              </Text>
            </View>
          </View>

          <View style={styles.subcityTag}>
            <Text style={styles.subcityTagText}>📍 {formatSubCityName(item.subCity)}</Text>
          </View>
        </View>

        <Text style={styles.listingTitle}>{item.title}</Text>
        {item.titleAm ? <Text style={styles.listingTitleAm}>{item.titleAm}</Text> : null}
        <Text style={styles.specificAreaText}>🏢 {item.specificArea || "Addis Ababa"}</Text>
        <Text style={styles.listingDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          {/* Real-time Star Rating & Review Count */}
          <View style={styles.ratingBox}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingNumber}>
              {hasRatings ? Number(item.averageRating).toFixed(1) : "New"}
            </Text>
            <Text style={styles.reviewCountText}>
              ({item.reviewCount || 0} {item.reviewCount === 1 ? "review" : "reviews"})
            </Text>
          </View>

          <View style={styles.actionRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Estimated</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>{formattedPrice}</Text>
                <Text style={styles.priceCurrency}>ETB</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bookButton}
              activeOpacity={0.85}
              onPress={() => handleOpenBooking(item)}
            >
              <Text style={styles.bookButtonText}>Book Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Search Header */}
      <View style={[styles.searchHeader, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search coffee, catering, Bole Atlas, ቡና..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterSection}>
        {/* Categories Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          <TouchableOpacity
            style={[styles.categoryPill, selectedCategory === "ALL" && styles.categoryPillActive]}
            onPress={() => setSelectedCategory("ALL")}
            activeOpacity={0.75}
          >
            <Text style={[styles.categoryPillText, selectedCategory === "ALL" && styles.categoryPillTextActive]}>
              ✨ All Categories
            </Text>
          </TouchableOpacity>
          {categories?.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryPill, selectedCategory === cat.id && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.categoryPillText, selectedCategory === cat.id && styles.categoryPillTextActive]}>
                {cat.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SubCity Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {SUBCITIES.map((sub) => {
            const isSelected = selectedSubcity === sub.value;
            return (
              <TouchableOpacity
                key={sub.value}
                style={[styles.subcityPill, isSelected && styles.subcityPillActive]}
                onPress={() => setSelectedSubcity(sub.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.subcityPillText, isSelected && styles.subcityPillTextActive]}>
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Body Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={styles.helperText}>Finding verified services in Addis...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Could not load listings</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>Try Again 🔄</Text>
          </TouchableOpacity>
        </View>
      ) : filteredListings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>🔎</Text>
          <Text style={styles.emptyTitle}>No services found</Text>
          <Text style={styles.emptySubtitle}>Try changing your subcity filter or category selection.</Text>
          {(selectedSubcity !== "ALL" || selectedCategory !== "ALL" || searchQuery.length > 0) && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSelectedSubcity("ALL");
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          renderItem={renderListingCard}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#047857"]} tintColor="#047857" />
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom + 40, 60) },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Interactive Booking Modal */}
      <BookingModal
        visible={isModalOpen}
        listing={activeBookingListing}
        onClose={() => setIsModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  searchHeader: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  clearSearchText: { fontSize: 13, color: "#94A3B8", fontWeight: "700", paddingHorizontal: 4 },
  filterSection: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 8,
  },
  filterScrollContent: { paddingHorizontal: 16, gap: 8 },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryPillActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillText: { fontSize: 12, fontWeight: "600", color: "#475569" },
  categoryPillTextActive: { color: "#FFFFFF", fontWeight: "800" },
  subcityPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  subcityPillActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#059669",
  },
  subcityPillText: { fontSize: 11, fontWeight: "600", color: "#64748B" },
  subcityPillTextActive: { color: "#047857", fontWeight: "800" },
  listContent: { padding: 16, gap: 14 },
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  providerInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  providerName: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  verifiedBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedText: { color: "#047857", fontSize: 10, fontWeight: "800" },
  categorySubtext: { fontSize: 11, color: "#64748B", marginTop: 1 },
  subcityTag: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subcityTagText: { fontSize: 11, fontWeight: "700", color: "#475569" },
  listingTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginBottom: 2, letterSpacing: -0.2 },
  listingTitleAm: { fontSize: 13, color: "#64748B", marginBottom: 4 },
  specificAreaText: { fontSize: 11, color: "#047857", fontWeight: "700", marginBottom: 6 },
  listingDesc: { fontSize: 12, color: "#475569", lineHeight: 18, marginBottom: 12 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  starIcon: { color: "#F59E0B", fontSize: 15 },
  ratingNumber: { fontSize: 13, fontWeight: "800", color: "#0F172A" },
  reviewCountText: { fontSize: 11, color: "#64748B" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  priceContainer: {},
  priceLabel: { fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 3, marginTop: 1 },
  priceValue: { fontSize: 16, fontWeight: "900", color: "#047857" },
  priceCurrency: { fontSize: 11, fontWeight: "800", color: "#047857" },
  bookButton: {
    backgroundColor: "#047857",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  bookButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  centerContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  helperText: { marginTop: 12, fontSize: 13, color: "#64748B" },
  errorEmoji: { fontSize: 36, marginBottom: 8 },
  errorTitle: { fontSize: 16, fontWeight: "800", color: "#991B1B" },
  retryButton: {
    marginTop: 14,
    backgroundColor: "#047857",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
  emptyEmoji: { fontSize: 36, marginBottom: 6 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  emptySubtitle: { fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 4 },
  resetBtn: {
    marginTop: 14,
    backgroundColor: "#047857",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  resetBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});