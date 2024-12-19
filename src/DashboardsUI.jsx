import CardGoals from "@components/goals/CardGoals.jsx";
import { RECRUITLY_AGGRID_LICENSE } from "@constants";
import { LicenseManager } from 'ag-charts-enterprise';
import CardUserPriority from "@components/userpriority/CardUserPriority.jsx";

const DashboardsUI = ({ apiServer = "", apiKey = "", tenantId = "", userId = "" }) => {

  LicenseManager.setLicenseKey(RECRUITLY_AGGRID_LICENSE);

  return (
    <div style={{
      height: "100vh",
      overflowY: "auto",
      padding: 16,
      boxSizing: "border-box"
    }}>
      <CardGoals title={"Help"} description={"Desc"} />
      <CardUserPriority userId={userId} tenantId={tenantId} />
    </div>
  );
};

export default DashboardsUI;
