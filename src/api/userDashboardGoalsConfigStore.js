import { create } from "zustand";

import { fetchUserGoalsConfig } from "../api/dashboardDataApi.js";

const useUserDashboardGoalsConfigStore = create((set, getState) => ({
  configData: [],
  loading: false,
  error: null,
  fetchConfig: async ({ dashboardId }) => {
    if (!getState().loading) {
      set({ loading: true, error: null });
      try {
        const response = await fetchUserGoalsConfig({ dashboardId });
        set({ configData:response.data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  }
}));

export default useUserDashboardGoalsConfigStore;
