import { useEffect, useState } from "react";
import { Alert, Card, Flex, Segmented } from "antd";
import { BsFunnel } from "react-icons/bs";
import { RiFocus2Line } from "react-icons/ri";

import useUserPlannerDashboardStore from "@api/userDashboardPlannerStore.js";
import DayTimeline from "@components/userpriority/DayTimeline.jsx";
import PlannerDrillDownModal from "@components/userpriority/drilldown/PlannerDrillDownModal.jsx";
import { aggregateData, categorizeData } from "@components/userpriority/util/plannerUtil.js";
import { Spinner } from "@phosphor-icons/react";

const CardUserPriority = () => {
  const { data, loading, error, fetchUserPlannerData } = useUserPlannerDashboardStore();

  const [selectedPlannerType, setSelectedPlannerType] = useState("ALL");
  const [showPlannerDetail, setShowPlannerDetail] = useState(false);
  const [detailViewType, setDetailViewType] = useState({title:'',date:0});
  const [filteredPlanner, setFilteredPlanner] = useState([]);

  useEffect(() => {
    fetchUserPlannerData();
  }, []);


  useEffect(() => {
    if (data && data.tasks) {

      const aggregated_data = aggregateData(data, selectedPlannerType);

      const categorizedData = categorizeData(aggregated_data);

      setFilteredPlanner(categorizedData);
    }
  }, [data, selectedPlannerType]);


  const onDetailViewClose = () => {
    setShowPlannerDetail(false);
  };

  const onShowPlannerDetail = ({ title, date, view_type }) => {
    setShowPlannerDetail(true);
    setDetailViewType({ title, date,view_type });
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
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
          backgroundImage: "url('https://recruitlycdn.com/edge/plannerbg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "none",
        }}
        styles={{ header: { borderBottom: "none", fontSize: 18 } }}
        title={
          <Flex gap={1} align={"center"} justify={"flex-start"}>
            <span>
              <RiFocus2Line style={{ marginRight: 8 }} />
              Week Planner
            </span>
          </Flex>
        }>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
            padding: "16px",
            whiteSpace: "nowrap",
          }}
        >{loading ? <Flex
            gap={8}
            style={{
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <Spinner
              size={40}
              style={{
                color: "#1890ff",
                animation: "spin 1s linear infinite",
              }}
            />
            <div>
              <h4 style={{ fontWeight: "normal", fontSize: "1rem", margin: 0 }}>
                Organizing your planner
              </h4>
            </div>
          </Flex>
          : error ? <Alert message="Error loading data" type="error" /> : filteredPlanner.map((data) => (
            <DayTimeline title={data.date} date={data.dayTimestamp} key={data.date} color="" items={data.items} showDetailView={onShowPlannerDetail} />
          ))}
        </div>
      </Card>
      <PlannerDrillDownModal modalVisible={showPlannerDetail} type={detailViewType.title} date={detailViewType.date} filterType={selectedPlannerType} viewType={detailViewType.view_type} onDetailViewClose={onDetailViewClose} />
    </div>
  );
};

export default CardUserPriority;
