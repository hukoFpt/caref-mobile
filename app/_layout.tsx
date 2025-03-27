import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Stack } from "expo-router";
import * as Font from "expo-font";

import tw from "twrnc";

import NavBar from "@/components/Navbar.component";
import { usePathname } from "expo-router";
import "../styles/global.css";

import {
  useFonts,
  NotoSans_400Regular,
  NotoSans_700Bold,
} from "@expo-google-fonts/noto-sans";
import AppLoading from "expo-app-loading";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "NotoSans-100Thin": require("../assets/fonts/NotoSans-Thin.ttf"),
        "NotoSans-200ExtraLight": require("../assets/fonts/NotoSans-ExtraLight.ttf"),
        "NotoSans-300Light": require("../assets/fonts/NotoSans-Light.ttf"),
        "NotoSans-400Regular": require("../assets/fonts/NotoSans-Regular.ttf"),
        "NotoSans-500Medium": require("../assets/fonts/NotoSans-Medium.ttf"),
        "NotoSans-600SemiBold": require("../assets/fonts/NotoSans-SemiBold.ttf"),
        "NotoSans-700Bold": require("../assets/fonts/NotoSans-Bold.ttf"),
        "NotoSans-800ExtraBold": require("../assets/fonts/NotoSans-ExtraBold.ttf"),
        "NotoSans-900Black": require("../assets/fonts/NotoSans-Black.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const currentRoute = usePathname();
  const routesWithNavBar = [
    "/home.screen",
    "/support.screen",
    "/profile.screen",
  ];

  const showNavBar = routesWithNavBar.includes(currentRoute);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={tw`flex-1 bg-sky-50 pt-4`}>
      <StatusBar style="dark" />
      {showNavBar && <NavBar />}
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: tw.color("bg-sky-50"),
          },
        }}
      />
    </View>
  );
}
