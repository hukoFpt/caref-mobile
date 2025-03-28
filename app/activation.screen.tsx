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
import {
  fetchChildrenService,
  fetchRecordsService,
} from "@/utils/fetchAllServices.util";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import recordService from "@/service/record.service";

const ItemsCard = ({
  record,
  children,
  onItemPress,
}: {
  record: Record;
  children: Child[];
  onItemPress: (record: Record) => void;
}) => {
  const child = children?.find((child) => child._id === record.ChildId);

  return (
    <TouchableOpacity onPress={() => onItemPress(record)}>
      <View style={tw`bg-white rounded-lg p-4 mb-2`}>
        <Text style={tw`text-lg font-semibold`}>
          {record.Order?.serviceName || "Unknown Service"}
        </Text>
        <View style={tw`flex flex-row`}>
          <Text style={tw`w-[60%] text-gray-700`}>
            Child:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              {child ? `${child.fname} ${child.lname}` : "Not assigned"}
            </Text>
          </Text>
          <Text style={tw`text-gray-700`}>
            Expired:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              {record.ExpiredDate
                ? new Date(record.ExpiredDate).toLocaleDateString()
                : "N/A"}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ActivationScreen() {
  const [records, setRecords] = useState<Record[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const filters = ["All", "Activated", "Inactive", "Expired"];

  useEffect(() => {
    const fetchRecords = async () => {
      const storedRecords = await getRecordsData();
      const storedChildren = await getChildrenData();

      const updatedChildren = storedChildren.map((child: { _id: any; }) => {
        const isActive = storedRecords.some(
          (record: { ChildId: any; }) => record.ChildId === child._id
        );
        return { ...child, active: isActive };
      });

      setRecords(storedRecords);
      setChildren(updatedChildren);
    };

    refreshData();
    fetchRecords();
  }, []);

  const inactiveChildren = children.filter((child) => !child.active);

  const handleItemPress = (record: Record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const refreshData = async () => {
    try {
      await fetchChildrenService();
      await fetchRecordsService();

      const updatedChildren = JSON.parse(
        (await AsyncStorage.getItem("children")) || "[]"
      );
      const updatedRecords = JSON.parse(
        (await AsyncStorage.getItem("records")) || "[]"
      );

      setChildren(updatedChildren);
      setRecords(updatedRecords);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  const handleAction = (action: string) => {
    console.log("Selected Child:", selectedChild?._id);
    recordService.activateRecord({
      recordId: selectedRecord?._id || "",
      childId: selectedChild?._id || "",
    });
    refreshData();
    handleCloseModal();
  };

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
          <ItemsCard
            record={item}
            children={children}
            onItemPress={handleItemPress}
          />
        )}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={
          <Text style={tw`text-center text-gray-500 mt-4`}>
            No records found.
          </Text>
        }
      />

      {isModalVisible && selectedRecord && (
        <View
          style={tw`absolute inset-0 bg-black bg-opacity-50 justify-center items-center`}
        >
          <View style={tw`bg-white rounded-lg p-6 w-[90%]`}>
            <Text style={tw`text-lg font-semibold mb-4 text-center`}>
              {selectedRecord.Order?.serviceName || "Unknown Service"}
            </Text>
            <Text style={tw`text-gray-700 mb-4`}>
              Order Code: {selectedRecord.Order?.orderCode || "N/A"}
            </Text>
            <View style={tw`flex-row justify-center`}>
              {selectedRecord.Status === "Activated" ? (
                <View style={tw`flex flex-col w-full`}>
                  <Text style={tw`text-gray-700 `}>
                    Child:{" "}
                    <Text style={tw`text-neutral-800 text-base font-semibold`}>
                      {children.find(
                        (child) => child._id === selectedRecord.ChildId
                      )
                        ? `${
                            children.find(
                              (child) => child._id === selectedRecord.ChildId
                            )?.fname
                          } ${
                            children.find(
                              (child) => child._id === selectedRecord.ChildId
                            )?.lname
                          }`
                        : "Not assigned"}
                    </Text>
                  </Text>
                  <Text style={tw`text-gray-700`}>
                    Created Date:{" "}
                    <Text style={tw`text-neutral-800 text-base font-semibold`}>
                      {selectedRecord.CreatedDate
                        ? new Date(
                            selectedRecord.CreatedDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </Text>
                  <Text style={tw`text-gray-700`}>
                    Expired Date:{" "}
                    <Text style={tw`text-neutral-800 text-base font-semibold`}>
                      {selectedRecord.ExpiredDate
                        ? new Date(
                            selectedRecord.ExpiredDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </Text>
                </View>
              ) : (
                <View style={tw`flex flex-col gap-4 w-full`}>
                  <View>
                    <Text style={tw`text-gray-700 mb-2`}>Select Child:</Text>
                    <View
                      style={tw`bg-white border border-gray-300 rounded-lg`}
                    >
                      <Picker
                        selectedValue={selectedChild?._id || ""}
                        onValueChange={(itemValue) => {
                          const child = inactiveChildren.find(
                            (child) => child._id === itemValue
                          );
                          setSelectedChild(child || null);
                          console.log("Selected Child:", child);
                        }}
                      >
                        <Picker.Item label="Select a child" value="" />
                        {inactiveChildren.map((child) => (
                          <Picker.Item
                            key={child._id}
                            label={`${child.fname} ${child.lname}`}
                            value={child._id}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={tw`w-full px-4 py-2 bg-sky-100 rounded-lg`}
                    onPress={() => handleAction("Activate")}
                  >
                    <Text style={tw`text-blue-600  text-center font-semibold`}>
                      Activate
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={tw`mt-2 px-4 py-2 bg-gray-300 rounded-lg`}
              onPress={handleCloseModal}
            >
              <Text style={tw`text-gray-800 font-semibold text-center`}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
