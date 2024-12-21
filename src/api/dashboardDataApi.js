
import { getApiManager } from "@api/apiManager.js";

export const fetchUserPlannerStats = async () => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get("/user_dashboard/planner_stats");
    return response
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};

export const fetchUserGoalsConfig = async ({dashboardId}) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get("/dashboards/user_dashboard/goals_config?dashboardId=" + dashboardId);
    return response
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};
