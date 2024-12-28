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

let queue = Promise.resolve();

export const saveUserGoalsOrder = ({ dashboardId, activityId, newIndex }) => {
  const apiManager = getApiManager();

  queue = queue.then(async () => {
    try {
      const response = await apiManager.post("/user_dashboard/goals_config_order", {
        dashboardId: dashboardId,
        activityId: activityId,
        newIndex: newIndex
      });
      console.log("saveUserGoalsOrder response:", response);
      return response.data;
    } catch (error) {
      console.error("Error saving user goals config:", error.message);
      throw new Error("Failed to save goals configuration. Please try again.");
    }
  });

  return queue;
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

export const fetchUserPlannerTasksByDate = async ({ start_date, end_date }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get(`/tasks/list?start_date=${start_date}&end_date=${end_date}`);
    console.log("fetchUserPlannerTasksByDate ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching planner tasks data for date:", error.message);
    throw new Error("Failed to fetch planner tasks data. Please try again.");
  }
};

export const fetchUserPlannerPendingJobApplications = async ({ page, page_size }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get(`/job_application/pending`);
    console.log("fetchUserPlannerJobApplications", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching planner job applications data for date:", error.message);
    throw new Error("Failed to fetch planner job applications data. Please try again.");
  }
};

export const fetchUserPlannerCalendarEvents = async ({ start_date, end_date, type }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get(`/calendar_event/list?start_date=${start_date}&end_date=${end_date}&type=${type}`);
    console.log("fetchUserPlannerCalendarEvents", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching planner calendar event data", error.message);
    throw new Error("Failed to fetch planner calendar event data. Please try again.");
  }
};

export const fetchUserGoalsRecordData = async ({
                                                 periodCode,
                                                 activityId,
                                                 activityType,
                                                 pageNumber = 0,
                                                 pageSize = 25,
                                                 sortField = "createdOn",
                                                 sortOrder = "desc"
                                               }) => {
  const apiManager = getApiManager();
  try {
    const response = await apiManager.get(`/kpi_record_data?periodCode=${periodCode}&activityId=${activityId}&activityType=${activityType}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`);
    console.log("fetchUserGoalsRecordData", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals record data", error.message);
    throw new Error("Failed to fetch goals record data. Please try again.");
  }
};

