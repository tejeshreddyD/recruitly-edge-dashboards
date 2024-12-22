import { useEffect, useState } from "react";
import { Alert, Card, Flex, Segmented } from "antd";
import { BsFunnel } from "react-icons/bs";
import { RiFocus2Line } from "react-icons/ri";

import useUserPlannerDashboardStore from "@api/userDashboardPlannerStore.js";
import DayTimeline from "@components/userpriority/DayTimeline.jsx";
import PlannerDrillDownModal from "@components/userpriority/drilldown/PlannerDrillDownModal.jsx";
import { categorizeData } from "@components/userpriority/util/plannerUtil.js";

const CardUserPriority = () => {
  const { data, loading, error, fetchUserPlannerData } = useUserPlannerDashboardStore();

  const [selectedPlannerType, setSelectedPlannerType] = useState("ALL");
  const [showPlannerDetail, setShowPlannerDetail] = useState(false);
  const [detailViewType, setDetailViewType] = useState(null);
  const [filteredPlanner, setFilteredPlanner] = useState([]);

  // Fetch data once on mount
  useEffect(() => {
    fetchUserPlannerData();
  }, []);

  // Filter planner data whenever `data` or `selectedPlannerType` changes
  useEffect(() => {
    if (data && data.tasks) {
      const categorizedData = categorizeData(data, selectedPlannerType);
      setFilteredPlanner(categorizedData);
    }
  }, [data, selectedPlannerType]);

  // Handle loading and error
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert message="Error loading data" type="error" />;
  }

  if (!filteredPlanner || filteredPlanner.length === 0) {
    return <div>No data available</div>;
  }

  const onDetailViewClose = () => {
    setShowPlannerDetail(false);
  };


  const onShowPlannerDetail = (title) => {
    setShowPlannerDetail(true);
    setDetailViewType(title);
  };

  return (
    <div>
      <Card
        extra={
          <Flex direction="row" align="center" justify="start" gap="small">
            <BsFunnel />
            <Segmented
              options={[
                { label: "All", value: "ALL" },
                { label: "Interviews", value: "INTERVIEWS" },
                { label: "Tasks/Reminders", value: "REMINDER" },
                { label: "Events", value: "EVENTS" },
                { label: "Invoice Due", value: "INVOICE_DUE" },
              ]}
              value={selectedPlannerType}
              onChange={(value) => setSelectedPlannerType(value)}
            />
          </Flex>
        }
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
        styles={{ header: { borderBottom: "none", fontSize: 18 } }}
        title={
          <span>
            <RiFocus2Line style={{ marginRight: 8 }} />
            Planner
          </span>
        }
      >
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
            padding: "16px",
            whiteSpace: "nowrap",
          }}
        >
          {filteredPlanner.map((data) => (
            <DayTimeline
              title={data.date}
              key={data.date}
              color=""
              items={data.items}
              showDetailView={onShowPlannerDetail}
            />
          ))}
        </div>
      </Card>
      <PlannerDrillDownModal
        modalVisible={showPlannerDetail}
        type={detailViewType}
        filterType={selectedPlannerType}
        onDetailViewClose={onDetailViewClose}
      />
    </div>
  );
};

export default CardUserPriority;
