import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedChild } from "@/models/SelectedChild.model";
import { User } from "@/models/User.model";

export const saveUserData = async (user: User) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUserData = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const saveChildrenData = async (children: SelectedChild[]) => {
  await AsyncStorage.setItem("children", JSON.stringify(children));
};

export const saveRecordsData = async (records: any[]) => {
  await AsyncStorage.setItem("records", JSON.stringify(records));
};

export const saveSelectedChild = async (child: SelectedChild) => {
  await AsyncStorage.setItem("selectedChild", JSON.stringify(child));
};