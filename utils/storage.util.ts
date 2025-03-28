import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedChild } from "@/models/SelectedChild.model";
import { User } from "@/models/User.model";
import { Order } from "@/models/Order.model";

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

export const getChildrenData = async () => {
  const children = await AsyncStorage.getItem("children");
  return children ? JSON.parse(children) : [];
};

export const saveSelectedChild = async (
  child: SelectedChild,
  records: any[]
) => {
  // Find the record that matches the child's _id
  const matchingRecord = records.find((record) => record.ChildId === child._id);

  // If a matching record is found, add the recordId to the child object
  if (matchingRecord) {
    child.recordId = matchingRecord._id; // Add the recordId field to the selected child
  } else {
    console.warn("No matching record found for the selected child.");
  }

  // Save the updated child object to AsyncStorage
  await AsyncStorage.setItem("selectedChild", JSON.stringify(child));
};

export const getSelectedChild = async () => {
  const child = await AsyncStorage.getItem("selectedChild");
  return child ? JSON.parse(child) : null;
};

export const getOrderData = async (): Promise<Order[]> => {
  const orders = await AsyncStorage.getItem("orders");
  return orders ? JSON.parse(orders) : [];
};

export const saveRecordsData = async (records: any[]) => {
  await AsyncStorage.setItem("records", JSON.stringify(records));
};

export const getRecordsData = async () => {
  const records = await AsyncStorage.getItem("records");
  return records ? JSON.parse(records) : [];
};
