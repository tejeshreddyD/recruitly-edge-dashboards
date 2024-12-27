import React, { useMemo } from "react";
import { Card, Timeline, Typography } from "antd";
import { CgWebsite } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";
import { FaHandshake, FaMicrophone, FaTasks } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";
import { MdAlarm } from "react-icons/md";

import { Alarm, PhoneCall } from "@phosphor-icons/react";

const { Text, Link } = Typography;

const PlannerDailyTimeline = React.memo(({ items = [] }) => {

  const getTypeIcon = (type) => {
    const iconMap = {
      TASK: <FaTasks style={{ fontSize: "16px", color: "#1890ff" }} />,
      OVERDUE_TASK: <FaTasks style={{ fontSize: "16px", color: "#8bbdee" }} />,
      CALL: <PhoneCall style={{ fontSize: "16px", color: "#52c41a" }} />,
      MEETING: <CiCalendarDate style={{ fontSize: "16px", color: "#faad14" }} />,
      INTERVIEW: <FaMicrophone style={{ fontSize: "16px", color: "#faad14" }} />,
      REMINDER: <Alarm style={{ fontSize: "16px", color: "#faad14" }} />,
      OVERDUE_REMINDER: <Alarm style={{ fontSize: "16px", color: "#d8a977" }} />,
      APPLICATION: <CgWebsite style={{ fontSize: "16px", color: "#722ed1" }} />,
      PLACEMENT_STARTER: <FaHandshake style={{ fontSize: "16px", color: "#faad14" }} />,
      CUSTOM_ACTION: <IoFlash style={{ fontSize: "16px", color: "#faad14" }} />,
      DEFAULT: <MdAlarm style={{ fontSize: "16px", color: "#f5222d" }} />,
    };

    return iconMap[type] || iconMap.DEFAULT;
  };

  const handleActualsClick = (itemData) => {
    console.log(itemData);
    //showDetailView({ date: itemData.time, view_type: "ACTUAL" });
  };

  const getTimelineText = (itemData, item, index) => {
    switch (item.type) {
      case "TASK":
        return <Link onClick={() => handleActualsClick(itemData)}>{item.count} Task(s) is due</Link>;
      case "OVERDUE_TASK":
        return (
          <Link>
            {index > 0 ? "" : "Review"} {item.count} overdue Task(s)
          </Link>
        );
      case "REMINDER":
        return <Text>{item.count} Reminder(s) is due</Text>;
      case "CUSTOM_ACTION":
        return <Text>{item.count} custom next action(s) is due</Text>;
      case "OVERDUE_REMINDER":
        return (
          <Link>
            {index > 0 ? "" : "Review"} {item.count} overdue Reminder(s)
          </Link>
        );
      case "CALL":
      case "MEETING":
      case "INTERVIEW":
      case "CAL_EVENT": {
        let recordType = "colleagues";
        const label = item.type === "CALL" ? "Call" : item.type === "MEETING" ? "Meeting" : "Interview";

        if (item.attendees && item.attendees.length > 0) {
          const match = item.attendees.find((attendee) => attendee.type !== "UNRECORDED" && attendee.type === "CONTACT");
          recordType = match ? "Client" : "Candidate";
        }

        return (
          <Link>
            {label} with {recordType}{" "}
            {item.attendees.map((rec, index) => (
              <Link key={index} href="">
                {rec.label}
              </Link>
            ))}
          </Link>
        );
      }

      case "PLACEMENT_STARTER":
        return <Link>Follow-up {item.count} Placement(s) starting</Link>;
      case "APPLICATION":
        return <Link style={{color:"#000000"}} href={'javascript:void(0)'}>Review your {item.count} pending job applications</Link>;
      default:
        return <Link style={{color:"#000000"}} href={'javascript:void(0)'}>Event</Link>;
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
            {index > 0 && <Text style={{color:"lightgray"}}>{" and "}</Text>}
            {getTimelineText(itemData, item, index)}
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
    [items],
  );

  return (
    <Card
      styles={{ header: { borderBottom: 0 } }}
      style={{
        overflowWrap: "break-word",
        marginBottom: 0,
        borderRadius: 0,
        border:'none',
        height:'100%',
        borderRight:'0.5px solid lightgray',
      }}
    >
      <Timeline items={timelineItems} mode="left" style={{ margin: "20px 0" }} />
    </Card>
  );
});

export default PlannerDailyTimeline;
