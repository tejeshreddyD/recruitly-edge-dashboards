import { ConfigProvider } from "antd";
import styleToken from "./styleToken.js";
import DashboardsUI from "./DashboardsUI.jsx";
import { initializeApiManager } from "@api/apiManager.js";

/*
NOTE: DO NOT ALTER THIS FILE. Please start from DashboardsUI.jsx
 */
const DashboardsUIWithProvider = (props) => (
  <ConfigProvider theme={styleToken}>
    <DashboardsUI {...props} />
  </ConfigProvider>
);

const DashboardsUIWrapper = ({ apiServer, apiKey, userId, tenantId }) => {

  console.log("Initializing DashboardsUIWrapper");

  initializeApiManager(apiKey);

  return (
    <DashboardsUIWithProvider
      {...{
        apiServer,
        apiKey,
        userId,
        tenantId
      }}
    />
  );
};

window.DashboardsUI = DashboardsUIWithProvider;

export default DashboardsUIWrapper;
