import { getApiManager } from "@api/apiManager.js";

export const fetchUserPlannerStats = async () => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get("/user_dashboard/planner_stats");
    return response;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};

export const fetchUserGoalsConfig = async ({ dashboardId }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get("/user_dashboard/goals_config?dashboardId=" + dashboardId);
    console.log("fetchUserGoalsConfig ", response);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};

export const saveUserGoalsConfig = async ({ dashboardId, selectedKpi }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.post("/user_dashboard/goals_config", {
      dashboardId: dashboardId,
      selectedKpi: selectedKpi
    });
    console.log("saveUserGoalsConfig response:", response);
    return response.data;
  } catch (error) {
    console.error("Error saving user goals config:", error.message);
    throw new Error("Failed to save goals configuration. Please try again.");
  }
};


export const fetchUserGoalsData = async ({ month, year }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get("/kpi_user_data_by_month?month=" + month + "&year=" + year);
    console.log("fetchUserGoalsData ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals data:", error.message);
    throw new Error("Failed to fetch goals data. Please try again.");
  }
};

export const fetchUserGoalsDataByQuarter = async ({ quarterCode, trackAssigned = false }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get(`/kpi_user_data_by_quarter?quarter=${quarterCode}&assigned=${trackAssigned}`);
    console.log("fetchUserGoalsDataByQuarter ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals data for quarter:", error.message);
    throw new Error("Failed to fetch goals data for the quarter. Please try again.");
  }
};

export const fetchUserGoalsDataByYear = async ({ year, trackAssigned = false }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get(`/kpi_user_data_by_year?year=${year}&assigned=${trackAssigned}`);
    console.log("fetchUserGoalsDataByYear ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals data for year:", error.message);
    throw new Error("Failed to fetch goals data for the year. Please try again.");
  }
};

