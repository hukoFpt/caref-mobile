import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import tw from "twrnc";
import { Header } from "@/components/Header.component";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getChildrenData, getRecordsData } from "@/utils/storage.util";
import { Record } from "@/models/Record.model";
import { Child } from "@/models/Child.model";

const ItemsCard = ({
  record,
  children,
}: {
  record: Record;
  children: Child[];
}) => {
  const child = children?.find((child) => child._id === record.ChildId);

  return (
    <View style={tw`bg-white rounded-lg p-4 mb-2`}>
      <Text style={tw`text-lg font-semibold`}>{record.Order.serviceName}</Text>
      <View style={tw`flex flex-row`}>
        <Text style={tw`w-[60%] text-gray-700`}>
          Child:{" "}
          <Text style={tw`text-neutral-800 text-base font-semibold`}>
            {child ? child.fname : "Not assigned"}
          </Text>
        </Text>
        <Text style={tw`text-gray-700`}>
          Expired:{" "}
          <Text style={tw`text-neutral-800 text-base font-semibold`}>
            {record.ExpiredDate ? new Date(record.ExpiredDate).toLocaleDateString() : "N/A"}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default function ActivationScreen() {
  const [records, setRecords] = useState<Record[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filters = ["All", "Activated", "Inactive", "Expired"];

  // Fetch records from AsyncStorage
  useEffect(() => {
    const fetchRecords = async () => {
      const storedRecords = await getRecordsData();
      const storedChildren = await getChildrenData();
      setRecords(storedRecords);
      setChildren(storedChildren);
    };

    fetchRecords();
  }, []);

  // Filter and search logic
  const filteredRecords = records.filter((record) => {
    const matchesFilter =
      selectedFilter === "All" || record.Status === selectedFilter;
    return matchesFilter;
  });

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Activation Management"
        onBackPress={() => {
          router.push("/account.screen");
        }}
      />
      <View
        style={tw`flex flex-row bg-white rounded-lg px-4 py-2 mx-4 items-center mb-4`}
      >
        <Icon name="search" size={24} color="#A0A0A0" style={tw`mr-2`} />
        <TextInput
          style={tw`py-2 h-8 w-[86%] overflow-hidden`}
          placeholder="Search by plan name or child name"
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close" size={20} color="#A0A0A0" style={tw`ml-2`} />
          </TouchableOpacity>
        )}
      </View>

      <View style={tw`flex-row px-4 gap-4`}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={tw`px-4 py-2 rounded-lg bg-white border ${
              selectedFilter === filter ? "border-blue-600" : "border-white"
            }`}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={tw`text-sm font-medium ${
                selectedFilter === filter ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemsCard record={item} children={children} />
        )}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={
          <Text style={tw`text-center text-gray-500 mt-4`}>
            No records found.
          </Text>
        }
      />
    </View>
  );
}
