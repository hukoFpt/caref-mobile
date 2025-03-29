import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { LineChart } from "react-native-gifted-charts";

interface DataPoint {
  date: string;
  value: number;
}

interface GraphProps {
  data: DataPoint[]; // The graph will only receive data as input
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  // Transform the data into the format required by the LineChart
  const transformedData = data.map((item) => ({
    value: item.value,
    label: item.date,
  }));

  return (
    <View style={tw`p-4`}>
      {/* Line Chart */}
      {transformedData.length > 0 ? (
        <LineChart
          data={transformedData}
          width={300}
          height={220}
          curved
          hideDataPoints
          isAnimated
          adjustToWidth
          hideRules
          dataPointsColor="#0ea5e9" // sky-500 color
          dataPointsRadius={4}
          color="#0ea5e9" // sky-500 color
          noOfSections={4}
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisLabelTextStyle={{
            color: "#6b7280", // slate-500 color
            fontSize: 10,
          }}
          yAxisTextStyle={{
            color: "#6b7280", // slate-500 color
            fontSize: 10,
          }}
          xAxisLabelTexts={transformedData.map((item) => item.label)}
          xAxisLabelTextStyle={{
            color: "#6b7280", // slate-500 color
            fontSize: 10,
            padding: 4,
            transform: [{ rotate: "-60deg" }], // Rotate the label
            textAlign: "",
          }}
        />
      ) : (
        <Text style={tw`text-center text-gray-500 mt-4`}>No data available for the graph.</Text>
      )}
    </View>
  );
};

export default Graph;