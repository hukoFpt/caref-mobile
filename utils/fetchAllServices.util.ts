import AsyncStorage from "@react-native-async-storage/async-storage";
import childService from "@/service/child.service";
import recordService from "@/service/record.service";
import orderService from "@/service/order.service";

export const fetchChildrenService = async () => {
  try {
    const children = await childService.getChildren();
    const records = await recordService.getRecords();

    const updatedChildren = children.map((child) => {
      const isActive = records.some((record) => record.ChildId === child._id);
      return { ...child, active: isActive };
    });

    await AsyncStorage.setItem("children", JSON.stringify(updatedChildren));

    const selectedChild = await AsyncStorage.getItem("selectedChild");
    if (!selectedChild && children.length > 0) {
      await AsyncStorage.setItem("selectedChild", JSON.stringify(children[0]));
    }
  } catch (error) {
    console.error("Failed to fetch children service:", error);
    throw error;
  }
};

export const fetchRecordsService = async () => {
  try {
    const records = await recordService.getRecords();
    const updatedRecords = records.map((record) => {
      if (record.Status === "Inactivated") {
        const { ChildId, ExpiredDate, ...rest } = record;
        return rest;
      }
      return record;
    });

    await AsyncStorage.setItem("records", JSON.stringify(updatedRecords));
  } catch (error) {
    console.error("Failed to fetch records service:", error);
    throw error;
  }
};

export const fetchMemberOrderService = async () => {
  try {
    const order = await orderService.getMemberOrder();
    await AsyncStorage.setItem("orders", JSON.stringify(order));
  } catch (error) {
    console.error("Failed to fetch member order service:", error);
    throw error;
  }
};

export const fetchAllServices = async (): Promise<void> => {
  await fetchChildrenService();
  await fetchRecordsService();
  await fetchMemberOrderService();
};
