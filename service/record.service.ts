import axiosInstance from "../utils/axiosInstance";
import { Record } from "@/models/Record.model";
import { Order } from "@/models/Order.model";

interface RecordService {
  activateRecord(requestData: {
    recordId: string;
    childId: string;
  }): Promise<any>;
  deactivateRecord(requestData: {
    recordId: string;
  }): Promise<any>;
  getRecords(): Promise<Record[]>;
}

class RecordServiceImpl implements RecordService {
  private readonly API_URL = "/records";

  async activateRecord(requestData: {
    recordId: string;
    childId: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.put(
        `${this.API_URL}/activate`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error activating record:", error);
      throw error;
    }
  }

  async deactivateRecord(requestData: {
    recordId: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.put(
        `${this.API_URL}/deactivate`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error deactivating record:", error);
      throw error;
    }
  }

  async getRecords(): Promise<Record[]> {
    try {
      const response = await axiosInstance.get(this.API_URL);
  
      // Service mapping for serviceId to serviceName and serviceCode
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
  
      const records = response.data.data.map((record: any) => {
        const { OrderId, __v, ...rest } = record;
  
        const serviceDetails = serviceMapping[OrderId.serviceId] || {
          serviceName: "Unknown Service",
          serviceCode: "N/A",
        };
  
        const transformedOrder: Order = {
          _id: OrderId._id,
          memberId: OrderId.memberId,
          serviceName: serviceDetails.serviceName, 
          serviceCode: serviceDetails.serviceCode, 
          status: OrderId.status,
          orderCode: OrderId.orderCode,
          amount: OrderId.amount,
          description: OrderId.description,
          createdAt: OrderId.createdAt,
        };
  
        return {
          ...rest,
          Order: transformedOrder, // Rename and transform OrderId to Order
        };
      });
  
      return records as Record[];
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  }
}

const recordService: RecordService = new RecordServiceImpl();
export default recordService;