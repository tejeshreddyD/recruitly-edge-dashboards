import { create } from "zustand";

import { fetchPipelineStatuses } from "../api/dashboardDataApi.js";

const useUserDashboardJobsStore = create((set, getState) => ({
  data: [],
  loading: false,
  error: null,
  fetchPipelineStatuses: async () => {

    if (!getState().loading) {

      set({ loading: true, error: null });
      try {
        const data = await fetchPipelineStatuses();
        set({ data:data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  }
}));

export default useUserDashboardJobsStore;
