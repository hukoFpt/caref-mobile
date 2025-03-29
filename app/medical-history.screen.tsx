import { Header } from "@/components/Header.component";
import { router } from "expo-router";
import { View, Text } from "react-native";
import tw from "twrnc";

export default function MedicalHistoryScreen() {
  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Request History"
        onBackPress={() => {
          router.push("/support.screen");
        }}
      />
      <Text style={tw`text-lg font-bold`}>Medical History</Text>
      <Text style={tw`text-gray-600 mt-2`}>
        This feature is under development. Please check back later.
      </Text>
    </View>
  );
}
