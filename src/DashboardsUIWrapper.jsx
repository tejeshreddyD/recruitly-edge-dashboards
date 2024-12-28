import { ConfigProvider } from "antd";

import MyDashboardUI from "./MyDashboardUI.jsx";
import styleToken from "./styleToken.js";
/*
NOTE: DO NOT ALTER THIS FILE. Please start from MyDashboardUI.jsx
 */
const DashboardsUIWithProvider = (props) => (
  <ConfigProvider theme={styleToken}>
    <MyDashboardUI {...props} />
  </ConfigProvider>
);

const DashboardsUIWrapper = ({ apiServer, apiKey, userId, tenantId, dashboardId }) => {

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

window.MyDashboardUI = DashboardsUIWithProvider;

export default DashboardsUIWrapper;
