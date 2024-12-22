import { useState } from "react";
import { Card, Flex, Timeline, Typography } from "antd";
import { CgWebsite } from "react-icons/cg";
import { FaMicrophone, FaTasks } from "react-icons/fa";
import { GrExpand } from "react-icons/gr";
import { MdAlarm } from "react-icons/md";
import { RiCalendarView } from "react-icons/ri";
import { CiCalendarDate } from "react-icons/ci";
import { Alarm, PhoneCall } from "@phosphor-icons/react";

const { Text,Link } = Typography;

const DailyTimeline = ({ title = "Today", color = "#f0f6ff", items = [], showDetailView }) => {

  const [isHovered, setIsHovered] = useState(false);

  const timelineItems = items.map((item) => ({
    children: getPlannerText(item),
    dot: getTypeIcon(item.type),
  }));


  const showPlannerDetail = () => {
    showDetailView(title);
  }

  function getPlannerText(item) {
    switch (item.type) {
      case "Task":
        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{item.time}</Text> -{" "}
            <Text>{item.count} Task(s) to complete</Text>
          </div>
        );
      case "CALL":
      case "MEETING":
      case "INTERVIEW":

        { let record_type = 'colleagues';
        const label = item.type === "CALL" ? "Call": item.type === "MEETING" ? "Meeting" : "Interview";

        if (item.attendees && item.attendees.length > 0) {
          const match = item.attendees.find(attendee => attendee.type !== 'UNRECORDED' && attendee.type === 'CONTACT');
          record_type = match ? 'Client' : 'Candidate';
        }

        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{item.time}</Text> -{" "}
            <Text>
              {label} with {record_type}{" "}
              {item.attendees.map((rec, index) => (
                <Link key={index} href="">
                  {rec.label}
                </Link>
              ))}
            </Text>
          </div>
        ); }
      case "APPLICATION":
        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{item.time}</Text> -{" "}
            <Text>Review your {item.count} job applications</Text>
          </div>
        );
      default:
        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{item.time || "Unknown time"}</Text> -{" "}
            <Text>Event</Text>
          </div>
        );
    }
  }

  // Get Icon by Type
  function getTypeIcon(type) {
    switch (type) {
      case "Task":
        return <FaTasks style={{ fontSize: "16px", color: "#1890ff" }} />;
      case "CALL":
        return <PhoneCall style={{ fontSize: "16px", color: "#52c41a" }} />;
      case "MEETING":
        return <CiCalendarDate style={{ fontSize: "16px", color: "#faad14" }} />;
      case "INTERVIEW":
        return <FaMicrophone style={{ fontSize: "16px", color: "#faad14" }} />;
        case "REMINDER":
          return <Alarm style={{fontSize: "16px", color: "#faad14" }} />;
      case "APPLICATION":
        return <CgWebsite style={{ fontSize: "16px", color: "#722ed1" }} />;
      default:
        return <MdAlarm style={{ fontSize: "16px", color: "#f5222d" }} />;
    }
  }

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      extra={
        <GrExpand
          onClick={showPlannerDetail}
          style={{
            color: "#000",
            cursor: "pointer",
            display: isHovered ? "inline-block" : "none",
            transition: "opacity 0.3s",
          }}
        />
      }
      styles={{ header: { borderBottom: 0 } }}
      title={
        <Flex direction="row" align={"center"} justify={"start"} gap={"small"}>
          <RiCalendarView />
          <span>{title}</span>
        </Flex>
      }
      style={{
        backgroundColor: color,
        width: "350px",
        overflowWrap: "break-word",
        marginBottom: 10,
        borderRadius: "8px",
      }}
    >
      <Timeline items={timelineItems} mode="left" style={{ margin: "20px 0" }} />
    </Card>
  );
};

export default DailyTimeline;
