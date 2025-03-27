import { useEffect, useState } from "react";
import { getUserData } from "@/utils/storage.util";
import { User } from "@/models/User.model";

const useAsyncStoredUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserData();
      setUser(userData);
    };

    fetchUser();
  }, []);

  return user;
};

export default useAsyncStoredUser;
