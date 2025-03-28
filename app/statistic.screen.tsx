import React, { useEffect, useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { Header } from "@/components/Header.component";
import { router, useLocalSearchParams } from "expo-router";
import { Child } from "@/models/Child.model";
import EditStatistics from "@/components/statistics/EditStatistics.component";
import ViewStatisticsGraph from "@/components/graph/Graph.component";
import { getSelectedChild } from "@/utils/storage.util";

export default function StatisticScreen() {
  const { mode } = useLocalSearchParams();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelectedChild = async () => {
      const child = await getSelectedChild(); // Fetch the selected child from AsyncStorage
      setSelectedChild(child); // Update the state with the fetched child
      setLoading(false); // Set loading to false
    };

    fetchSelectedChild();
  }, []);

  return (
    <View style={tw``}>
      <Header
        screenTitle="Child Statistic Tracking"
        onBackPress={() => {
          router.push("/home.screen");
        }}
      />
      {mode === "EDIT" && selectedChild ? (
        <EditStatistics selectedChild={selectedChild} />
      ) : (
        <ViewStatisticsGraph primaryData={[]} secondaryData={[]} />
      )}
    </View>
  );
}