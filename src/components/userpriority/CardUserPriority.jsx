import { useEffect, useRef, useState } from "react";
import { Alert, Card, Flex, Grid, Modal, Segmented, Spin } from "antd";
import { BsFunnel } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { FaMicrophoneAlt, FaRegCalendar, FaTasks } from "react-icons/fa";
import { MdAlarm, MdOutlinePendingActions } from "react-icons/md";
import { RiFocus2Line } from "react-icons/ri";

import DayTimeline from "@components/userpriority/DayTimeline.jsx";

const { useBreakpoint } = Grid;

const CardUserPriority = () => {
  const [data, setData] = useState([
    {
      id: "1",
      title: "Job Applications",
      description: "Tile Desc 1",
      icon: <CgWebsite size={18} style={{ marginRight: 4 }} />
    },
    { id: "2", title: "Tasks", description: "Tile Desc 2", icon: <FaTasks size={18} style={{ marginRight: 4 }} /> },
    {
      id: "3",
      title: "Interviews",
      description: "Tile Desc 3",
      icon: <FaMicrophoneAlt size={18} style={{ marginRight: 4 }} />
    },
    {
      id: "4",
      title: "Meetings",
      description: "Calendar Events",
      icon: <FaRegCalendar size={18} style={{ marginRight: 4 }} />
    },
    {
      id: "5",
      title: "Next Actions",
      description: "Tile Desc 5",
      icon: <MdOutlinePendingActions size={18} style={{ marginRight: 4 }} />
    },
    { id: "6", title: "Reminders", description: "Tile Desc 5", icon: <MdAlarm size={18} style={{ marginRight: 4 }} /> }
  ]);

  const [isDrillDownModalVisible, setDrillDownModalVisible] = useState(false);
  const [drillDownContent, setDrillDownContent] = useState(null);
  const [isDrillDownLoading, setIsDrillDownLoading] = useState(false);
  const [drillDownError, setDrillDownError] = useState(null);

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
            <DayTimeline title={"Today"} />
            <DayTimeline title={"Monday 23rd Dec"} color={"white"} />
            <DayTimeline title={"Tuesday 24th Dec"} />
            <DayTimeline title={"Wednesday 25th Dec"} color={"white"} />
            <DayTimeline title={"Thursday 26th Dec"} />
            <DayTimeline title={"Friday 27th Dec"} color={"white"} />
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
        {isDrillDownLoading ? (
          <Spin tip="Loading...">
            <div style={{ minHeight: "100px" }} />
          </Spin>
        ) : drillDownError ? (
          <Alert message={"Failed to load"} type="error" showIcon />
        ) : (
          <div style={{ minHeight: "500px" }}>{drillDownContent}</div>
        )}
      </Modal>
    </div>
  );
};

export default CardUserPriority;