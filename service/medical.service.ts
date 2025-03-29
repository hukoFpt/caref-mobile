import axios from "axios";

const BASE_URL = "https://swd-392-api.vercel.app/api";

interface MedicalService {
  createRequest(
    recordId: string,
    payload: { Reason: string; Notes: string }
  ): Promise<any>;
  getRequest(recordId: string): Promise<any>;
}

class MedicalServiceImpl implements MedicalService {
  async createRequest(
    recordId: string,
    payload: { Reason: string; Notes: string }
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${BASE_URL}/medical-requests/${recordId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating medical request:", error);
      throw error;
    }
  }

  async getRequest(recordId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${BASE_URL}/medical-requests/${recordId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching medical request:", error);
      throw error;
    }
  }
}

export const medicalService: MedicalService = new MedicalServiceImpl();
