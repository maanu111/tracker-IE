"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { ColorValue } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "light" | "dark" | "system";

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  card: string;
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
  success: string;
  error: string;
  warning: string;
}

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
}

const lightColors: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F8FAFC",
  primary: "#4F46E5",
  secondary: "#8B5CF6",
  text: "#1F2937",
  textSecondary: "#6B7280",
  card: "#FFFFFF",
  gradient: ["#1E1B4B", "#3730A3", "#6366F1"] as const,
  success: "#16A34A",
  error: "#EF4444",
  warning: "#F59E0B",
};

const darkColors: ThemeColors = {
  background: "#0F172A",
  surface: "#1E293B",
  primary: "#6366F1",
  secondary: "#A855F7",
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  card: "#1E293B",
  gradient: ["#0F172A", "#1E293B", "#334155"] as const,
  success: "#22C55E",
  error: "#F87171",
  warning: "#FBBF24",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>("system");

  const actualTheme = theme === "system" ? systemColorScheme || "light" : theme;
  const colors = actualTheme === "dark" ? darkColors : lightColors;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
