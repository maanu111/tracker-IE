"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useTheme, type Theme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme, colors } = useTheme();

  const themeOptions: {
    value: Theme;
    label: string;
    icon: keyof typeof Icon.glyphMap;
  }[] = [
    { value: "light", label: "Light", icon: "light-mode" },
    { value: "dark", label: "Dark", icon: "dark-mode" },
    { value: "system", label: "System", icon: "settings" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Icon name="palette" size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      </View>

      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor:
                  theme === option.value ? colors.primary : "transparent",
              },
            ]}
            onPress={() => setTheme(option.value)}
          >
            <Icon
              name={option.icon}
              size={20}
              color={theme === option.value ? "#FFFFFF" : colors.textSecondary}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: theme === option.value ? "#FFFFFF" : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 14, // reduced from 18
    fontWeight: "600",
    marginLeft: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 12, // reduced from 14
    fontWeight: "500",
    marginLeft: 8,
  },
});
