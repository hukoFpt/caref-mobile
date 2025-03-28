import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#FFFFFF",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // sky-500 color
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  decimalPlaces: 2, // optional, defaults to 2dp
  labelColor: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // sky-500 color
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
  propsForVerticalLabels: {
    rotation: 30, // Rotate the labels by 30 degrees
  },
};

interface DataPoint {
  date: string;
  height: number;
  weight: number;
  bmi: number;
}

interface GraphProps {
  primaryData: DataPoint[];
  secondaryData?: DataPoint[];
}

const Graph: React.FC<GraphProps> = ({ primaryData = [], secondaryData = [] }) => {
  const [selectedStat, setSelectedStat] = useState("bmi");

  // Limit the data to the last 10 points
  const limitedPrimaryData = primaryData.slice(-10);
  const limitedSecondaryData = secondaryData.slice(-10);

  const primaryLabels = limitedPrimaryData.map((item) => item.date); // Show all labels
  const primaryValues = limitedPrimaryData.map((item) => item[selectedStat]);
  const secondaryValues = limitedSecondaryData.map((item) => item[selectedStat]);

  const graphData = {
    labels: primaryLabels,
    datasets: [
      {
        data: primaryValues,
        strokeWidth: 2, // optional
        color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // sky-500 color
      },
      secondaryData.length > 0 && {
        data: secondaryValues,
        strokeWidth: 2, // optional
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // secondary color
      },
    ].filter(Boolean), // Filter out undefined datasets
  };

  // Log the data
  useEffect(() => {
    console.log("Primary Data:", primaryData);
    console.log("Secondary Data:", secondaryData);
    console.log("Graph Data:", graphData);
  }, [primaryData, secondaryData, selectedStat]);

  return (
    <View style={tw`p-4`}>
      <View style={tw`flex flex-row justify-between items-baseline`}>
        <Text style={tw`text-lg font-bold`}>Index</Text>
        <Picker
          selectedValue={selectedStat}
          style={tw`mb-4 text-lg rounded-full px-2 border border-neutral-800`}
          onValueChange={(itemValue) => setSelectedStat(itemValue)}
        >
          <Picker.Item label="BMI" value="bmi" />
          <Picker.Item label="Height" value="height" />
          <Picker.Item label="Weight" value="weight" />
        </Picker>
      </View>
      {/* <LineChart
        data={graphData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        withDots={false} // Disable the dots
      /> */}
    </View>
  );
};

export default Graph;