import { ConfigProvider } from "antd";
import styleToken from "./styleToken.js";
import DashboardsUI from "./DashboardsUI.jsx";

/*
NOTE: DO NOT ALTER THIS FILE. Please start from DashboardsUI.jsx
 */
const DashboardsUIWithProvider = (props) => (
  <ConfigProvider theme={styleToken}>
    <DashboardsUI {...props} />
  </ConfigProvider>
);

const DashboardsUIWrapper = ({ apiServer, apiKey, userId, tenantId }) => {

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
