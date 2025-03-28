import BackButtonIcon from "@/assets/icons/BackButton.icon";
import React from "react";

import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

type Props = {
  screenTitle: string;
  onBackPress: () => void;
};

export const Header = ({ screenTitle, onBackPress }: Props) => {
  return (
    <View
      style={tw`flex-row items-center justify-between px-4 py-4 mb-4 mt-8 bg-white`}
    >
      <TouchableOpacity style={tw`absolute z-10`} onPress={onBackPress}>
        <BackButtonIcon />
      </TouchableOpacity>
      <Text style={tw`w-full font-bold text-xl text-center`}>
        {screenTitle}
      </Text>
    </View>
  );
};
