
import {create} from "zustand";

import { fetchUserPlannerData } from "../api/dashboardDataApi.js";

const useUserPlannerDashboardStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchUserPlannerData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchUserPlannerData();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUserPlannerDashboardStore;
