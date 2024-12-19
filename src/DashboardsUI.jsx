import CardGoals from "@components/CardGoals.jsx";

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
