"use client";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { ThemeToggle } from "../../components/ThemeToggle";

interface SettingItemProps {
  icon: keyof typeof Icon.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
}: SettingItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.primary }]}>
        <Icon name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.settingSubtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && (
        <Icon name="chevron-right" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function TabTwoScreen() {
  const { colors, actualTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={actualTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={colors.gradient} style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Account Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              ACCOUNT
            </Text>
            <SettingItem
              icon="person"
              title="Profile"
              subtitle="Manage your profile information"
              onPress={() => console.log("Profile pressed")}
            />
            <SettingItem
              icon="security"
              title="Privacy & Security"
              subtitle="Control your privacy settings"
              onPress={() => console.log("Privacy pressed")}
            />
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => console.log("Notifications pressed")}
            />
          </View>

          {/* App Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              APP
            </Text>
            <SettingItem
              icon="language"
              title="Language"
              subtitle="English"
              onPress={() => console.log("Language pressed")}
            />
            <SettingItem
              icon="currency-exchange"
              title="Currency"
              subtitle="USD ($)"
              onPress={() => console.log("Currency pressed")}
            />
            <SettingItem
              icon="backup"
              title="Backup & Sync"
              subtitle="Keep your data safe"
              onPress={() => console.log("Backup pressed")}
            />
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              SUPPORT
            </Text>
            <SettingItem
              icon="help"
              title="Help & Support"
              subtitle="Get help when you need it"
              onPress={() => console.log("Help pressed")}
            />
            <SettingItem
              icon="feedback"
              title="Send Feedback"
              subtitle="Help us improve the app"
              onPress={() => console.log("Feedback pressed")}
            />
            <SettingItem
              icon="info"
              title="About"
              subtitle="Version 1.0.0"
              onPress={() => console.log("About pressed")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerTitle: {
    fontSize: 32, // ↓ from 32
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    paddingTop: 20,
  },
  headerSubtitle: {
    fontSize: 12, // ↓ from 16
    color: "#A5B4FC",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 10, // ↓ from 12
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13, // ↓ from 16
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 11, // ↓ from 14
  },
});
