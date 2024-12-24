import { create } from "zustand";
import { fetchUserGoalsData, fetchUserGoalsDataByQuarter, fetchUserGoalsDataByYear } from "@api/dashboardDataApi.js";

const useUserDashboardGoalsDataStore = create((set) => ({
  selectedPeriod: "THIS_MONTH", // Default to "This Month"
  selectedMonth: new Date().getMonth() + 1, // Current month (1-12)
  selectedYear: new Date().getFullYear(), // Current year
  selectedQuarter: "CURRENT_QUARTER", // Default quarter
  periodData: [], // Data for the selected period
  loading: false, // Loading state
  error: null, // Error state

  setPeriod: (period, month, year, quarter) =>
    set({ selectedPeriod: period, selectedMonth: month, selectedYear: year, selectedQuarter: quarter }),

  fetchPeriodDataByMonth: async (month, year) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchUserGoalsData({ month, year });
      set({ periodData: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPeriodDataByQuarter: async (quarterCode, trackAssigned = false) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchUserGoalsDataByQuarter({ quarterCode, trackAssigned });
      set({ periodData: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPeriodDataByYear: async (year, trackAssigned = false) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchUserGoalsDataByYear({ year, trackAssigned });
      set({ periodData: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useUserDashboardGoalsDataStore;
