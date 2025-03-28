import React from "react";
import tw from "twrnc";
import HomeIcon from "@/assets/icons/Home.icon";
import AccountIcon from "@/assets/icons/Account.icon";
import SupportIcon from "@/assets/icons/Support.icon";
import { View, TouchableOpacity, Text } from "react-native";
import { router, usePathname } from "expo-router";

const NavBar = () => {
  const currentRoute = usePathname();
  console.log(currentRoute);
  return (
    <View style={tw`absolute bottom-0 w-full px-4 pb-6 z-10`}>
      <View
        style={[
          tw`flex flex-row justify-between w-full bg-white rounded-full px-12 pt-3 pb-2`,
          {
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 0 }, // Shadow around (no offset)
            shadowOpacity: 0.1, // Shadow transparency
            shadowRadius: 1, // Spread of the shadow
            elevation: 5, // Android shadow
          },
        ]}
      >
        <TouchableOpacity
          style={tw`flex flex-col items-center w-16`}
          disabled={currentRoute === "/home.screen"}
          onPress={() => {
            router.push("/home.screen");
          }}
        >
          <HomeIcon isActive={currentRoute === "/home.screen"} />
          <Text
            style={tw`text-sm  ${
              currentRoute === "/home.screen"
                ? "text-sky-500 font-bold"
                : "text-gray-500 font-light"
            }`}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex flex-col items-center`}
          onPress={() => {
            router.push("/support.screen");
          }}
        >
          <View style={tw`absolute bottom-4 p-3 bg-white rounded-full`}>
            <View style={tw`rounded-full p-2 z-5 bg-[#239AC6]`}>
              <SupportIcon />
            </View>
          </View>
          <Text
            style={tw`pt-6 z-10 ${
              currentRoute === "/support.screen"
                ? "text-sky-500 font-bold"
                : "text-gray-500 font-light"
            }`}
          >
            Support
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex flex-col items-center w-16`}
          disabled={currentRoute === "/account.screen"}
          onPress={() => {
            router.push("/account.screen");
          }}
        >
          <AccountIcon isActive={currentRoute === "/account.screen"} />
          <Text
            style={tw`text-sm  ${
              currentRoute === "/account.screen"
                ? "text-sky-500 font-bold"
                : "text-gray-500 font-light"
            }`}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;
