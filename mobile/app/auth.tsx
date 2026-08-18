
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useAuth } from "@/src/context/AuthContext";
// import { normalizeEthiopianPhone } from "@/src/utils/phone";

// export default function AuthScreen() {
//   const router = useRouter();
//   const { login, register } = useAuth();

//   const [isLogin, setIsLogin] = useState(true);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async () => {
//     setErrorMessage("");

//     const normalized = normalizeEthiopianPhone(phoneNumber);
//     if (!normalized) {
//       setErrorMessage("Please enter a valid Ethiopian phone number (e.g. 0912345678 or 0712345678)");
//       return;
//     }

//     if (password.length < 6) {
//       setErrorMessage("Password must be at least 6 characters long.");
//       return;
//     }

//     if (!isLogin && !fullName.trim()) {
//       setErrorMessage("Please enter your full name.");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (isLogin) {
//         await login(normalized, password);
//       } else {
//         await register(normalized, fullName.trim(), password, role);
//       }
//       router.replace("/(tabs)");
//     } catch (err: any) {
//       const msg = err.response?.data?.error || "Authentication failed. Check your credentials.";
//       setErrorMessage(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Back / Close button */}
//         <TouchableOpacity
//           style={styles.closeButton}
//           onPress={() => router.back()}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.closeButtonText}>✕</Text>
//         </TouchableOpacity>

//         {/* Brand Header */}
//         <View style={styles.brandHeader}>
//           <View style={styles.logoBadge}>
//             <Text style={styles.logoBadgeText}>🇪🇹</Text>
//           </View>
//           <Text style={styles.title}>
//             {isLogin ? "Welcome Back" : "Create Account"}
//           </Text>
//           <Text style={styles.subtitle}>
//             {isLogin
//               ? "Sign in with your Ethiopian mobile number"
//               : "Connect with verified local services in Addis"}
//           </Text>
//         </View>

//         {/* Tab Switcher */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tab, isLogin && styles.tabActive]}
//             onPress={() => {
//               setIsLogin(true);
//               setErrorMessage("");
//             }}
//           >
//             <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
//               Login
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, !isLogin && styles.tabActive]}
//             onPress={() => {
//               setIsLogin(false);
//               setErrorMessage("");
//             }}
//           >
//             <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
//               Sign Up
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Error Notification */}
//         {errorMessage ? (
//           <View style={styles.errorBox}>
//             <Text style={styles.errorBoxText}>⚠️ {errorMessage}</Text>
//           </View>
//         ) : null}

//         {/* Form Fields */}
//         <View style={styles.form}>
//           {!isLogin && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Full Name (ሙሉ ስም)</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. Abebe Kebede"
//                 placeholderTextColor="#9CA3AF"
//                 value={fullName}
//                 onChangeText={setFullName}
//                 autoCapitalize="words"
//               />
//             </View>
//           )}

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Phone Number (ስልክ ቁጥር)</Text>
//             <View style={styles.phoneInputRow}>
//               <View style={styles.countryCodeBadge}>
//                 <Text style={styles.countryCodeText}>+251</Text>
//               </View>
//               <TextInput
//                 style={[styles.input, styles.phoneInput]}
//                 placeholder="912 345 678 or 07..."
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="phone-pad"
//                 value={phoneNumber}
//                 onChangeText={setPhoneNumber}
//                 autoCapitalize="none"
//               />
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Password (የይለፍ ቃል)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="••••••••"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           {!isLogin && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>I want to join as</Text>
//               <View style={styles.roleRow}>
//                 <TouchableOpacity
//                   style={[
//                     styles.roleCard,
//                     role === "CUSTOMER" && styles.roleCardActive,
//                   ]}
//                   onPress={() => setRole("CUSTOMER")}
//                 >
//                   <Text style={styles.roleEmoji}>👤</Text>
//                   <Text
//                     style={[
//                       styles.roleText,
//                       role === "CUSTOMER" && styles.roleTextActive,
//                     ]}
//                   >
//                     Customer
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.roleCard,
//                     role === "PROVIDER" && styles.roleCardActive,
//                   ]}
//                   onPress={() => setRole("PROVIDER")}
//                 >
//                   <Text style={styles.roleEmoji}>🛠️</Text>
//                   <Text
//                     style={[
//                       styles.roleText,
//                       role === "PROVIDER" && styles.roleTextActive,
//                     ]}
//                   >
//                     Service Provider
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[styles.submitButton, loading && styles.submitButtonDisabled]}
//             onPress={handleSubmit}
//             disabled={loading}
//             activeOpacity={0.8}
//           >
//             {loading ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 {isLogin ? "Sign In" : "Create Account"}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 40,
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: "#4B5563",
//     fontWeight: "700",
//   },
//   brandHeader: {
//     alignItems: "center",
//     marginTop: 8,
//     marginBottom: 20,
//   },
//   logoBadge: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#ECFDF5",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   logoBadgeText: {
//     fontSize: 28,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#111827",
//   },
//   subtitle: {
//     fontSize: 13,
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 4,
//     paddingHorizontal: 20,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 16,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   tabActive: {
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#6B7280",
//   },
//   tabTextActive: {
//     color: "#047857",
//     fontWeight: "700",
//   },
//   errorBox: {
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#F87171",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 14,
//   },
//   errorBoxText: {
//     color: "#B91C1C",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   form: {
//     gap: 14,
//   },
//   inputGroup: {
//     gap: 6,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#374151",
//   },
//   input: {
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: "#111827",
//   },
//   phoneInputRow: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   countryCodeBadge: {
//     backgroundColor: "#F3F4F6",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   countryCodeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#374151",
//   },
//   phoneInput: {
//     flex: 1,
//   },
//   roleRow: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   roleCard: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1.5,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: "center",
//     gap: 4,
//   },
//   roleCardActive: {
//     borderColor: "#047857",
//     backgroundColor: "#ECFDF5",
//   },
//   roleEmoji: {
//     fontSize: 20,
//   },
//   roleText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#4B5563",
//   },
//   roleTextActive: {
//     color: "#047857",
//     fontWeight: "700",
//   },
//   submitButton: {
//     backgroundColor: "#047857",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     marginTop: 8,
//     shadowColor: "#047857",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   submitButtonDisabled: {
//     opacity: 0.7,
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
// });
// mobile/app/auth.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/context/AuthContext";
import { normalizeEthiopianPhone } from "@/src/utils/phone";

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setErrorMessage("");

    const normalized = normalizeEthiopianPhone(phoneNumber);
    if (!normalized) {
      setErrorMessage("Please enter a valid Ethiopian phone number (e.g. 0912345678 or 0712345678)");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(normalized, password);
      } else {
        await register(normalized, fullName.trim(), password, role);
      }
      router.replace("/(tabs)");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Authentication failed. Check your credentials.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Background Ambient Glow Accents */}
      <View style={styles.ambientGlowTop} pointerEvents="none" />
      <View style={styles.ambientGlowRight} pointerEvents="none" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 12, 24),
              paddingBottom: Math.max(insets.bottom + 24, 36),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Perfectly centered constraining card */}
          <View style={styles.cardContainer}>
            {/* Top Navigation Row */}
            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
                activeOpacity={0.75}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              <View style={styles.topBadgeContainer}>
                <View style={styles.liveDot} />
                <Text style={styles.topBadgeText}>Addis Ababa • አዲስ አበባ</Text>
              </View>
            </View>

            {/* Brand Hero Header */}
            <View style={styles.brandHeader}>
              <View style={styles.logoBadgeContainer}>
                <Text style={styles.logoBadgeText}>🇪🇹</Text>
              </View>

              <Text style={styles.title}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin
                  ? "Sign in with your Ethiopian mobile number"
                  : "Connect with verified local services in Addis"}
              </Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => {
                  setIsLogin(true);
                  setErrorMessage("");
                }}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => {
                  setIsLogin(false);
                  setErrorMessage("");
                }}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Notification */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorBoxText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Full Name <Text style={styles.labelAmharic}>(ሙሉ ስም)</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "fullName" && styles.inputContainerFocused,
                    ]}
                  >
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Abebe Kebede"
                      placeholderTextColor="#94A3B8"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                      onFocus={() => setFocusedInput("fullName")}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>
              )}

              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.labelAmharic}>(ስልክ ቁጥር)</Text>
                </Text>
                <View
                  style={[
                    styles.phoneInputContainer,
                    focusedInput === "phone" && styles.inputContainerFocused,
                  ]}
                >
                  <View style={styles.countryCodeBadge}>
                    <Text style={{ fontSize: 13 }}>🇪🇹</Text>
                    <Text style={styles.countryCodeText}>+251</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="912 345 678 or 07..."
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput("phone")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Password <Text style={styles.labelAmharic}>(የይለፍ ቃል)</Text>
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === "password" && styles.inputContainerFocused,
                  ]}
                >
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Role Selection on Sign Up */}
              {!isLogin && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>I want to join as:</Text>
                  <View style={styles.roleRow}>
                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        role === "CUSTOMER" && styles.roleCardActive,
                      ]}
                      onPress={() => setRole("CUSTOMER")}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.roleEmoji}>👤</Text>
                      <Text
                        style={[
                          styles.roleText,
                          role === "CUSTOMER" && styles.roleTextActive,
                        ]}
                      >
                        Customer
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        role === "PROVIDER" && styles.roleCardActive,
                      ]}
                      onPress={() => setRole("PROVIDER")}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.roleEmoji}>🛠️</Text>
                      <Text
                        style={[
                          styles.roleText,
                          role === "PROVIDER" && styles.roleTextActive,
                        ]}
                      >
                        Provider
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.submitBtnContent}>
                    <Text style={styles.submitButtonText}>
                      {isLogin ? "Sign In" : "Create Account"}
                    </Text>
                    <Text style={styles.submitButtonArrow}>→</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    position: "relative",
  },
  ambientGlowTop: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  ambientGlowRight: {
    position: "absolute",
    bottom: 40,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(4, 120, 87, 0.08)",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  topBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
    marginRight: 5,
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#065F46",
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoBadgeContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    borderWidth: 1.5,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  logoBadgeText: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: 10,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#047857",
    fontWeight: "900",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorIcon: {
    fontSize: 14,
  },
  errorBoxText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  labelAmharic: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: "#059669",
    backgroundColor: "#FFFFFF",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "600",
  },
  eyeBtn: {
    padding: 6,
  },
  eyeText: {
    fontSize: 15,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    height: 48,
    paddingRight: 10,
    overflow: "hidden",
  },
  countryCodeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    height: "100%",
    borderRightWidth: 1.5,
    borderRightColor: "#E2E8F0",
    gap: 5,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#047857",
  },
  phoneInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
    paddingHorizontal: 10,
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
  },
  roleCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 2,
  },
  roleCardActive: {
    borderColor: "#059669",
    backgroundColor: "#ECFDF5",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  roleEmoji: {
    fontSize: 18,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  roleTextActive: {
    color: "#047857",
    fontWeight: "900",
  },
  submitButton: {
    backgroundColor: "#047857",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  submitButtonArrow: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});