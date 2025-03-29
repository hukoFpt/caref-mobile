import ArrowNext from "@/assets/icons/ArrowNext.icon";
import { getSelectedChild } from "@/utils/storage.util";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Touchable } from "react-native";
import tw from "twrnc";

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Underweight":
    case "Overweight":
      return "text-yellow-500";
    case "Normal":
      return "text-green-500";
    case "Obese":
      return "text-orange-500";
    case "Severely Obese":
      return "text-rose-400";
    default:
      return "text-neutral-700";
  }
};

const StatBox = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) => (
  <View style={tw`w-[48%] bg-sky-200/40 rounded-lg border-2 border-white p-2`}>
    <Text style={tw`text-base`}>{label}</Text>
    <View style={tw`flex flex-row items-baseline mt-2`}>
      <Text style={tw`text-6xl font-bold`}>{value}</Text>
      <Text style={tw`text-4xl`}>{unit}</Text>
    </View>
  </View>
);

const CalculatedStatBox = ({
  label,
  value,
  age,
  lastUpdated,
  category,
  unit,
}: {
  label: string;
  value: string | number;
  age: string;
  lastUpdated: string;
  category: string;
  unit: string;
}) => (
  <View
    style={tw`h-[285px] bg-sky-200/40 rounded-lg border-2 border-white p-2 mt-4`}
  >
    <Text style={tw`text-base`}>{label}</Text>
    <View style={tw`flex flex-row items-center mt-2`}>
      <View>
        <Text
          style={tw`${getCategoryColor(
            category
          )} text-center mt-2 text-8xl font-bold`}
        >
          {value}
        </Text>
      </View>
      <View style={tw`flex flex-col ml-2 mt-4`}>
        <Text style={tw`font-bold text-2xl text-neutral-600`}>{unit}</Text>
        <Text>at {age} years old</Text>
      </View>
    </View>
    <Text style={tw`font-light text-xl`}>
      Last statistic updated:{" "}
      <Text style={tw`font-semibold`}>{lastUpdated}</Text>
    </Text>
    <Text style={tw`${getCategoryColor(category)} font-semibold text-2xl mt-18`}>
      {category} Detected
    </Text>
  </View>
);

const IndexBackground = require("@/assets/images/Index-Background.png");
const IndexStat = () => {
  const [latestStat, setLatestStat] = useState<{
    bmi: number;
    height: number;
    weight: number;
    category: string;
    date: string;
  } | null>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  useEffect(() => {
    const fetchLatestStat = async () => {
      try {
        // Fetch selected child using the utility function
        const child = await getSelectedChild();
        setSelectedChild(child);

        if (!child) {
          console.warn("No selected child found.");
          return;
        }

        // Fetch statistics for the selected child
        const statisticsString = await AsyncStorage.getItem("statistics");
        const statistics = statisticsString ? JSON.parse(statisticsString) : {};

        const childStats = statistics[child._id];
        if (childStats) {
          // Get the latest statistic based on the most recent date
          const latestDate = Object.keys(childStats).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
          )[0];
          const latestStat = childStats[latestDate];
          setLatestStat({
            bmi: parseFloat(latestStat.bmi),
            height: parseFloat(latestStat.height),
            weight: parseFloat(latestStat.weight),
            category: latestStat.bmiCategory,
            date: latestDate,
          });
        } else {
          console.warn("No statistics found for the selected child.");
        }
      } catch (error) {
        console.error("Failed to fetch the latest statistic:", error);
      }
    };

    fetchLatestStat();
  }, []);

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
      <Text style={tw`px-3 pt-1 text-base font-light tracking-wider`}>
        Body Mass Index
      </Text>
      {latestStat ? (
        <View style={tw`px-3 mt-2`}>
          <View style={tw`flex flex-row justify-between`}>
            <StatBox
              label="Height"
              value={latestStat.height.toFixed(1)}
              unit="cm"
            />
            <StatBox
              label="Weight"
              value={latestStat.weight.toFixed(1)}
              unit="kg"
            />
          </View>
          <CalculatedStatBox
            label="Body Mass Index"
            value={latestStat.bmi.toFixed(1)}
            age={`${
              new Date().getFullYear() -
              new Date(selectedChild.birthdate).getFullYear()
            } years`}
            lastUpdated={latestStat.date}
            category={latestStat.category}
            unit="kg/m²"
          />
        </View>
      ) : (
        <Text style={tw`text-center mt-40 text-gray-500`}>
          No statistics available.
        </Text>
      )}
    </View>
  );
};

export default IndexStat;
