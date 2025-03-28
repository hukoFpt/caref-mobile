import { getOrderData } from "./storage.util";
import { Order } from "../models/Order.model";

export async function getBadge(): Promise<string> {
  try {
    const orders: Order[] = await getOrderData();

    if (!orders || orders.length === 0) {
      return "Free";
    }

    const highestServiceCode = orders
      .map((order) => parseInt(order.serviceCode, 10))
      .reduce((max, code) => Math.max(max, code), 0);

    return highestServiceCode.toString();
  } catch (error) {
    console.error("Error retrieving badge:", error);
    return "Free";
  }
}