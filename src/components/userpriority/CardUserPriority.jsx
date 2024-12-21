import { useEffect, useRef, useState } from "react";
import { Alert, Card, Flex, Grid, Modal, Segmented, Spin } from "antd";
import { BsFunnel } from "react-icons/bs";
import { RiFocus2Line } from "react-icons/ri";

import DayTimeline from "@components/userpriority/DayTimeline.jsx";
import useUserPlannerDashboardStore from "@api/userDashboardStore.js";
import { categorizeData } from "@components/userpriority/util/plannerUtil.js";

const CardUserPriority = () => {

  const [isDrillDownModalVisible, setDrillDownModalVisible] = useState(false);

  const { data, loading, error, fetchUserPlannerData } = useUserPlannerDashboardStore();

  useEffect(()=>{
    fetchUserPlannerData();
  },[]);

  if(loading || !data || !data.data){
    return <div>Loading...</div>;
  }

  const updated_data = categorizeData(data.data.data);

  // Function to handle modal close
  const handleModalClose = () => {
    setDrillDownModalVisible(false);
  };

  return (
    <div>
      <Card
        extra={
          <Flex direction="row" align={"center"} justify={"start"} gap={"small"}>
            <BsFunnel />
            <Segmented
              options={["Interviews", "New Starters", "Meetings", "Invoice Due"]}
              onChange={(value) => {
                console.log(value); // string
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
              <DayTimeline title={data.date} key={data.date} color={""} items={data.items}/>
            ))}
          </div>
        </>
      </Card>
      <Modal
        width="80vw"
        style={{ top: 20 }}
        title="Goal Details"
        open={isDrillDownModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
      </Modal>
    </div>
  );
};

export default CardUserPriority;