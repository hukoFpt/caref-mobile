import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Graph from "../graph/Graph.component";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";

interface DataPoint {
  date: string;
  height: number;
  weight: number;
  bmi: number;
}

interface ViewStatisticsProps {
  selectedChild: { _id: string; fname: string; lname: string }; // Selected child object
}

const ViewStatistics: React.FC<ViewStatisticsProps> = ({ selectedChild }) => {
  const [primaryData, setPrimaryData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState<"bmi" | "height" | "weight">("bmi");

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        // Fetch trackings from AsyncStorage
        const trackingsString = await AsyncStorage.getItem("trackings");
        const trackings = trackingsString ? JSON.parse(trackingsString) : {};

        // Find the recordId for the selected child
        const recordsString = await AsyncStorage.getItem("records");
        const records = recordsString ? JSON.parse(recordsString) : [];
        const matchingRecord = records.find((record: any) => record.ChildId === selectedChild._id);

        if (matchingRecord && trackings[matchingRecord._id]) {
          const recordData = trackings[matchingRecord._id];

          // Transform the tracking data into the required format
          const transformedData = Object.entries(recordData).map(([date, stats]: [string, any]) => ({
            date,
            height: parseFloat(stats.height),
            weight: parseFloat(stats.weight),
            bmi: parseFloat(stats.bmi),
          }));

          // Sort the data by date
          transformedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          setPrimaryData(transformedData);
        } else {
          console.warn("No tracking data found for the selected child.");
          setPrimaryData([]);
        }
      } catch (error) {
        console.error("Failed to fetch tracking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [selectedChild]);

  return (
    <View style={tw`p-4`}>
      <Text style={tw`font-bold text-lg mb-4`}>
        Statistics for {selectedChild.fname} {selectedChild.lname}
      </Text>
      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading...</Text>
      ) : primaryData.length > 0 ? (
        <>
          {/* Picker to select the statistic type */}
          <Picker
            selectedValue={selectedStat}
            style={tw`mb-4`}
            onValueChange={(itemValue) => setSelectedStat(itemValue)}
          >
            <Picker.Item label="BMI" value="bmi" />
            <Picker.Item label="Height" value="height" />
            <Picker.Item label="Weight" value="weight" />
          </Picker>
          {/* Pass the selected statistic to the Graph */}
          <Graph
            data={primaryData.map((data) => ({
              date: data.date,
              value: data[selectedStat], // Dynamically select the statistic
            }))}
          />
        </>
      ) : (
        <Text style={tw`text-center text-gray-500 mt-4`}>No data available to display.</Text>
      )}
    </View>
  );
};

export default ViewStatistics;