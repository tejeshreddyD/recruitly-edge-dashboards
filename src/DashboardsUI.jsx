import CardGoals from "@components/goals/CardGoals.jsx";
import { RECRUITLY_AGGRID_LICENSE } from "@constants";
import { LicenseManager as LicenseManagerGrid } from "ag-grid-enterprise";
import { LicenseManager as LicenseManagerCharts } from "ag-charts-enterprise";

LicenseManagerGrid.setLicenseKey(RECRUITLY_AGGRID_LICENSE);
LicenseManagerCharts.setLicenseKey(RECRUITLY_AGGRID_LICENSE);

const DashboardsUI = ({ apiServer = "", apiKey = "", tenantId = "", userId = "" }) => {

  return (
    <div style={{
      height: "100vh",
      overflowY: "auto",
      padding: 16,
      boxSizing: "border-box"
    }}>
      <CardGoals title={"Hellp"} description={"Desc"} />
    </div>
  );
};

export default DashboardsUI;
