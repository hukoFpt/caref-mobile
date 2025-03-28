import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc";
import { Child } from "@/models/Child.model";
import { Header } from "@/components/Header.component";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ItemsList = ({
  items,
  selectedChild,
  onSelectChild,
}: {
  items: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
}) => {
  return (
    <View style={tw`flex flex-col gap-4`}>
      {items.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={[
            tw`flex flex-col p-4 rounded-lg bg-white justify-between`,
            selectedChild?._id === item._id
              ? tw`border border-sky-600`
              : tw`border border-white`,
          ]}
          onPress={() => onSelectChild(item)}
        >
          <View style={tw`flex flex-row items-center justify-between w-full`}>
            <View style={tw`flex flex-row items-center gap-2`}>
              <Text style={tw`font-semibold text-lg`}>
                {item._id.slice(-6).toUpperCase()} {/* Display last 6 characters of _id */}
              </Text>
              <View style={tw`w-[2px] bg-slate-600 h-5`} />
              <Text style={tw`text-lg`}>
                {item.fname.toUpperCase() + " " + item.lname.toUpperCase()}
              </Text>
            </View>
            <View
              style={tw`h-5 w-5 rounded-full border border-sky-600 items-center justify-center`}
            >
              {selectedChild?._id === item._id && (
                <View style={tw`h-3 w-3 rounded-full bg-sky-600`} />
              )}
            </View>
          </View>
          <Text style={tw`text-sm text-slate-600 pt-2`}>{item.notes}</Text>
          <View style={tw`flex flex-row items-center justify-start gap-2`}>
            <Text
              style={tw`text-xs font-semibold text-green-600 bg-green-200 rounded px-2 py-1 mt-2 self-start`}
            >
              {item.birthdate &&
                Math.floor(
                  (new Date().getTime() - new Date(item.birthdate).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                )}{" "}
              years old
            </Text>
            <Text style={tw`text-xs font-semibold text-red-600 bg-red-200 rounded px-2 py-1 mt-2 self-start`}>Medical Status (TDL)</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function ChildSelectorScreen() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [children, setChildren] = useState<Child[]>([]);

  const handleSelectChild = async (child: Child) => {
    setSelectedChild(child);
    await AsyncStorage.setItem("selectedChild", JSON.stringify(child));
    router.push("/home.screen"); // Redirect to home screen
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const childrenString = await AsyncStorage.getItem("children");
        const selectedChildString = await AsyncStorage.getItem("selectedChild");
        if (childrenString) {
          const childrenData = JSON.parse(childrenString);
          setChildren(childrenData);
        }
        if (selectedChildString) {
          const selectedChildData = JSON.parse(selectedChildString);
          setSelectedChild(selectedChildData);
        }
      } catch (error) {
        console.error("Failed to fetch children from AsyncStorage", error);
      }
    };

    fetchChildren();
  }, []);

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Child Selector"
        onBackPress={() => {
          router.push("/home.screen");
        }}
      />
      <View style={tw`px-4`}>
        <ItemsList
          items={children}
          selectedChild={selectedChild}
          onSelectChild={handleSelectChild}
        />
      </View>
    </View>
  );
}