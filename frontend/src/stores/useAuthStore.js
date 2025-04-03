import { create } from "zustand";
import axios from "../lib/axios"; 
import { toast } from "react-hot-toast";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  fetchingProfile : true,

  login: async (email, password) => {
    set({ loading: true});
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Login successful!");
    } catch (error) {
        set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  signup: async (name, email, password, role) => {
    set({ loading: true});
    try {
      const res = await axios.post("/auth/signup", { name, email, password, role });
      set({ user: res.data, loading: false });
      toast.success("Signup successful!");
    } catch (error) {
        set({ loading: false });
      toast.error(error.response?.data?.message || "Signup failed");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout", {},);
      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  fetchProfile: async () => {
    try {
      console.log("fetching profile");
      const res = await axios.get("/auth/profile");
      console.log(res.data);
      set({ user: res.data, fetchingProfile: false });
    } catch (error) {
      set({ user: null, fetchingProfile: false });
    }
  },
}));

export default useAuthStore;
