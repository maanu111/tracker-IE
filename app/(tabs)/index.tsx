"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Platform,
  Animated,
  Easing,
  type ViewStyle,
  type StyleProp,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

const { width, height } = Dimensions.get("window");

// Calculate tab bar space to avoid overlap
const TAB_BAR_HEIGHT = 70;
const TAB_BAR_MARGIN_BOTTOM = Platform.OS === "ios" ? 34 : 20;
const TOTAL_TAB_BAR_SPACE = TAB_BAR_HEIGHT + TAB_BAR_MARGIN_BOTTOM + 10; // Extra 10px for breathing room

// Type definitions
interface AnimatedTouchableProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface SpendingItemProps {
  icon: keyof typeof Icon.glyphMap;
  name: string;
  date: string;
  amount: string;
  color: string;
  delay?: number;
}

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  type: "income" | "expense";
  onAdd: (type: string, amount: string) => void;
}

const AddModal = ({ visible, onClose, type, onAdd }: AddModalProps) => {
  const { colors } = useTheme();
  const [inputType, setInputType] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset input fields when modal opens
      setInputType("");
      setInputAmount("");

      // Animate modal in
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate modal out
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleAdd = () => {
    if (inputType.trim() && inputAmount.trim()) {
      onAdd(inputType.trim(), inputAmount.trim());
      onClose();
    }
  };

  const handleBackdropPress = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add {type === "income" ? "Income" : "Expense"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {type === "income" ? "Income Type" : "Expense Type"}
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                  },
                ]}
                placeholder={
                  type === "income"
                    ? "e.g., Salary, Freelance"
                    : "e.g., Food, Transport"
                }
                placeholderTextColor={colors.textSecondary}
                value={inputType}
                onChangeText={setInputType}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Amount
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                  },
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={inputAmount}
                onChangeText={setInputAmount}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor:
                  type === "income" ? colors.primary : colors.secondary,
                opacity: inputType.trim() && inputAmount.trim() ? 1 : 0.5,
              },
            ]}
            onPress={handleAdd}
            disabled={!inputType.trim() || !inputAmount.trim()}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>
              Add {type === "income" ? "Income" : "Expense"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function HomeScreen() {
  const { colors, actualTheme } = useTheme();
  const [totalIncome, setTotalIncome] = useState(5000);
  const [totalExpenses, setTotalExpenses] = useState(3200);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("income");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const balanceAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;

  const balance = totalIncome - totalExpenses;
  const progressPercentage = Math.min((balance / totalIncome) * 100, 100);

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(balanceAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(chartAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAddIncome = () => {
    setModalType("income");
    setModalVisible(true);
  };

  const handleAddExpense = () => {
    setModalType("expense");
    setModalVisible(true);
  };

  const handleAddTransaction = (type: string, amount: string) => {
    const numericAmount = Number.parseFloat(amount);
    if (isNaN(numericAmount)) return;

    if (modalType === "income") {
      setTotalIncome((prev) => prev + numericAmount);
    } else {
      setTotalExpenses((prev) => prev + numericAmount);
    }

    console.log(`Added ${modalType}: ${type} - $${amount}`);
  };

  const AnimatedTouchable = ({
    children,
    onPress,
    style,
  }: AnimatedTouchableProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const SpendingItem = ({
    icon,
    name,
    date,
    amount,
    color,
    delay = 0,
  }: SpendingItemProps) => {
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      Animated.timing(itemSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.spendingItem,
          {
            opacity: itemFadeAnim,
            transform: [{ translateX: itemSlideAnim }],
          },
        ]}
      >
        <View style={[styles.spendingIcon, { backgroundColor: color }]}>
          <Icon name={icon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.spendingDetails}>
          <Text style={[styles.spendingName, { color: colors.text }]}>
            {name}
          </Text>
          <Text style={[styles.spendingDate, { color: colors.textSecondary }]}>
            {date}
          </Text>
        </View>
        <Text style={[styles.spendingAmount, { color: colors.text }]}>
          {amount}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={actualTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={{
          paddingBottom: TOTAL_TAB_BAR_SPACE, // Add padding to prevent overlap
        }}
      >
        {/* Gradient Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <LinearGradient
            colors={colors.gradient}
            style={styles.gradientHeader}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Cravox</Text>
              {/* Balance Display */}
              <View style={styles.balanceSection}>
                <Animated.Text
                  style={[
                    styles.balanceAmount,
                    {
                      opacity: balanceAnim,
                      transform: [
                        {
                          scale: balanceAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  ${balance.toLocaleString()}
                </Animated.Text>
                <Text style={styles.balanceSubtext}>
                  Out of ${totalIncome.toLocaleString()}
                </Text>
                {/* Animated Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0%", `${progressPercentage}%`],
                            extrapolate: "clamp",
                          }),
                        },
                      ]}
                    />
                  </View>
                </View>
                {/* Quick Stats */}
                <View style={styles.quickStats}>
                  <AnimatedTouchable
                    style={styles.statItem}
                    onPress={() => console.log("Summary pressed")}
                  >
                    <Icon name="trending-up" size={16} color="#FFFFFF" />
                    <Text style={styles.statLabel}>Summary</Text>
                  </AnimatedTouchable>
                  <AnimatedTouchable
                    style={styles.statItem}
                    onPress={() => console.log("Scan Receipt pressed")}
                  >
                    <Icon name="receipt" size={16} color="#FFFFFF" />
                    <Text style={styles.statLabel}>Scan Receipt</Text>
                  </AnimatedTouchable>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* White Content Area */}
        <Animated.View
          style={[
            styles.contentArea,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: colors.background,
            },
          ]}
        >
          {/* Today's Summary */}
          <View style={styles.todaySection}>
            <AnimatedTouchable
              style={[styles.todayHeader, { backgroundColor: colors.surface }]}
              onPress={() => console.log("Today pressed")}
            >
              <Text style={[styles.todayTitle, { color: colors.text }]}>
                Today
              </Text>
              <Text style={[styles.todayAmount, { color: colors.error }]}>
                -${(totalExpenses * 0.1).toFixed(0)}
              </Text>
            </AnimatedTouchable>
          </View>

          {/* Chart Section */}
          <Animated.View
            style={[
              styles.chartContainer,
              {
                opacity: chartAnim,
                backgroundColor: colors.card,
                transform: [
                  {
                    scale: chartAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Overview
            </Text>
            <PieChart
              data={[
                {
                  name: "Income",
                  amount: totalIncome,
                  color: colors.primary,
                  legendFontColor: colors.primary,
                  legendFontSize: 12,
                },
                {
                  name: "Expenses",
                  amount: totalExpenses,
                  color: colors.secondary,
                  legendFontColor: colors.secondary,
                  legendFontSize: 12,
                },
              ]}
              width={width - 60}
              height={140}
              chartConfig={{
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                strokeWidth: 2,
                barPercentage: 0.5,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              center={[5, 5]}
              absolute
            />
          </Animated.View>

          {/* Spending List */}
          <View style={styles.spendingSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Spending
            </Text>
            <SpendingItem
              icon="movie"
              name="Netflix Inc."
              date="Dec 10 • 22:05"
              amount="-$15.99"
              color="#E53E3E"
              delay={200}
            />
            <SpendingItem
              icon="local-grocery-store"
              name="Groceries"
              date="Dec 09 • 15:30"
              amount="-$85.20"
              color="#16A34A"
              delay={400}
            />
            <SpendingItem
              icon="phone"
              name="AT&T"
              date="Dec 08 • 09:15"
              amount="-$65.00"
              color="#2563EB"
              delay={600}
            />
            <SpendingItem
              icon="more-horiz"
              name="Other"
              date="Dec 07 • 14:22"
              amount="-$42.50"
              color="#6B7280"
              delay={800}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <AnimatedTouchable
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleAddIncome}
            >
              <Icon name="add" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Income</Text>
            </AnimatedTouchable>
            <AnimatedTouchable
              style={[
                styles.actionButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={handleAddExpense}
            >
              <Icon name="remove" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Expense</Text>
            </AnimatedTouchable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Add Modal */}
      <AddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        onAdd={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 40,
    color: "slateblue",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
  },
  balanceSection: {
    alignItems: "center",
    paddingTop: 16,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
    letterSpacing: -1,
  },
  balanceSubtext: {
    fontSize: 12,
    color: "#A5B4FC",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FCD34D",
    borderRadius: 3,
    shadowColor: "#FCD34D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 80,
    shadowColor: "rgba(255, 255, 255, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#FFFFFF",
    marginTop: 4,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  todaySection: {
    marginBottom: 20,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  todayTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
  },
  todayAmount: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
  },
  chartContainer: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
  },
  spendingSection: {
    marginBottom: 20,
  },
  spendingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  spendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spendingDetails: {
    flex: 1,
  },
  spendingName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
  },
  spendingDate: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
  spendingAmount: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  actionButton: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    paddingHorizontal: 20,
    minHeight: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Inter",
      default: "System",
    }),
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 12,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Inter",
      default: "System",
    }),
  },
});
