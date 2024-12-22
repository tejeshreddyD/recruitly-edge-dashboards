import { useEffect, useRef, useState } from "react";
import { Alert, Card, Flex, Grid, Modal, Segmented, Spin } from "antd";
import { BsFunnel } from "react-icons/bs";
import { RiFocus2Line } from "react-icons/ri";

import DayTimeline from "@components/userpriority/DayTimeline.jsx";
import useUserPlannerDashboardStore from "@api/userDashboardPlannerStore.js";
import { categorizeData } from "@components/userpriority/util/plannerUtil.js";
import PlannerDrillDownModal from "@components/userpriority/drilldown/PlannerDrillDownModal.jsx";

const CardUserPriority = () => {

  const { data, loading, error, fetchUserPlannerData } = useUserPlannerDashboardStore();

  const [selectedPlannerType, setSelectedPlannerType] = useState("All");
  const [showPlannerDetail, setShowPlannerDetail] = useState(false);
  const [detailViewType, setDetailViewType] = useState(null);

  useEffect(()=>{
    fetchUserPlannerData();
  },[]);

  if(loading || !data || !data.data){
    return <div>Loading...</div>;
  }

  function onDetailViewClose(){
    setShowPlannerDetail(false);
  }

  const onShowPlannerDetail = (title) => {
    setShowPlannerDetail(true);
    setDetailViewType(title);
  }

  const updated_data = categorizeData(data.data.data);

  return (
    <div>
      <Card
        extra={
          <Flex direction="row" align={"center"} justify={"start"} gap={"small"}>
            <BsFunnel />
            <Segmented
              options={["All","Interviews", "New Starters", "Meetings", "Invoice Due"]}
              value={selectedPlannerType}
              onChange={(value) => {
                console.log(value); // string
                setSelectedPlannerType(value);
              }}
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
        <>
          <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "16px",
            padding: "16px",
            whiteSpace: "nowrap"
          }}>
            {updated_data.map(data => (
              <DayTimeline title={data.date} key={data.date} color={""} items={data.items} showDetailView={onShowPlannerDetail} />
            ))}
          </div>
        </>
      </Card>
      <PlannerDrillDownModal modalVisible={showPlannerDetail} type={detailViewType} filterType={selectedPlannerType} onDetailViewClose={onDetailViewClose} />
     </div>
  );
};

export default CardUserPriority;