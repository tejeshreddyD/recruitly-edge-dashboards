import { create } from "zustand";

const useDashboardGoalsPeriodStore = create((set) => ({
  selectedPeriod: "THIS_MONTH", // Default to "This Month"
  selectedMonth: new Date().getMonth() + 1, // Current month (1-12)
  selectedYear: new Date().getFullYear(), // Current year

  setPeriod: (period, month, year) =>
    set({ selectedPeriod: period, selectedMonth: month, selectedYear: year })
}));

export default useDashboardGoalsPeriodStore;
