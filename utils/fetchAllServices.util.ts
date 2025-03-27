import AsyncStorage from "@react-native-async-storage/async-storage";
import childService from "@/service/child.service";
import recordService from "@/service/record.service";

export const fetchAllServices = async () => {
  try {
    // Fetch children data
    const children = await childService.getChildren();
    await AsyncStorage.setItem("children", JSON.stringify(children));

    // Set the first child as the default selected child
    if (children.length > 0) {
      await AsyncStorage.setItem("selectedChild", JSON.stringify(children[0]));
    }
  } catch (error) {
    console.error("Failed to fetch services:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};