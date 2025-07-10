"use client";

import { Tabs } from "expo-router";
import { Platform, View, Text } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          borderRadius: 25,
          marginHorizontal: 20,
          marginBottom: Platform.OS === "ios" ? 34 : 20,
          height: 70,
          position: "absolute",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          paddingBottom: 8,
          paddingTop: 4,
          borderWidth: Platform.OS === "ios" ? 0.5 : 0,
          borderColor: colors.textSecondary + "20",
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 8,
          paddingVertical: 4,
        },
        tabBarLabel: ({ color, focused, children }) => (
          <Text
            style={{
              fontSize: 11,
              color,
              fontFamily: "Inter_500Medium",
              textAlign: "center",
              fontWeight: focused ? "600" : "400",
              marginTop: 2,
              opacity: focused ? 1 : 0.7,
            }}
          >
            {children}
          </Text>
        ),
        tabBarIcon: ({ color, focused }) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? colors.primary + "15" : "transparent",
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}
          >
            <IconSymbol
              size={focused ? 20 : 18}
              name="house.fill"
              color={focused ? colors.primary : color}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused
                  ? colors.primary + "15"
                  : "transparent",
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <IconSymbol
                size={focused ? 20 : 18}
                name="house.fill"
                color={focused ? colors.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused
                  ? colors.primary + "15"
                  : "transparent",
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <IconSymbol
                size={focused ? 20 : 18}
                name="paperplane.fill"
                color={focused ? colors.primary : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
