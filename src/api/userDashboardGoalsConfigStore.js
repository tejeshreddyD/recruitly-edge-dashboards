import { create } from "zustand";
import { fetchUserGoalsConfig, saveUserGoalsConfig } from "../api/dashboardDataApi.js";

const useUserDashboardGoalsConfigStore = create((set, getState) => ({
  configData: [],
  loading: false,
  error: null,

  // Fetch configuration from the server
  fetchConfig: async ({ dashboardId }) => {
    if (!getState().loading) {
      set({ loading: true, error: null });
      try {
        const response = await fetchUserGoalsConfig({ dashboardId });
        set({ configData: response.data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },

  // Save selected KPIs to the server
  saveConfig: async ({ dashboardId, selectedKpi }) => {
    if (!getState().loading) {
      set({ loading: true, error: null });
      try {
        const response = await saveUserGoalsConfig({ dashboardId, selectedKpi });
        set((state) => ({
          configData: { ...state.configData, selectedKpi },
          loading: false
        }));
        return response;
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    }
  }
}));

export default useUserDashboardGoalsConfigStore;
