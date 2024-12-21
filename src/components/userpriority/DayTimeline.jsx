import { useState } from "react";
import { Card, Flex, Timeline, Typography } from "antd";
import { FaPhone, FaTasks } from "react-icons/fa";
import { GrExpand } from "react-icons/gr";
import { RiCalendarView } from "react-icons/ri";

import { FaMeetup } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { MdAlarm } from "react-icons/md";

const {Text} = Typography;

const DailyTimeline = ({ title = "Today", color = "#f0f6ff", items }) => {

  const [isHovered, setIsHovered] = useState(false);

  const timelineItems = items.map((item) => ({
    children: (
      <Flex flex={1} direction="column">
        <Text style={{fontWeight:500, marginRight:1}}>{item.time}</Text> - <Text style={{marginLeft:1}}>Follow-up {item.count} {item.type}</Text>
      </Flex>
    ),
    dot:getTypeIcon(item.type),
  }));


  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      extra={
        <GrExpand
          style={{
            color: "#000",
            cursor: "pointer",
            display: isHovered ? "inline-block" : "none",
            transition: "opacity 0.3s"
          }}
        />
      }
      title={
        <Flex direction="row" align={"center"} justify={"start"} gap={"small"}>
          <RiCalendarView />
          <span>{title}</span>
        </Flex>
      }
      styles={{ header: { borderBottom: 0 } }}
      style={{ backgroundColor: `${color}`, width: "350px", overflow: "wrap", marginBottom: 10 }}>
      <Timeline items={timelineItems} mode="left" style={{ margin: "20px 0" }}>
      </Timeline>
    </Card>
  );
};

export default DailyTimeline;

function getTypeIcon(type) {
  switch (type) {
    case "Task":
      return <FaTasks />;
    case "CALL":
      return <FaPhone />;
    case "MEETING":
      return <FaMeetup />;
    case "APPLICATION":
      return <CgWebsite />;
    default:
      return <MdAlarm />;
  }
}


