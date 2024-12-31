import { create } from "zustand";

import { fetchPipelineForecastData, fetchPipelineStatuses } from "../api/dashboardDataApi.js";

const useUserDashboardJobsStore = create((set, getState) => ({
  data: [],
  forecastData:[],
  loading: false,
  forecastloading:false,
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
  },
  fetchPipelineForecastData: async () => {

    if (!getState().forecastloading) {

      set({ forecastloading: true, error: null });
      try {
        const data = await fetchPipelineForecastData();
        set({ forecastData:data.data, forecastloading: false });
      } catch (error) {
        set({ error: error.message, forecastloading: false });
      }
    }
  }
}));

export default useUserDashboardJobsStore;
