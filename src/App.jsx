import React from "react";
import DashboardsUIWrapper from "./DashboardsUIWrapper.jsx";

const App = ({
                 apiServer = "https://api.edge.recruitly.io",
                 apiKey = "HIRE8895B6BFC61A414A44D4AEE8179F5691AE1D",
                 tenantId = "334fbbc8-6ab1-49d1-bede-5ead2a0b1a56",
                 userId = "e86dbb54-030a-4701-879e-bec35655106d"
             }) => {
    return <DashboardsUIWrapper apiServer={apiServer} apiKey={apiKey} tenantId={tenantId} userId={userId}/>;
};

export default App;

