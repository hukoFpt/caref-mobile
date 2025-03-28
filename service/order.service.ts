import { Order } from "@/models/Order.model";
import axiosInstance from "../utils/axiosInstance";

interface OrderService {
  createOrder(orderData: { serviceId: string }): Promise<any>;
  getMemberOrder(): Promise<Order[]>;
}

class OrderServiceImpl implements OrderService {
  private readonly API_URL = "/orders";

  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await axiosInstance.post(
        `${this.API_URL}/mobile-order`,
        orderData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getMemberOrder(): Promise<Order[]> {
    const serviceMapping: {
      [key: string]: { serviceName: string; serviceCode: string };
    } = {
      "67b80c3cab3ae0219cebe25b": {
        serviceName: "Sprout Package",
        serviceCode: "1",
      },
      "67b80f1c611dc0ee536ab72f": {
        serviceName: "Bloom Package",
        serviceCode: "2",
      },
      "67b80f4b611dc0ee536ab732": {
        serviceName: "Thrive Package",
        serviceCode: "3",
      },
      "67b80f75611dc0ee536ab735": {
        serviceName: "Peak Package",
        serviceCode: "4",
      },
    };

    try {
      const response = await axiosInstance.get(`${this.API_URL}/member`);
      const orders = response.data;

      // Map over the orders and replace serviceId with serviceName and serviceCode
      const updatedOrders = orders.map((order: any) => {
        const serviceDetails = serviceMapping[order.serviceId];
        return {
          ...order,
          serviceName: serviceDetails?.serviceName || "Unknown Service",
          serviceCode: serviceDetails?.serviceCode || "Unknown Code",
        };
      });

      return updatedOrders;
    } catch (error) {
      console.error("Error fetching member orders:", error);
      throw error;
    }
  }
}

const orderService: OrderService = new OrderServiceImpl();
export default orderService;
