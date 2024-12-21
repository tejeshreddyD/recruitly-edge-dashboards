import { LicenseManager as LicenseManagerCharts } from "ag-charts-enterprise";
import { LicenseManager as LicenseManagerGrid } from "ag-grid-enterprise";

import { initializeApiManager } from "@api/apiManager.js";
import CardGoals from "@components/goals/CardGoals.jsx";
import CardUserPriority from "@components/userpriority/CardUserPriority.jsx";
import { RECRUITLY_AGGRID_LICENSE } from "@constants";

LicenseManagerGrid.setLicenseKey(RECRUITLY_AGGRID_LICENSE);
LicenseManagerCharts.setLicenseKey(RECRUITLY_AGGRID_LICENSE);

const DashboardsUI = ({ apiServer="", apiKey = "", tenantId = "", userId = "" , dashboardId=""}) => {

  try {
    console.log("Initializing DashboardsUI");
    initializeApiManager(apiKey);
  }catch (e) {
    console.error("Failed to init api manager",e);
  }
  
  return (
    <div style={{
      backgroundColor: "#f0f2f5",
      height: "100vh",
      overflowY: "auto",
      padding: 16,
      boxSizing: "border-box"
    }}>
      <CardGoals dashboardId={dashboardId} apiKey={apiKey} apiServer={apiServer} tenantId={tenantId} userId={userId}
                 title={"Help"} description={"Desc"} />
      <CardUserPriority userId={userId} tenantId={tenantId} />
    </div>
  );
};

export default DashboardsUI;
