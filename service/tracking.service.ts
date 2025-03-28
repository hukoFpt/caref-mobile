import { TrackingRecord } from "@/models/Tracking.model";
import axiosInstance from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TrackingPayload {
  recordId: string;
  date: string;
  growthStats: {
    Height: string;
    Weight: string;
  };
}

interface TrackingService {
  createTracking(payload: TrackingPayload): Promise<any>;
  getMemberTracking(recordId: string): Promise<void>;
}

class TrackingServiceImpl implements TrackingService {
  private readonly API_URL = "/trackings";

  async createTracking(payload: TrackingPayload): Promise<any> {
    try {
      const response = await axiosInstance.post(this.API_URL, payload);
      return response.data;
    } catch (error) {
      console.error("Error creating tracking:", error);
      throw error;
    }
  }

  async getMemberTracking(recordId: string): Promise<void> {
    try {
      // Fetch tracking data from the API
      const response = await axiosInstance.get(
        `${this.API_URL}?recordId=${recordId}`
      );

      const trackingData = response.data;

      // Transform the response into the desired format
      const transformedData: TrackingRecord = {};

      trackingData.forEach((entry: any) => {
        const trackings = entry.Trackings;

        // Initialize the recordId in the transformed data if not already present
        if (!transformedData[recordId]) {
          transformedData[recordId] = {};
        }

        // Add each date's tracking data to the corresponding recordId
        Object.entries(trackings).forEach(([date, tracking]: [string, any]) => {
          transformedData[recordId][date] = {
            height: tracking.Height.toString(),
            weight: tracking.Weight.toString(),
            bmi: tracking.BMI.toString(),
            bmiCategory: tracking.BMIResult,
            updatedDate: date,
          };
        });
      });

      // Save the transformed data to AsyncStorage
      await AsyncStorage.setItem("trackings", JSON.stringify(transformedData));
      console.log("Trackings saved successfully:", transformedData);
    } catch (error) {
      console.error("Error fetching member tracking:", error);
      throw error;
    }
  }
}

export default new TrackingServiceImpl();
