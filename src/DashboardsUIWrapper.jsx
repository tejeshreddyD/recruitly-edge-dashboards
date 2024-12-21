import { ConfigProvider } from "antd";

import DashboardsUI from "./DashboardsUI.jsx";
import styleToken from "./styleToken.js";
/*
NOTE: DO NOT ALTER THIS FILE. Please start from DashboardsUI.jsx
 */
const DashboardsUIWithProvider = (props) => (
  <ConfigProvider theme={styleToken}>
    <DashboardsUI {...props} />
  </ConfigProvider>
);

const DashboardsUIWrapper = ({ apiServer, apiKey, userId, tenantId , dashboardId}) => {

  console.log("Initializing DashboardsUIWrapper");

  return (
    <DashboardsUIWithProvider
      {...{
        apiServer,
        apiKey,
        userId,
        tenantId,
        dashboardId
      }}
    />
  );
};

window.DashboardsUI = DashboardsUIWithProvider;

export default DashboardsUIWrapper;
