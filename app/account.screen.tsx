import ChildrenIcon from "@/assets/icons/account/Children.icon";
import StatisticIcon from "@/assets/icons/account/Statistic.icon";
import ArrowNext from "@/assets/icons/ArrowNext.icon";
import LogoutIcon from "@/assets/icons/Logout.icon";
import useUser from "@/hooks/useStorage.hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import tw, { style } from "twrnc";
import { getBadge } from "@/utils/getBadge";
import { useEffect, useState } from "react";

import SilverIcon from "@/assets/icons/subscription/Silver.icon";
import GoldIcon from "@/assets/icons/subscription/Gold.icon";
import PlatinumIcon from "@/assets/icons/subscription/Platinum.icon";
import DiamondIcon from "@/assets/icons/subscription/Diamond.icon";

const subscriptionColors: { [key: string]: string } = {
  Free: "bg-slate-300",
  "1": "bg-gray-400", // Silver
  "2": "bg-orange-400", // Gold
  "3": "bg-sky-500", // Platinum
  "4": "bg-violet-600", // Diamond
};

const subscriptionName: { [key: string]: string } = {
  Free: "Free",
  "1": "Sprout",
  "2": "Bloom",
  "3": "Thrive",
  "4": "Peak",
};

const Logo = require("../assets/images/Logo.png");
const Ellipse3 = require("../assets/images/Ellipse-3.png");
const Ellipse4 = require("../assets/images/Ellipse-4.png");
const SubscriptionBackground = require("../assets/images/Subscription.png");

const UserCenter = () => {
  const [userName, setUserName] = useState<string>("User");
  const [avatar, setAvatar] = useState<string>("https://picsum.photos/150");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("Free");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserName(user.userName || "User");
          setAvatar(user.avatar || "https://picsum.photos/150");
        }

        const badge = await getBadge();
        setSubscriptionPlan(badge);
      } catch (error) {
        console.error("Error fetching user data or badge:", error);
      }
    };

    fetchUserData();
  }, []);

  const bgColor = subscriptionColors[subscriptionPlan] || "bg-white";
  const planName = subscriptionName[subscriptionPlan] || "Free";

  const renderIcon = () => {
    switch (subscriptionPlan) {
      case "Free":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-6 w-6 bg-white`}
          >
            <Text style={tw`text-xs text-slate-600`}>-</Text>
          </View>
        );
      case "1":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-6 w-6 bg-white`}
          >
            <SilverIcon />
          </View>
        );
      case "2":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-6 w-6 bg-white`}
          >
            <GoldIcon />
          </View>
        );
      case "3":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-6 w-6 bg-white`}
          >
            <PlatinumIcon />
          </View>
        );
      case "4":
        return (
          <View
            style={tw`flex items-center justify-center rounded-full h-6 w-6 bg-white`}
          >
            <DiamondIcon />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-col items-center justify-between px-4 pt-8 my-4`}>
      <Image
        source={Ellipse3}
        style={tw`absolute w-[400px] h-[400px] top-[-32px] left-0`}
      />
      <Image
        source={Ellipse4}
        style={tw`absolute w-[400px] h-[400px] right-0 top-[-4]`}
      /><Image source={{ uri: avatar }} style={tw`w-16 h-16 rounded-full`} />
      <Text style={tw`mt-2 font-bold text-2xl`}>{userName}</Text>
      <View
        style={tw`flex flex-row items-center ${bgColor} px-1 rounded-full mt-2 gap-2 h-8`}
      >
        {renderIcon()}
        <Text style={tw`font-semibold text-lg text-white pr-2`}>{planName} Plan</Text>
      </View>
    </View>
  );
};

const SubscriptionPlanButton = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push("/subscription-plan.screen")}
      style={tw`bg-white rounded-lg border-2 border-white`}
    >
      <ImageBackground
        source={SubscriptionBackground}
        style={tw`w-full h-16 rounded-lg overflow-hidden`}
        imageStyle={tw`rounded-lg`}
      >
        <View style={tw`flex items-center justify-center h-full`}>
          <Image source={Logo} style={tw`absolute left-6 h-12 w-12`} />
          <Text style={tw`text-center text-xl font-bold text-white`}>
            Subscription Plan
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const NavigateButton = ({
  to,
  icon,
  title,
}: {
  to: string;
  icon: string;
  title: string;
}) => {
  return (
    <TouchableOpacity
      style={tw`flex flex-row items-center justify-between bg-white`}
      onPress={() => router.push(to as any)}
    >
      <View style={tw`flex flex-row items-center gap-2`}>
        {icon === "children" && <ChildrenIcon />}
        {icon === "statistic" && <StatisticIcon />}
        <Text style={tw`text-xl font-light`}>{title}</Text>
      </View>
      <ArrowNext />
    </TouchableOpacity>
  );
};

const LogOutButton = () => {
  return (
    <TouchableOpacity
      style={tw`w-full h-12 flex flex-row mt-6 gap-2 items-center justify-center bg-white rounded-xl`}
      onPress={() => {
        AsyncStorage.clear();
        router.replace("/login.screen");
      }}
    >
      <LogoutIcon />
      <Text style={tw`text-center text-xl font-normal text-cyan-600`}>
        Log Out
      </Text>
    </TouchableOpacity>
  );
};

export default function AccountScreen() {
  return (
    <View style={tw``}>
      <UserCenter />
      <View style={tw`p-4`}>
        <SubscriptionPlanButton />
        <Text style={tw`text-xl font-semibold pt-8`}>Children Management</Text>
        <View style={tw`flex flex-col mt-2 p-4 bg-white gap-4 rounded-xl`}>
          <NavigateButton
            to="/children.screen"
            icon="children"
            title="Children management"
          />
          <View style={tw`h-[0.5px] bg-neutral-600`}></View>
          <NavigateButton
            to="/statistic.screen?mode=EDIT"
            icon="statistic"
            title="Children statistic"
          />
        </View>
        <Text style={tw`text-xl font-semibold pt-4`}>Account Management</Text>
        <View style={tw`flex flex-col mt-2 p-4 bg-white gap-4 rounded-xl`}>
          <NavigateButton
            to="/purchase-history.screen"
            icon="profile"
            title="Purchase management"
          />
          <View style={tw`h-[0.5px] bg-neutral-600`}></View>
          <NavigateButton
            to="/activation.screen"
            icon="profile"
            title="Activation management"
          />
        </View>
        <Text style={tw`text-xl font-semibold pt-4`}>Setting</Text>
        <View style={tw`flex flex-col mt-2 p-4 bg-white gap-4 rounded-xl`}>
          <NavigateButton
            to="/profile.screen"
            icon="profile"
            title="Account setting"
          />
          <View style={tw`h-[0.5px] bg-neutral-600`}></View>
          <NavigateButton
            to="/policies.screen"
            icon="profile"
            title="Policies"
          />
        </View>
        <LogOutButton />
        <Text style={tw`text-right pt-2 text-sm font-light`}>
          Version: 1.0.45
        </Text>
      </View>
    </View>
  );
}
