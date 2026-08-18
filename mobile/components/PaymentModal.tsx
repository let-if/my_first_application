
// import React, { useEffect } from "react";
// import {
//   StyleSheet,
//   View,
//   Modal,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import { WebView } from "react-native-webview";

// interface PaymentModalProps {
//   visible: boolean;
//   checkoutUrl: string | null;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export const PaymentModal: React.FC<PaymentModalProps> = ({
//   visible,
//   checkoutUrl,
//   onClose,
//   onSuccess,
// }) => {
//   useEffect(() => {
//     if (visible && checkoutUrl && Platform.OS === "web") {
//       const paymentWindow = window.open(checkoutUrl, "_blank", "width=500,height=700");

//       const timer = setInterval(() => {
//         if (paymentWindow?.closed) {
//           clearInterval(timer);
//           onSuccess();
//           onClose();
//         }
//       }, 1500);

//       return () => clearInterval(timer);
//     }
//   }, [visible, checkoutUrl]);

//   if (!visible || !checkoutUrl) return null;

//   if (Platform.OS === "web") {
//     return (
//       <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//         <View style={styles.webModalOverlay}>
//           <View style={styles.webModalCard}>
//             <View style={styles.iconCircle}>
//               <Text style={{ fontSize: 28 }}>💳</Text>
//             </View>
//             <Text style={styles.headerTitle}>Chapa Checkout Active</Text>
//             <Text style={styles.webDesc}>
//               A secure Chapa payment window has opened. Complete the test payment via Telebirr, CBE Birr, or Test Card.
//             </Text>

//             <TouchableOpacity
//               style={styles.openTabBtn}
//               onPress={() => window.open(checkoutUrl, "_blank")}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.openTabBtnText}>Re-open Payment Window ↗</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.doneBtn}
//               onPress={() => {
//                 onSuccess();
//                 onClose();
//               }}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.doneBtnText}>I Have Completed Payment</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
//               <Text style={styles.cancelBtnText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     );
//   }

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.headerTitle}>Chapa Secure Checkout</Text>
//             <Text style={styles.headerSub}>Telebirr • CBE Birr • Cards</Text>
//           </View>
//           <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
//             <Text style={styles.closeText}>✕ Close</Text>
//           </TouchableOpacity>
//         </View>

//         <WebView
//           source={{ uri: checkoutUrl }}
//           onNavigationStateChange={(navState) => {
//             if (navState.url.includes("payment=success")) {
//               onSuccess();
//               onClose();
//             } else if (navState.url.includes("payment=failed")) {
//               onClose();
//             }
//           }}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <View style={styles.loader}>
//               <ActivityIndicator size="large" color="#047857" />
//               <Text style={styles.loadingText}>Loading Chapa checkout...</Text>
//             </View>
//           )}
//         />
//       </View>
//     </Modal>
//   );
// };

// export default PaymentModal;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFFFFF" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//     backgroundColor: "#F9FAFB",
//   },
//   headerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
//   headerSub: { fontSize: 11, color: "#047857", fontWeight: "600", marginTop: 1 },
//   closeBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     backgroundColor: "#FEE2E2",
//   },
//   closeText: { fontSize: 12, fontWeight: "700", color: "#DC2626" },
//   webModalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   webModalCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 24,
//     width: "100%",
//     maxWidth: 400,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//   },
//   iconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   webDesc: {
//     fontSize: 13,
//     color: "#4B5563",
//     textAlign: "center",
//     marginTop: 6,
//     marginBottom: 18,
//     lineHeight: 18,
//   },
//   openTabBtn: {
//     backgroundColor: "#047857",
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   openTabBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
//   doneBtn: {
//     backgroundColor: "#ECFDF5",
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#A7F3D0",
//     marginBottom: 10,
//   },
//   doneBtnText: { color: "#047857", fontWeight: "700", fontSize: 13 },
//   cancelBtn: { paddingVertical: 6 },
//   cancelBtnText: { color: "#6B7280", fontSize: 12, fontWeight: "600" },
//   loader: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//   },
//   loadingText: { marginTop: 10, fontSize: 12, color: "#6B7280", fontWeight: "600" },
// });
// components/PaymentModal.tsx
import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

interface PaymentModalProps {
  visible: boolean;
  checkoutUrl: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  checkoutUrl,
  onClose,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible && checkoutUrl && Platform.OS === "web") {
      const paymentWindow = window.open(checkoutUrl, "_blank", "width=500,height=700");

      const timer = setInterval(() => {
        if (paymentWindow?.closed) {
          clearInterval(timer);
          onSuccess();
          onClose();
        }
      }, 1500);

      return () => clearInterval(timer);
    }
  }, [visible, checkoutUrl]);

  if (!visible || !checkoutUrl) return null;

  if (Platform.OS === "web") {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.webModalOverlay}>
          <View style={styles.webModalCard}>
            <View style={styles.iconCircle}>
              <Text style={{ fontSize: 28 }}>💳</Text>
            </View>
            <Text style={styles.headerTitle}>Chapa Secure Checkout</Text>
            <Text style={styles.webDesc}>
              A secure Chapa payment window has opened. Complete your test payment via Telebirr, CBE Birr, or Card.
            </Text>

            <TouchableOpacity
              style={styles.openTabBtn}
              onPress={() => window.open(checkoutUrl, "_blank")}
              activeOpacity={0.85}
            >
              <Text style={styles.openTabBtnText}>Re-open Payment Window ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => {
                onSuccess();
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>I Have Completed Payment ✓</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Native WebView Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
          <View>
            <Text style={styles.headerTitle}>Chapa Secure Gateway</Text>
            <Text style={styles.headerSub}>Telebirr • CBE Birr • Cards</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.75}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
        </View>

        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes("payment=success")) {
              onSuccess();
              onClose();
            } else if (navState.url.includes("payment=failed")) {
              onClose();
            }
          }}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#047857" />
              <Text style={styles.loadingText}>Loading Chapa checkout...</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    color: "#047857",
    fontWeight: "700",
    marginTop: 1,
  },
  closeBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  closeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#DC2626",
  },
  webModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  webDesc: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 19,
    fontWeight: "500",
  },
  openTabBtn: {
    backgroundColor: "#047857",
    width: "100%",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  openTabBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  doneBtn: {
    backgroundColor: "#ECFDF5",
    width: "100%",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#6EE7B7",
    marginBottom: 12,
  },
  doneBtnText: {
    color: "#047857",
    fontWeight: "800",
    fontSize: 13,
  },
  cancelBtn: {
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
});