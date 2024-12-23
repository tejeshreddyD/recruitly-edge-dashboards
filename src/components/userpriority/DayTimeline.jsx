import React, { useMemo, useState } from "react";
import { Card, Flex, Timeline, Typography } from "antd";
import { FaTasks, FaMicrophone, FaHandshake } from "react-icons/fa";

import { CiCalendarDate } from "react-icons/ci";
import { MdAlarm } from "react-icons/md";

import { CgWebsite } from "react-icons/cg";
import { GrExpand } from "react-icons/gr";
import { RiCalendarView } from "react-icons/ri";
import { Alarm, PhoneCall } from "@phosphor-icons/react";

const { Text, Link } = Typography;

const DailyTimeline = React.memo(({ title = "Today", color = "#f0f6ff", items = [], showDetailView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = useMemo(() => {
    const iconMap = {
      TASK: <FaTasks style={{ fontSize: "16px", color: "#1890ff" }} />,
      CALL: <PhoneCall style={{ fontSize: "16px", color: "#52c41a" }} />,
      MEETING: <CiCalendarDate style={{ fontSize: "16px", color: "#faad14" }} />,
      INTERVIEW: <FaMicrophone style={{ fontSize: "16px", color: "#faad14" }} />,
      REMINDER: <Alarm style={{ fontSize: "16px", color: "#faad14" }} />,
      APPLICATION: <CgWebsite style={{ fontSize: "16px", color: "#722ed1" }} />,
      PLACEMENT_STARTER: <FaHandshake style={{ fontSize: "16px", color: "#faad14" }} />,
      DEFAULT: <MdAlarm style={{ fontSize: "16px", color: "#f5222d" }} />,
    };

    return (type) => iconMap[type] || iconMap.DEFAULT;
  }, []);

  // Helper to generate planner text
  const getPlannerText = useMemo(() => {
    const textStyle = {
      display: "block",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "break-word",
    };

    return (itemData) => {
      const item = itemData.items[0];
      if (!item) return null;

      switch (item.type) {
        case "TASK":
        case "REMINDER":
          return (
            <div style={textStyle}>
              <Text style={{ fontWeight: 500 }}>{itemData.formatted_time}</Text> -{" "}
              <Text>{item.count} Task(s) to complete</Text>
            </div>
          );
        case "CALL":
        case "MEETING":
        case "INTERVIEW":
        case "CAL_EVENT": {
          const eventData = item.events[0];
          let recordType = "colleagues";
          const label =
            eventData.type === "CALL"
              ? "Call"
              : eventData.type === "MEETING"
                ? "Meeting"
                : "Interview";

          if (eventData.attendees && eventData.attendees.length > 0) {
            const match = eventData.attendees.find(
              (attendee) => attendee.type !== "UNRECORDED" && attendee.type === "CONTACT"
            );
            recordType = match ? "Client" : "Candidate";
          }

          return (
            <div style={textStyle}>
              <Text style={{ fontWeight: 500 }}>{itemData.formatted_time}</Text> -{" "}
              <Text>
                {label} with {recordType}{" "}
                {eventData.attendees.map((rec, index) => (
                  <Link key={index} href="">
                    {rec.label}
                  </Link>
                ))}
              </Text>
            </div>
          );
        }
        case "PLACEMENT_STARTER":
          return (
            <div style={textStyle}>
              <Text style={{ fontWeight: 500 }}>{itemData.formatted_time}</Text> -{" "}
              <Text>Follow-up {item.count} Placement(s) starting</Text>
            </div>
          );
        case "APPLICATION":
          return (
            <div style={textStyle}>
              <Text style={{ fontWeight: 500 }}>{itemData.formatted_time}</Text> -{" "}
              <Text>Review your {item.count} pending job applications</Text>
            </div>
          );
        default:
          return (
            <div style={textStyle}>
              <Text style={{ fontWeight: 500 }}>{itemData.formatted_time || "Unknown time"}</Text> -{" "}
              <Text>Event</Text>
            </div>
          );
      }
    };
  }, []);

  // Memoized timeline items
  const timelineItems = useMemo(
    () =>
      items.map((item) => ({
        children: getPlannerText(item),
        dot: getTypeIcon(item.items[0]?.type),
      })),
    [items, getPlannerText]
  );

  // Show planner detail callback
  const showPlannerDetail = () => {
    showDetailView(title);
  };

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
});

export default DailyTimeline;
