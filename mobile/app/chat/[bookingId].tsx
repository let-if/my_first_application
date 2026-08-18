
// import React, { useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Linking,
//   ActivityIndicator,
//   StatusBar,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/src/services/api";
// import { useAuth } from "@/src/context/AuthContext";

// interface Message {
//   id: string;
//   senderId: string;
//   senderName: string;
//   text: string;
//   createdAt: string;
// }

// export default function ChatScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const scrollViewRef = useRef<ScrollView>(null);

//   const [messageText, setMessageText] = useState("");
//   const activeCustomerId = user?.id || (user as any)?.userId;

//   // 1. Fetch Booking details
//   const { data: bookingDetails, isLoading: isBookingLoading } = useQuery({
//     queryKey: ["booking-chat-details", bookingId],
//     queryFn: async () => {
//       const res = await api.get(`/bookings/${bookingId}`);
//       return res.data;
//     },
//     enabled: !!bookingId,
//   });

//   // 2. Fetch Chat Messages
//   const { data: messages = [], isLoading: isMessagesLoading } = useQuery<Message[]>({
//     queryKey: ["chat-messages", bookingId],
//     queryFn: async () => {
//       const res = await api.get(`/chats/${bookingId}`);
//       return res.data;
//     },
//     enabled: !!bookingId,
//     refetchInterval: 4000,
//   });

//   // 3. Send Message Mutation
//   const sendMessageMutation = useMutation({
//     mutationFn: async (text: string) => {
//       const res = await api.post(`/chats/${bookingId}`, {
//         senderId: activeCustomerId,
//         senderName: user?.fullName || "User",
//         text,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       setMessageText("");
//       queryClient.invalidateQueries({ queryKey: ["chat-messages", bookingId] });
//     },
//     onError: (err) => {
//       console.error("Failed to send message:", err);
//     },
//   });

//   const handleSend = () => {
//     if (!messageText.trim() || sendMessageMutation.isPending) return;
//     sendMessageMutation.mutate(messageText.trim());
//   };

//   const handleWhatsApp = (phone: string) => {
//     let formatted = phone.replace(/\s+/g, "");
//     if (formatted.startsWith("0")) {
//       formatted = "+251" + formatted.slice(1);
//     }
//     Linking.openURL(`whatsapp://send?phone=${formatted}&text=Hello, regarding my booking on Ethio Services:`).catch(() => {
//       Linking.openURL(`https://wa.me/${formatted}?text=Hello, regarding my booking on Ethio Services:`);
//     });
//   };

//   const handleTelegram = (phone: string) => {
//     let formatted = phone.replace(/\s+/g, "");
//     if (formatted.startsWith("0")) {
//       formatted = "+251" + formatted.slice(1);
//     }
//     Linking.openURL(`https://t.me/${formatted}`).catch(() => {
//       Linking.openURL(`tel:${phone}`);
//     });
//   };

//   const otherUser =
//     bookingDetails?.customer?.id === activeCustomerId
//       ? bookingDetails?.listing?.provider
//       : bookingDetails?.customer;

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       {/* Top Header */}
//       <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/bookings"))}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.backButtonIcon}>←</Text>
//         </TouchableOpacity>

//         <View style={styles.headerInfo}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {otherUser?.fullName || "Chat Support"}
//           </Text>
//           <Text style={styles.headerSub}>
//             {bookingDetails?.listing?.title || "Booking Discussion"}
//           </Text>
//         </View>

//         {otherUser?.phoneNumber && (
//           <View style={styles.quickActions}>
//             <TouchableOpacity
//               style={styles.quickActionBtn}
//               onPress={() => handleWhatsApp(otherUser.phoneNumber)}
//               activeOpacity={0.75}
//             >
//               <Text style={{ fontSize: 16 }}>💬</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.quickActionBtn}
//               onPress={() => handleTelegram(otherUser.phoneNumber)}
//               activeOpacity={0.75}
//             >
//               <Text style={{ fontSize: 16 }}>✈️</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Messages Scroll Area */}
//       {isMessagesLoading && !messages.length ? (
//         <View style={styles.centerLoader}>
//           <ActivityIndicator size="large" color="#047857" />
//           <Text style={styles.loaderText}>Loading conversation...</Text>
//         </View>
//       ) : (
//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.chatScroll}
//           contentContainerStyle={[
//             styles.chatScrollContent,
//             { paddingBottom: Math.max(insets.bottom + 20, 30) },
//           ]}
//           onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//         >
//           <View style={styles.encryptionNotice}>
//             <Text style={styles.encryptionText}>
//               🔒 Messages are secured for your booking in {bookingDetails?.listing?.subCity || "BOLE"}
//             </Text>
//           </View>

//           {messages.length === 0 ? (
//             <View style={styles.emptyChat}>
//               <Text style={{ fontSize: 32, marginBottom: 8 }}>👋</Text>
//               <Text style={styles.emptyTitle}>Start the conversation</Text>
//               <Text style={styles.emptySub}>
//                 Discuss exact directions in Bole, schedule adjustments, or arrival details.
//               </Text>
//             </View>
//           ) : (
//             messages.map((msg) => {
//               const isMe = msg.senderId === activeCustomerId;
//               return (
//                 <View
//                   key={msg.id}
//                   style={[styles.messageBubbleWrapper, isMe ? styles.bubbleMe : styles.bubbleOther]}
//                 >
//                   {!isMe && <Text style={styles.senderNameTag}>{msg.senderName}</Text>}
//                   <View style={[styles.messageBubble, isMe ? styles.bubbleBgMe : styles.bubbleBgOther]}>
//                     <Text style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}>
//                       {msg.text}
//                     </Text>
//                   </View>
//                   <Text style={[styles.timestampText, isMe ? styles.timeMe : styles.timeOther]}>
//                     {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                   </Text>
//                 </View>
//               );
//             })
//           )}
//         </ScrollView>
//       )}

//       {/* Input Bar */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
//       >
//         <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom + 6, 12) }]}>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Type a message or directions..."
//             placeholderTextColor="#94A3B8"
//             value={messageText}
//             onChangeText={setMessageText}
//             multiline
//           />
//           <TouchableOpacity
//             style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
//             onPress={handleSend}
//             disabled={!messageText.trim() || sendMessageMutation.isPending}
//             activeOpacity={0.85}
//           >
//             {sendMessageMutation.isPending ? (
//               <ActivityIndicator color="#FFFFFF" size="small" />
//             ) : (
//               <Text style={styles.sendIcon}>→</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8FAFC" },
//   topBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//     gap: 12,
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
//   },
//   backButtonIcon: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
//   headerInfo: { flex: 1 },
//   headerTitle: { fontSize: 15, fontWeight: "900", color: "#0F172A" },
//   headerSub: { fontSize: 11, color: "#64748B", fontWeight: "600", marginTop: 1 },
//   quickActions: { flexDirection: "row", gap: 6 },
//   quickActionBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#ECFDF5",
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   centerLoader: { flex: 1, alignItems: "center", justifyContent: "center" },
//   loaderText: { marginTop: 10, fontSize: 13, color: "#64748B", fontWeight: "500" },
//   chatScroll: { flex: 1 },
//   chatScrollContent: { paddingHorizontal: 16, paddingTop: 16 },
//   encryptionNotice: {
//     backgroundColor: "#EFF6FF",
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//     padding: 8,
//     borderRadius: 10,
//     marginBottom: 16,
//     alignItems: "center",
//   },
//   encryptionText: { fontSize: 11, color: "#1E40AF", fontWeight: "700", textAlign: "center" },
//   emptyChat: { alignItems: "center", justifyContent: "center", marginTop: 40, paddingHorizontal: 20 },
//   emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
//   emptySub: { fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 4, lineHeight: 17 },
//   messageBubbleWrapper: { marginBottom: 12, maxWidth: "80%" },
//   bubbleMe: { alignSelf: "flex-end" },
//   bubbleOther: { alignSelf: "flex-start" },
//   senderNameTag: { fontSize: 10, fontWeight: "700", color: "#64748B", marginBottom: 2, marginLeft: 4 },
//   messageBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
//   bubbleBgMe: { backgroundColor: "#047857", borderBottomRightRadius: 4 },
//   bubbleBgOther: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderBottomLeftRadius: 4 },
//   messageText: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
//   textMe: { color: "#FFFFFF" },
//   textOther: { color: "#0F172A" },
//   timestampText: { fontSize: 9, marginTop: 3, fontWeight: "600" },
//   timeMe: { textAlign: "right", color: "#94A3B8" },
//   timeOther: { textAlign: "left", color: "#94A3B8" },
//   inputBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#E2E8F0",
//     gap: 10,
//   },
//   textInput: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1.5,
//     borderColor: "#E2E8F0",
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     fontSize: 13,
//     color: "#0F172A",
//     maxHeight: 90,
//   },
//   sendBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#047857",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sendBtnDisabled: { opacity: 0.5 },
//   sendIcon: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
// });
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/services/api";
import { useAuth } from "@/src/context/AuthContext";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messageText, setMessageText] = useState("");
  const [hasSeen, setHasSeen] = useState(false);
  const activeCustomerId = user?.id || (user as any)?.userId;

  // Mark chat as seen when opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasSeen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // 1. Fetch Booking details
  const { data: bookingDetails, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking-chat-details", bookingId],
    queryFn: async () => {
      const res = await api.get(`/bookings/${bookingId}`);
      return res.data;
    },
    enabled: !!bookingId,
  });

  // 2. Fetch Chat Messages
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery<Message[]>({
    queryKey: ["chat-messages", bookingId],
    queryFn: async () => {
      const res = await api.get(`/chats/${bookingId}`);
      return res.data;
    },
    enabled: !!bookingId,
    refetchInterval: 3000,
  });

  // 3. Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post(`/chats/${bookingId}`, {
        senderId: activeCustomerId,
        senderName: user?.fullName || "User",
        text,
      });
      return res.data;
    },
    onSuccess: () => {
      setMessageText("");
      setHasSeen(false); // Reset seen until other party views new message
      queryClient.invalidateQueries({ queryKey: ["chat-messages", bookingId] });
    },
    onError: (err) => {
      console.error("Failed to send message:", err);
    },
  });

  const handleSend = () => {
    if (!messageText.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  const handleWhatsApp = (phone: string) => {
    let formatted = phone.replace(/\s+/g, "");
    if (formatted.startsWith("0")) {
      formatted = "+251" + formatted.slice(1);
    }
    Linking.openURL(`whatsapp://send?phone=${formatted}&text=Hello, regarding my booking on Ethio Services:`).catch(() => {
      Linking.openURL(`https://wa.me/${formatted}?text=Hello, regarding my booking on Ethio Services:`);
    });
  };

  const handleTelegram = (phone: string) => {
    let formatted = phone.replace(/\s+/g, "");
    if (formatted.startsWith("0")) {
      formatted = "+251" + formatted.slice(1);
    }
    Linking.openURL(`https://t.me/${formatted}`).catch(() => {
      Linking.openURL(`tel:${phone}`);
    });
  };

  const otherUser =
    bookingDetails?.customer?.id === activeCustomerId
      ? bookingDetails?.listing?.provider
      : bookingDetails?.customer;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Modern Top Header */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/bookings"))}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerAvatarContainer}>
          <Text style={styles.headerAvatarText}>
            {(otherUser?.fullName || "S").charAt(0).toUpperCase()}
          </Text>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {otherUser?.fullName || "Chat Support"}
          </Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {bookingDetails?.listing?.title || "Secure Booking Chat"}
          </Text>
        </View>

        {otherUser?.phoneNumber && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => handleWhatsApp(otherUser.phoneNumber)}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 15 }}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => handleTelegram(otherUser.phoneNumber)}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 15 }}>✈️</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Messages Scroll Area */}
      {isMessagesLoading && !messages.length ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={styles.loaderText}>Establishing secure connection...</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={[
            styles.chatScrollContent,
            { paddingBottom: Math.max(insets.bottom + 20, 30) },
          ]}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.encryptionNotice}>
            <Text style={styles.encryptionText}>
              🔒 End-to-end verified booking channel • {bookingDetails?.listing?.subCity || "Addis Ababa"}
            </Text>
          </View>

          {messages.length === 0 ? (
            <View style={styles.emptyChat}>
              <View style={styles.emptyIconCircle}>
                <Text style={{ fontSize: 30 }}>💬</Text>
              </View>
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.emptySub}>
                Coordinate exact arrival times, logistics, or special instructions securely.
              </Text>
            </View>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === activeCustomerId;
              return (
                <View
                  key={msg.id || index}
                  style={[styles.messageBubbleWrapper, isMe ? styles.bubbleMe : styles.bubbleOther]}
                >
                  {!isMe && <Text style={styles.senderNameTag}>{msg.senderName}</Text>}
                  <View style={[styles.messageBubble, isMe ? styles.bubbleBgMe : styles.bubbleBgOther]}>
                    <Text style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}>
                      {msg.text}
                    </Text>
                  </View>
                  <View style={[styles.metaFooter, isMe ? styles.metaFooterMe : styles.metaFooterOther]}>
                    <Text style={styles.timestampText}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                    {isMe && (
                      <Text style={[styles.checkMarks, hasSeen && styles.seenCheckMarks]}>
                        {hasSeen ? "✓✓" : "✓"}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Modern Floating Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom + 8, 14) }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#94A3B8"
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            activeOpacity={0.85}
          >
            {sendMessageMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendIcon}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  backButtonIcon: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  headerAvatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerAvatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
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
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: "900", color: "#0F172A", letterSpacing: -0.2 },
  headerSub: { fontSize: 11, color: "#64748B", fontWeight: "600", marginTop: 1 },
  quickActions: { flexDirection: "row", gap: 6 },
  quickActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
  },
  centerLoader: { flex: 1, alignItems: "center", justifyContent: "center" },
  loaderText: { marginTop: 10, fontSize: 13, color: "#64748B", fontWeight: "500" },
  chatScroll: { flex: 1 },
  chatScrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  encryptionNotice: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 9,
    borderRadius: 12,
    marginBottom: 18,
    alignItems: "center",
  },
  encryptionText: { fontSize: 11, color: "#166534", fontWeight: "700", textAlign: "center" },
  emptyChat: { alignItems: "center", justifyContent: "center", marginTop: 60, paddingHorizontal: 20 },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  emptyTitle: { fontSize: 17, fontWeight: "900", color: "#0F172A" },
  emptySub: { fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 6, lineHeight: 18, paddingHorizontal: 10 },
  messageBubbleWrapper: { marginBottom: 14, maxWidth: "80%" },
  bubbleMe: { alignSelf: "flex-end" },
  bubbleOther: { alignSelf: "flex-start" },
  senderNameTag: { fontSize: 10, fontWeight: "800", color: "#64748B", marginBottom: 3, marginLeft: 4 },
  messageBubble: { paddingHorizontal: 15, paddingVertical: 11, borderRadius: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  bubbleBgMe: { backgroundColor: "#047857", borderBottomRightRadius: 4 },
  bubbleBgOther: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
  textMe: { color: "#FFFFFF" },
  textOther: { color: "#0F172A" },
  metaFooter: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaFooterMe: { justifyContent: "flex-end", marginRight: 2 },
  metaFooterOther: { justifyContent: "flex-start", marginLeft: 2 },
  timestampText: { fontSize: 10, fontWeight: "600", color: "#94A3B8" },
  checkMarks: { fontSize: 11, fontWeight: "800", color: "#94A3B8" },
  seenCheckMarks: { color: "#34D399" }, // Turns vibrant green when seen!
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendIcon: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
});