import React, { useMemo,useState } from "react";
import { Card, Flex, Timeline, Typography } from "antd";
import { CgWebsite } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";
import { FaHandshake, FaMicrophone, FaTasks } from "react-icons/fa";
import { GrExpand } from "react-icons/gr";
import { MdAlarm } from "react-icons/md";
import { RiCalendarView } from "react-icons/ri";

import { Alarm, PhoneCall } from "@phosphor-icons/react";

const { Text, Link } = Typography;

const DailyTimeline = React.memo(({ title = "Today", color = "#f0f6ff", items = [], showDetailView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = (type) => {
    const iconMap = {
      TASK: <FaTasks style={{ fontSize: "16px", color: "#1890ff" }} />,
      OVERDUE_TASK:<FaTasks style={{ fontSize: "16px", color: "#8bbdee" }} />,
      CALL: <PhoneCall style={{ fontSize: "16px", color: "#52c41a" }} />,
      MEETING: <CiCalendarDate style={{ fontSize: "16px", color: "#faad14" }} />,
      INTERVIEW: <FaMicrophone style={{ fontSize: "16px", color: "#faad14" }} />,
      REMINDER: <Alarm style={{ fontSize: "16px", color: "#faad14" }} />,
      OVERDUE_REMINDER: <Alarm style={{ fontSize: "16px", color: "#d8a977" }} />,
      APPLICATION: <CgWebsite style={{ fontSize: "16px", color: "#722ed1" }} />,
      PLACEMENT_STARTER: <FaHandshake style={{ fontSize: "16px", color: "#faad14" }} />,
      DEFAULT: <MdAlarm style={{ fontSize: "16px", color: "#f5222d" }} />,
    };

    return iconMap[type] || iconMap.DEFAULT;
  };

  const getTimelineText = (item,index) => {
    switch (item.type) {
      case "TASK":
        return <Text>{item.count} Task(s) is due</Text>;
      case "OVERDUE_TASK":
        return <Text>{index > 0 ?'':'Review'}{' '}{item.count} overdue Task(s)</Text>;
      case "REMINDER":
        return <Text>{item.count} Reminder(s) is due</Text>;
      case "OVERDUE_REMINDER":
        return <Text>{index > 0 ?'':'Review'}{' '}{item.count} overdue Reminder(s)</Text>;
      case "CALL":
      case "MEETING":
      case "INTERVIEW":
      case "CAL_EVENT": {
        let recordType = "colleagues";
        const label =
          item.type === "CALL"
            ? "Call"
            : item.type === "MEETING"
              ? "Meeting"
              : "Interview";

        if (item.attendees && item.attendees.length > 0) {
          const match = item.attendees.find(
            (attendee) => attendee.type !== "UNRECORDED" && attendee.type === "CONTACT"
          );
          recordType = match ? "Client" : "Candidate";
        }

        return (
          <Text>
            {label} with {recordType}{" "}
            {item.attendees.map((rec, index) => (
              <Link key={index} href="">
                {rec.label}
              </Link>
            ))}
          </Text>
        );
      }

      case "PLACEMENT_STARTER":
        return <Text>Follow-up {item.count} Placement(s) starting</Text>;
      case "APPLICATION":
        return <Text>Review your {item.count} pending job applications</Text>;
      default:
        return <Text>Event</Text>;
    }
  };

  const renderPlannerText = (itemData) => {
    const textStyle = {
      display: "block",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "break-word",
    };

    return (
      <div style={textStyle}>
        <Text style={{ fontWeight: 500 }}>{itemData.formatted_time}</Text> -{" "}
        {itemData.items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && " and "}
            {getTimelineText(item,index)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const timelineItems = useMemo(
    () =>
      items.map((itemData) => ({
        children: renderPlannerText(itemData),
        dot: getTypeIcon(itemData.items[0]?.type),
      })),
    [items]
  );

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
