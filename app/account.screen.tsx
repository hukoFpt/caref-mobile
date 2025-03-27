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

const Logo = require("../assets/images/Logo.png");
const Ellipse3 = require("../assets/images/Ellipse-3.png");
const Ellipse4 = require("../assets/images/Ellipse-4.png");
const SubscriptionBackground = require("../assets/images/Subscription.png");

const UserCenter = () => {
  const user = useUser();

  return (
    <View style={tw`flex-col items-center justify-between px-4 pt-8 my-4`}>
      <Image
        source={Ellipse3}
        style={tw`absolute w-[400px] h-[400px] top-[-32px] left-0`}
      />
      <Image
        source={Ellipse4}
        style={tw`absolute w-[400px] h-[400px] right-0 top-[-4]`}
      />
      <Image
        source={{ uri: "https://picsum.photos/150" }}
        style={tw`w-16 h-16 rounded-full`}
      ></Image>
      <Text style={tw`mt-2 font-bold text-2xl`}>{user?.userName}</Text>
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
      style={tw`w-full h-12 flex flex-row gap-2 items-center justify-center bg-white rounded-xl`}
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
            to="/statistic.screen"
            icon="statistic"
            title="Children statistic"
          />
        </View>
        <Text style={tw`text-xl font-semibold pt-4`}>Account Management</Text>

        <LogOutButton />
      </View>
    </View>
  );
}
