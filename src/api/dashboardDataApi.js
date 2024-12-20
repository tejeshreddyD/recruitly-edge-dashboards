
import { getApiManager } from "@api/apiManager.js";


export const fetchUserPlannerData = async () => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get("/dashboards/users/planner");
    return response
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error("Failed to fetch data. Please try again.");
  }
};
