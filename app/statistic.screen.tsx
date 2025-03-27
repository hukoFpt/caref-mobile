import React, { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import { Header } from "@/components/Header.component";
import { router, useLocalSearchParams } from "expo-router";
import { Child } from "@/models/Child.model";
import EditStatistics from "@/components/statistics/EditStatistics.component";
import ViewStatisticsGraph from "@/components/graph/Graph.component";

export default function StatisticScreen() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const { mode } = useLocalSearchParams();

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