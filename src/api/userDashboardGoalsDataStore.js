import { create } from "zustand";
import { fetchUserGoalsData } from "@api/dashboardDataApi.js"; // Assume axios is used for API requests

const useUserDashboardGoalsDataStore = create((set) => ({
  selectedPeriod: "THIS_MONTH", // Default to "This Month"
  selectedMonth: new Date().getMonth() + 1, // Current month (1-12)
  selectedYear: new Date().getFullYear(), // Current year
  periodData: null, // Data for the selected period
  loading: false, // Loading state
  error: null, // Error state

  setPeriod: (period, month, year) => set({ selectedPeriod: period, selectedMonth: month, selectedYear: year }),

  fetchPeriodData: async (month, year) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchUserGoalsData({ month, year });
      set({ periodData: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useUserDashboardGoalsDataStore;
