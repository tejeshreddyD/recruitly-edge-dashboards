import { create } from "zustand";

import { fetchUserPlannerStats } from "../api/dashboardDataApi.js";

const useUserPlannerDashboardStore = create((set, getState) => ({
  data: [],
  loading: false,
  error: null,

  fetchUserPlannerData: async () => {
    if (!getState().loading) {
      set({ loading: true, error: null });
      try {
        const data = await fetchUserPlannerStats();
        set({ data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },
}));

export default useUserPlannerDashboardStore;
