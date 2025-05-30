import React from "react";
import { LicenseManager as LicenseManagerCharts } from "ag-charts-enterprise";
import { LicenseManager as LicenseManagerGrid } from "ag-grid-enterprise";

import { initializeApiManager } from "@api/apiManager.js";
import CardGoals from "@components/goals/CardGoals.jsx";
import CardUserJobs from "@components/jobs/CardUserJobs.jsx";
import CardUserWeekPlanner from "@components/weekplanner/CardUserWeekPlanner.jsx";
import { RECRUITLY_AGGRID_LICENSE } from "@constants";

LicenseManagerGrid.setLicenseKey(RECRUITLY_AGGRID_LICENSE);
LicenseManagerCharts.setLicenseKey(RECRUITLY_AGGRID_LICENSE);

const MyDashboardUI = ({ apiServer="", apiKey = "", tenantId = "", userId = "" , dashboardId=""}) => {

  try {

    console.log("Initializing DashboardsUI");
    initializeApiManager(apiKey);
  }catch (e) {
    console.error("Failed to init api manager",e);
  }

  const isLocal = window.location.hostname.includes("localhost");
  
  return (
    <div style={{
      backgroundColor: "transparent",
      height: isLocal ? "100vh" : "auto",
      overflowY: isLocal ? "auto" : "",
      padding: 0,
      boxSizing: "border-box"
    }}>
      <CardGoals dashboardId={dashboardId} apiKey={apiKey} apiServer={apiServer} tenantId={tenantId} userId={userId}
                 title={"Help"} description={"Desc"} />
      <CardUserWeekPlanner userId={userId} tenantId={tenantId} />
      <CardUserJobs userId={userId} tenantId={tenantId} />
    </div>
  );
};

export default MyDashboardUI;
