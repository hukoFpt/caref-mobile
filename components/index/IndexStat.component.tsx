import ArrowNext from "@/assets/icons/ArrowNext.icon";
import { Link } from "expo-router";
import React from "react";
import { View, Text, Image, Touchable } from "react-native";
import tw from "twrnc";

const StatBox = () => (
    <View>
        StatBox
    </View>
)

const IndexBackground = require("@/assets/images/Index-Background.png");
const IndexStat = () => {
  return (
    <View style={tw`mt-4 h-[510px]`}>
      <Image
        source={IndexBackground}
        style={tw`absolute w-full h-[510px] opacity-60 bg-white rounded-3xl`}
      />
      <View style={tw`flex flex-row mx-3 mt-2 items-baseline justify-between`}>
        <Text style={tw`text-2xl font-bold pt-2`}>Current Statistic</Text>
        <Link href="/statistic.screen">
          <View style={tw`flex flex-row ml-auto`}>
            <Text style={tw`text-sm text-slate-600`}>Other stats</Text>
            <ArrowNext />
          </View>
        </Link>
      </View>
      <Text style={tw`px-3 pt-1 tracking-wider`}>Body Mass Index</Text>
    </View>
  );
};

export default IndexStat;
