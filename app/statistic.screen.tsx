import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Header } from "@/components/Header.component";
import { router, useLocalSearchParams } from "expo-router";
import { Child } from "@/models/Child.model";
import EditStatistics from "@/components/statistics/EditStatistics.component";
import Graph from "@/components/graph/Graph.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSelectedChild } from "@/utils/storage.util";
import ViewStatistics from "@/components/statistics/ViewStatistics.component";

interface StatisticDataPoint {
  date: string;
  height: number;
  weight: number;
  bmi: number;
}

export default function StatisticScreen() {
  const { mode } = useLocalSearchParams();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [primaryData, setPrimaryData] = useState<StatisticDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch selected child and tracking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching selected child...");
        const child = await getSelectedChild();
        console.log("Selected Child:", child);
        setSelectedChild(child);

        console.log("Fetching tracking data from AsyncStorage...");
        const trackingsString = await AsyncStorage.getItem("trackings");
        const trackings = trackingsString ? JSON.parse(trackingsString) : {};
        console.log("Trackings Data:", trackings);

        if (child && trackings[child.recordId]) {
          const recordData = trackings[child.recordId];
          console.log("Record Data for Selected Child:", recordData);

          const transformedData = Object.entries(recordData).map(([date, stats]: [string, any]) => ({
            date,
            height: parseFloat(stats.height),
            weight: parseFloat(stats.weight),
            bmi: parseFloat(stats.bmi),
          }));

          // Sort the data by date
          transformedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          console.log("Transformed Data:", transformedData);

          setPrimaryData(transformedData);
        } else {
          console.warn("No tracking data found for the selected child.");
          setPrimaryData([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        console.log("Loading state set to false.");
      }
    };

    fetchData();
  }, []);

  return (
    <View style={tw``}>
      <Header
        screenTitle="Child Statistic Tracking"
        onBackPress={() => {
          console.log("Navigating back to home screen...");
          router.push("/home.screen");
        }}
      />
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text>Loading...</Text>
        </View>
      ) : mode === "EDIT" && selectedChild ? (
        <EditStatistics selectedChild={selectedChild} />
      ) : selectedChild ? (
        <ViewStatistics selectedChild={selectedChild} />
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text>No child selected</Text>
        </View>
      )}
    </View>
  );
}