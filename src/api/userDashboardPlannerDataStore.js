import { create } from "zustand";

import { fetchUserPlannerStats, fetchUserPlannerTasksByDate } from "../api/dashboardDataApi.js";

const useUserPlannerDataStore = create((set, getState) => ({
  data: [],
  loading: false,
  error: null,
  fetchUserPlannerTasksData: async ({start_date, end_date}) => {

    if (!getState().loading) {

      set({ loading: true, error: null });
      try {
        const data = await fetchUserPlannerTasksByDate({start_date, end_date});
        set({ data:data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  }
}));

export default useUserPlannerDataStore;
