import CardGoals from "@components/CardGoals.jsx";
import { RECRUITLY_AGGRID_LICENSE } from "@constants";
import { LicenseManager } from 'ag-charts-enterprise';

const DashboardsUI = ({ apiServer = "", apiKey = "", tenantId = "", userId = "" }) => {

  LicenseManager.setLicenseKey(RECRUITLY_AGGRID_LICENSE);

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
