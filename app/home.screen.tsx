import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { View, Text, TouchableOpacity } from "react-native";
import { UserCenter } from "@/components/index/UserCenter.component";
import ArrowDownIcon from "@/assets/icons/ArrowDown.icon";
import { Link, router } from "expo-router";
import IndexStat from "@/components/index/IndexStat.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import childService from "@/service/child.service";
import ProfileIcon from "@/assets/icons/Profile.icon";

interface UserData {
  id: string;
  email: string;
  role: string;
  userName: string;
  subscription: string;
  avatar: string;
}

const ChildSelector = ({
  selectedChildName,
}: {
  selectedChildName: string;
}) => {
  return (
    <View style={tw`flex-row items-center justify-between px-4 my-4`}>
      <Text style={tw`font-normal text-xl`}>Child: </Text>
      <Link href="/child-selector.screen">
        <View
          style={tw`rounded-full flex flex-row px-4 py-2 w-52 items-center justify-between bg-white `}
        >
          <Text style={tw`w-full text-lg font-semibold text-center`}>
            {selectedChildName}
          </Text>
          <ArrowDownIcon />
        </View>
      </Link>
    </View>
  );
};

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData>({
    id: "",
    email: "",
    role: "",
    userName: "",
    subscription: "No subscriptions",
    avatar: "https://picsum.photos/150",
  });
  const [selectedChildName, setSelectedChildName] = useState("Select a child");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserData({
            ...user,
            avatar: user.avatar || "https://picsum.photos/150",
          });
        }

        const children = await childService.getChildren();
        await AsyncStorage.setItem("children", JSON.stringify(children));

        // Set the first child as the default selected child if children are not null
        if (children.length > 0) {
          await AsyncStorage.setItem(
            "selectedChild",
            JSON.stringify(children[0])
          );
        }
      } catch (error) {
        console.error("Failed to fetch user data from AsyncStorage", error);
      }
    };

    const fetchSelectedChild = async () => {
      try {
        const selectedChildString = await AsyncStorage.getItem("selectedChild");
        if (selectedChildString) {
          const selectedChild = JSON.parse(selectedChildString);
          setSelectedChildName(`${selectedChild.fname} ${selectedChild.lname}`);
        }
      } catch (error) {
        console.error(
          "Failed to fetch selected child from AsyncStorage",
          error
        );
      }
    };

    const logAsyncStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        const asyncStorageContents = result.map(([key, value]) => {
          try {
            return [key, value ? JSON.parse(value) : value];
          } catch (e) {
            return [key, value];
          }
        });
        console.log(
          "Current AsyncStorage contents:",
          JSON.stringify(asyncStorageContents, null, 2)
        );
      } catch (error) {
        console.error("Failed to log AsyncStorage contents", error);
      }
    };

    fetchUserData();
    fetchSelectedChild();

    logAsyncStorage();
  }, []);

  return (
    <View style={tw`p-4`}>
      <UserCenter
        avatar={userData.avatar}
        name={userData.userName}
        subscriptionPlan={userData.subscription}
      />
      <ChildSelector selectedChildName={selectedChildName} />
      <IndexStat />
      <View style={tw`mt-4 flex flex-row gap-4 justify-between`}>
        <TouchableOpacity
          style={tw`flex-row w-[48%] bg-sky-500 p-2 rounded-lg gap-2 items-center`}
          onPress={() => {
            router.push("/child-information.screen?mode=VIEW");
          }}
        >
          <ProfileIcon />
          <Text style={tw`text-white font-bold text-lg`}>Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row w-[48%] bg-sky-500 p-2 rounded-lg gap-2 items-center`}
          onPress={() => {
            router.push("/statistic.screen?mode=EDIT");
          }}
        >
          <ProfileIcon />
          <Text style={tw`text-white font-bold text-lg`}>Statistic</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
