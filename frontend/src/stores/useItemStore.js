import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useItemStore = create((set) => ({
  items: [],
  item: null,
  loading: false,
 

  // Add a new item (admin only)
  addNewItem: async (newItemData) => {
    set({ loading: true});
    try {
      const res = await axios.post("/items/add", newItemData);
      // Assuming the backend returns the new item in res.data.newItem
      set((state) => ({ items: [...state.items, res.data.newItem], loading: false }));
      toast.success("Item added successfully");
      return res.data.newItem;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to add item";
      set({loading : false});
      toast.error(errMsg);
    }
  },

  // Fetch all items
  getAllItems: async () => {
    set({ loading: true});
    try {
      const res = await axios.get("/items/");
      set({ items: res.data, loading: false });
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to fetch items";
      set({loading : false});
      toast.error(errMsg);
    }
  },

  // Increment the instances of an item (admin only)
  incrementInstances: async (id, additionalQuantity) => {
    set({ loading: true});
    try {
      const res = await axios.post(`/items/inc/${id}`, { additionalQuantity });
      // Update the items list with the updated item from backend
      set((state) => ({
        items: state.items.map((item) => (item._id === id ? res.data.item : item)),
        loading: false,
      }));
      toast.success("Instances incremented successfully");
      return res.data.item;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to increment instances";
      set({loading : false});
      toast.error(errMsg);
    }
  },

  // Fetch a single item by ID
  getItem: async (id) => {
    set({ loading: true});
    try {
      const res = await axios.get(`/items/${id}`);
      set({ item: res.data, loading: false });
      return res.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to fetch item";
      set({loading : false});
      toast.error(errMsg);
    }
  },
}));

export default useItemStore;