import React, { useState } from "react";
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
  const [inputWidth, setInputWidth] = useState(120);

  return (
    <View style={tw`mt-4 bg-sky-500 border border-sky-500 rounded-lg w-[48%]`}>
      <View style={tw` bg-white rounded-lg px-2`}>
        <Text style={tw`text-neutral-700`}>{label.toUpperCase()}</Text>
        <View style={tw`flex-row justify-between items-baseline`}>
          <TextInput
            style={[tw`pb-1 w-1/3 text-4xl font-bold`, { width: inputWidth }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            placeholderTextColor={"#ddd"}
            onContentSizeChange={(e) =>
              setInputWidth(e.nativeEvent.contentSize.width + 30)
            }
          />
          <Text style={tw`font-bold w-full text-neutral-700`}>{unit}</Text>
        </View>
      </View>
      <Text style={tw`pl-2 text-sm font-light`}>
        Last Updated:
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
      <Text style={tw`pl-2 text-sm font-light`}>
        Status:
        <Text style={tw`font-bold pl-1 ${getCategoryColor(bmiCategory)}`}>
          {bmiCategory}
        </Text>
      </Text>
    </View>
  );
};

const EditStatistics = ({ selectedChild }: { selectedChild: Child }) => {
  const router = useRouter();

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

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Close the date picker
    if (selectedDate) {
      setDate(formatDate(selectedDate)); // Update the selected date
    }
  };

  const fetchStatistics = async () => {
    try {
      const existingStats = await AsyncStorage.getItem("statistics");
      const statsData = existingStats ? JSON.parse(existingStats) : {};
      const stats = statsData[selectedChild._id]?.[date];
      if (stats) {
        setHeight(stats.height);
        setWeight(stats.weight);
        setBmi(stats.bmi);
        setBmiCategory(stats.bmiCategory);
      } else {
        setHeight("");
        setWeight("");
        setBmi("");
        setBmiCategory("");
        console.log("No statistics found for the selected date.");
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

    const stats = {
      height,
      weight,
      bmi: calculatedBMI.toString(),
      bmiCategory,
      updatedDate: new Date().toISOString(),
    };

    try {
      const existingStats = await AsyncStorage.getItem("statistics");
      const statsData = existingStats ? JSON.parse(existingStats) : {};
      if (!statsData[selectedChild._id]) {
        statsData[selectedChild._id] = {};
      }
      statsData[selectedChild._id][date] = stats;
      await AsyncStorage.setItem("statistics", JSON.stringify(statsData));
      console.log("Statistics saved successfully!");
    } catch (error) {
      console.error("Failed to save statistics", error);
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
          <TouchableOpacity
            style={tw`bg-sky-500 rounded-full px-2`}
            onPress={fetchStatistics}
          >
            <Text style={tw`text-white px-2 py-1 font-semibold`}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`flex flex-row justify-between`}>
        <StatInput
          label="Height"
          value={height}
          unit="cm"
          lastUpdated="2021-09-01"
          onChangeText={setHeight}
          placeholder="00"
          keyboardType="numeric"
        />
        <StatInput
          label="Weight"
          value={weight}
          unit="kg"
          lastUpdated="2021-09-01"
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
