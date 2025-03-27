import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectedChild from "@/models/SelectedChild.model";

export const useSelectedChild = () => {
  const [selectedChild, setSelectedChild] = useState<SelectedChild | null>(null);

  useEffect(() => {
    const fetchSelectedChild = async () => {
      try {
        const childData = await AsyncStorage.getItem("selectedChild");
        if (childData) {
          setSelectedChild(JSON.parse(childData) as SelectedChild);
        }
      } catch (error) {
        console.error("Failed to fetch selected child:", error);
      }
    };

    fetchSelectedChild();
  }, []);

  return selectedChild;
};