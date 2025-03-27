import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axiosInstance";
import { LoginResponse } from "@/models/LoginResponse.model";

interface AuthService {
  signup(username: string, email: string, password: string): Promise<boolean>;    
  login(email: string, password: string): Promise<LoginResponse | null>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

class AuthServiceImpl implements AuthService {
  private readonly tokenKey = "authToken";
  private readonly userKey = "user";

  async login(email: string, password: string): Promise<LoginResponse | null> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem(this.tokenKey, response.data.token);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Login failed", error);
      return null;
    }
  }

  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const response = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem(this.tokenKey, response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.tokenKey);
    await AsyncStorage.removeItem(this.userKey);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(this.tokenKey);
    return token !== null;
  }
}

const authService: AuthService = new AuthServiceImpl();
export default authService;