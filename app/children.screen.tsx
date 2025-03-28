import ArrowNext from "@/assets/icons/ArrowNext.icon";
import PlusIcon from "@/assets/icons/Plus.icon";
import { Header } from "@/components/Header.component";
import { Child } from "@/models/Child.model";
import { getChildrenData, saveSelectedChild } from "@/utils/storage.util";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with 0 if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
  const year = date.getFullYear(); // Get year
  return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
};

const ChildCard = ({ child }: { child: Child }) => {
  const handleSelectChild = async () => {
    await saveSelectedChild(child);
    router.push("/child-information.screen?mode=VIEW");
  };

  return (
    <TouchableOpacity
      onPress={handleSelectChild}
      style={tw`flex flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-300`}
    >
      <View style={tw`flex flex-row items-center gap-4`}>
        <Image
          source={{ uri: "https://picsum.photos/150" }}
          style={tw`w-12 h-12 rounded-full`}
        />
        <View style={tw`flex flex-col`}>
          <View style={tw`flex flex-row items-baseline gap-2`}>
            <Text style={tw`text-lg text-gray-400`}>
              {child._id.slice(0, 6).toLocaleUpperCase()}
            </Text>
            <Text style={tw`text-lg font-semibold`}>
              { "| " + child.fname + " " + child.lname}
            </Text>
          </View>
          <Text style={tw`text-gray-400`}>{formatDate(child.birthdate)}</Text>
        </View>
      </View>
      <ArrowNext />
    </TouchableOpacity>
  );
};

const AddNewChildButton = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push("/child-information.screen?mode=CREATE")}
      style={tw`flex flex-row items-center justify-center p-4 bg-sky-100 rounded-lg gap-2`}
    >
      <PlusIcon />
      <Text style={tw`text-blue-600 text-base font-semibold`}>
        Add New Child
      </Text>
    </TouchableOpacity>
  );
};

export default function ChildrenScreen() {
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    getChildrenData().then((data) => setChildren(data));
  }, []);

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Child Selector"
        onBackPress={() => {
          router.push("/account.screen");
        }}
      />
      <View style={tw`p-4 mx-4 bg-white rounded-lg gap-4`}>
        {children.map((child: Child) => (
          <ChildCard key={child._id} child={child} />
        ))}
        <AddNewChildButton />
      </View>
    </View>
  );
}
