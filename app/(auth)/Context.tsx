"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/Api_instance/api";

// TYPES 
type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "student" | "hotel";
  isloggingIn?: boolean;
  createdAt?: string;
  mealsOrdered?: string[];
  preBookedMeals?: string[];
  pin?: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: "student" | "hotel";
  isloggingIn: boolean;
};

type AuthContextType = {
  user: User | null;
  updateUser: (data: Partial<User>) => void; 
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
};


//  CONTEXT 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("bitehub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN 
const login = async (email: string, password: string) => {
  try {

    // CHECK STUDENTS
    const studentRes = await api.get<User[]>(`/users?email=${email}`);

    if (studentRes.data.length > 0) {

      const foundStudent = studentRes.data[0];

      if (foundStudent.password !== password) {
        return { success: false, message: "Incorrect password!" };
      }

      localStorage.setItem("bitehub_user", JSON.stringify(foundStudent));
      setUser(foundStudent);

      await api.patch(`/users/${foundStudent.id}`, { isloggingIn: true });

      router.push("/studentHome");

      return { success: true };
    }

    // CHECK HOTELS
    const hotelRes = await api.get<any[]>(`/restaurants?email=${email}`);

    if (hotelRes.data.length > 0) {

      const foundHotel = hotelRes.data[0];

      if (foundHotel.password !== password) {
        return { success: false, message: "Incorrect password!" };
      }

      localStorage.setItem("bitehub_user", JSON.stringify(foundHotel));
      setUser(foundHotel);

      await api.patch(`/restaurants/${foundHotel.id}`, { isloggingIn: true });

      router.push("/HotelDashboard");

      return { success: true };
    }

    return { success: false, message: "User not found!" };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Login failed!" };
  }
};

  //  REGISTER 
  const register = async (formData: RegisterData) => {
    try {
      if (formData.password.length < 6) {
        return { success: false, message: "Password too short!" };
      }

      const checkUser = await api.get<User[]>(`/users?email=${formData.email}`);
      if (checkUser.data.length > 0) {
        return { success: false, message: "User already exists!" };
      }

      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        isloggingIn: true,
        mealsOrdered :[],
        preBookedMeals: []
      };

      await api.post("/users", newUser);

      localStorage.setItem("bitehub_user", JSON.stringify(newUser));
      setUser(newUser);

      newUser.role === "hotel"
        ? router.push("/hotel-dashboard")
        : router.push("/studentHome");

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Registration failed!" };
    }
  };

  //  LOGOUT 
const logout = async () => {
  if (user) {
    try {

      if (user.role === "hotel") {
        await api.patch(`/restaurants/${user.id}`, { isloggingIn: false });
      } else {
        await api.patch(`/users/${user.id}`, { isloggingIn: false });
      }

    } catch (err) {
      console.error(err);
    }
  }

  localStorage.removeItem("bitehub_user");
  setUser(null);
  router.push("/");
};

  const updateUser = (data: Partial<User>) => {
  if (!user) return;

  const updated = { ...user, ...data };
  setUser(updated);
  localStorage.setItem("bitehub_user", JSON.stringify(updated));
};

  return (
<AuthContext.Provider
  value={{
    user,
    updateUser,  
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with safety check
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
