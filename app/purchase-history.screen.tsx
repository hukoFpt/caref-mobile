import { Header } from "@/components/Header.component";
import { router } from "expo-router";
import { View } from "react-native";
import tw from "twrnc";

export default function PurchaseHistoryScreen() {
  return (
    <View style={tw``}>
      <Header
        screenTitle="Purchase Management"
        onBackPress={() => {
          router.push("/account.screen");
        }}
      />
    </View>
  );
}
