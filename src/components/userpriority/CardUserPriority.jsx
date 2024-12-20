import { useEffect, useRef, useState } from "react";
import { Alert, Card, Flex, Grid, Modal, Segmented, Spin } from "antd";
import { CgWebsite } from "react-icons/cg";
import { FaMicrophoneAlt, FaRegCalendar, FaTasks } from "react-icons/fa";
import { MdAlarm, MdOutlinePendingActions } from "react-icons/md";
import { RiFocus2Line } from "react-icons/ri";
import Sortable from "sortablejs";

import TileItem from "@components/userpriority/TileItem.jsx";
import PriorityChart from "@components/userpriority/PriorityChart.jsx";
import DayTimeline from "@components/userpriority/DayTimeline.jsx";
import { BsFunnel } from "react-icons/bs";

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

  const containerRef = useRef(null);
  const screens = useBreakpoint();
  const [isDrillDownModalVisible, setDrillDownModalVisible] = useState(false);
  const [drillDownContent, setDrillDownContent] = useState(null);
  const [isDrillDownLoading, setIsDrillDownLoading] = useState(false);
  const [drillDownError, setDrillDownError] = useState(null);

  useEffect(() => {
    const sortable = Sortable.create(containerRef.current, {
      animation: 150,
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex) return;
        const updatedData = Array.from(data);
        const [movedItem] = updatedData.splice(oldIndex, 1);
        updatedData.splice(newIndex, 0, movedItem);

        setData(updatedData);
      }
    });

    // Cleanup on unmount
    return () => sortable.destroy();
  }, [data]);

  // Function to handle modal close
  const handleModalClose = () => {
    setDrillDownModalVisible(false);
  };

  return (
    <>
      <Card
        extra={
        <Flex  direction="row" align={"center"} justify={"start"} gap={"small"}>
          <BsFunnel/>
          <Segmented
            options={["Interviews", "New Starters", "Meetings","Invoice Due"]}
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
          <div
            ref={containerRef}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            {data.map((item) => (
              <div
                key={item.id}
                style={{
                  width: screens.md ? "225px" : "100%" // Full width if md is false (xs/sm), otherwise fixed width
                }}
              >
                <TileItem title={item.title} icon={item.icon} description={item.description} />
              </div>
            ))}
          </div>
          <PriorityChart />
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
    </>
  );
};

export default CardUserPriority;