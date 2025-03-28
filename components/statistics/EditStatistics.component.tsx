import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Child } from "@/models/Child.model";
import trackingService from "@/service/tracking.service";

const StatInput = ({
  label,
  value,
  unit,
  lastUpdated,
  onChangeText,
  placeholder,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  unit: string;
  lastUpdated?: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}) => {
  const [inputWidth, setInputWidth] = useState(10);

  return (
    <View style={tw`mt-4 bg-sky-500 border border-sky-500 rounded-lg w-[48%]`}>
      <View style={tw` bg-white rounded-lg px-2`}>
        <Text style={tw`text-neutral-700`}>{label.toUpperCase()}</Text>
        <View style={tw`flex-row justify-between items-baseline`}>
          <View style={[tw`w-20`]}>
            <TextInput
              style={[tw`pb-1 text-4xl font-bold`, { width: inputWidth }]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              keyboardType={keyboardType}
              placeholderTextColor={"#ddd"}
              onContentSizeChange={(e) =>
                setInputWidth(e.nativeEvent.contentSize.width + 30)
              }
            />
          </View>
          <Text style={tw`font-bold w-full text-neutral-700`}>{unit}</Text>
        </View>
      </View>
      <Text style={tw`pl-2 text-sm font-light`}>
        Last Updated:{" "}
        <Text style={tw`p-2 text-sm font-light text-white`}>{lastUpdated}</Text>
      </Text>
    </View>
  );
};

const BMIDisplay = ({
  bmi,
  bmiCategory,
}: {
  bmi: string;
  bmiCategory: string;
}) => {
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

  return (
    <View
      style={tw`flex w-full bg-sky-500 border border-sky-500 mt-4 rounded-lg`}
    >
      <View style={tw`bg-white rounded-lg px-2`}>
        <Text style={tw`text-neutral-700`}>BODY MASS INDEX</Text>
        <View style={tw`flex flex-row items-baseline`}>
          <Text style={tw`pb-1 w-1/3 text-4xl font-bold`}>{bmi}</Text>
          <Text style={tw`font-bold w-full text-neutral-700`}>kg/m</Text>
        </View>
      </View>
      <View style={tw`flex-row items-baseline rounded-lg px-2`}>
        <Text style={tw`pl-2 text-sm font-light`}>Status:</Text>
        <View
          style={tw`flex-row items-baseline bg-white rounded-full px-2 m-1`}
        >
          <Text style={tw`font-bold pl-1 ${getCategoryColor(bmiCategory)}`}>
            {bmiCategory}
          </Text>
        </View>
      </View>
    </View>
  );
};

const EditStatistics = ({ selectedChild }: { selectedChild: Child }) => {
  const router = useRouter();

  useEffect(() => {
    fetchStatistics(getCurrentDate());
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [date, setDate] = useState(getCurrentDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [bmiCategory, setBmiCategory] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the date picker
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setDate(formattedDate); // Update the selected date
      fetchStatistics(formattedDate); // Fetch statistics for the new date
    }
  };

  const fetchStatistics = async (selectedDate?: string) => {
    try {
      const dateToFetch = selectedDate || date;
      const existingStats = await AsyncStorage.getItem("statistics");
      const statsData = existingStats ? JSON.parse(existingStats) : {};
      const childStats = statsData[selectedChild._id];

      if (childStats) {
        // Find the latest date in the statistics
        const latestDate = Object.keys(childStats).sort().reverse()[0];
        const stats = childStats[dateToFetch] || childStats[latestDate];

        if (stats) {
          setHeight(stats.height);
          setWeight(stats.weight);
          setBmi(stats.bmi);
          setBmiCategory(stats.bmiCategory);
          setLastUpdated(latestDate); // Set the latest date
        } else {
          setHeight("");
          setWeight("");
          setBmi("");
          setBmiCategory("");
          setLastUpdated(""); // Clear the last updated date
          console.log("No statistics found for the selected date.");
        }
      } else {
        setHeight("");
        setWeight("");
        setBmi("");
        setBmiCategory("");
        setLastUpdated(""); // Clear the last updated date
        console.log("No statistics found for the selected child.");
      }
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    }
  };

  const calculateBMI = (height: string, weight: string) => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters > 0 && weightInKg > 0) {
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return "";
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    if (bmi >= 30 && bmi < 40) return "Obese";
    if (bmi >= 40) return "Severely Obese";
    return "";
  };

  const handleSave = async () => {
    const calculatedBMI = parseFloat(calculateBMI(height, weight));
    const bmiCategory = getBMICategory(calculatedBMI);
    setBmi(calculatedBMI.toString());
    setBmiCategory(bmiCategory);

    try {
      // Fetch records from AsyncStorage
      const recordsString = await AsyncStorage.getItem("records");
      const records = recordsString ? JSON.parse(recordsString) : [];

      // Find the matching record for the selected child
      const matchingRecord = records.find(
        (record: any) => record.ChildId === selectedChild._id
      );

      if (!matchingRecord) {
        console.error("No matching record found for the selected child.");
        return;
      }

      const payload = {
        recordId: matchingRecord._id,
        date: date.split("-").reverse().join("-"),
        growthStats: {
          Height: height,
          Weight: weight,
        },
      };

      const response = await trackingService.createTracking(payload);
      await trackingService.getMemberTracking(matchingRecord._id);

      console.log("Tracking created successfully:", response);
    } catch (error) {
      console.error("Failed to save statistics or create tracking", error);
    }
  };

  const handleGraph = async () => {
    router.push("/statistic.screen?mode=VIEW");
  };

  return (
    <View style={tw`p-4`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`font-bold text-lg`}>Stats Index</Text>
        <View style={tw`flex-row items-center gap-2`}>
          <TouchableOpacity
            style={tw`bg-sky-500 rounded-full px-4 py-1`}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={tw`text-white font-bold`}>
              {formatDate(new Date(date.split("-").reverse().join("-")))}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(date.split("-").reverse().join("-"))}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>
      <View style={tw`flex flex-row justify-between`}>
        <StatInput
          label="Height"
          value={height}
          unit="cm"
          lastUpdated={lastUpdated}
          onChangeText={setHeight}
          placeholder="00"
          keyboardType="numeric"
        />
        <StatInput
          label="Weight"
          value={weight}
          unit="kg"
          lastUpdated={lastUpdated}
          onChangeText={setWeight}
          placeholder="00"
          keyboardType="numeric"
        />
      </View>
      <BMIDisplay bmi={bmi} bmiCategory={bmiCategory} />
      <TouchableOpacity
        style={tw`bg-sky-500 rounded-lg p-2 mt-4`}
        onPress={handleSave}
      >
        <Text style={tw`text-center text-lg font-bold text-white`}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-sky-500 rounded-lg p-2 mt-4`}
        onPress={handleGraph}
      >
        <Text style={tw`text-center text-lg font-bold text-white`}>
          Generate Graph
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditStatistics;
function getMemberTracking(_id: any) {
  throw new Error("Function not implemented.");
}
