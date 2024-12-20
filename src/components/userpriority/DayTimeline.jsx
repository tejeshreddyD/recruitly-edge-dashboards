import React, { useState } from "react";
import { Card, Flex, Timeline } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { RiCalendarView, RiFocus2Line } from "react-icons/ri";
import { BsCalendarDateFill, BsCalendarDay } from "react-icons/bs";
import { MdCalendarViewDay } from "react-icons/md";
import { GrExpand } from "react-icons/gr";

const DailyTimeline = ({ title = "Today", color = "#f0f6ff" }) => {

  const [isHovered, setIsHovered] = useState(false);

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
      <Timeline mode="left" style={{ margin: "20px 0" }}>
        <Timeline.Item dot={<CheckCircleOutlined style={{ fontSize: "16px", color: "#52c41a" }} />} color="green">
          <strong>9:00 AM</strong> – Review 10 job applications 🚀
        </Timeline.Item>

        <Timeline.Item dot={<UserOutlined style={{ fontSize: "16px", color: "#1890ff" }} />} color="blue">
          <strong>11:00 AM</strong> – Interview with Client1 🗓️
        </Timeline.Item>

        <Timeline.Item dot={<UserOutlined style={{ fontSize: "16px", color: "#1890ff" }} />} color="blue">
          <strong>1:00 PM</strong> – Interview with Client2 🗓️
        </Timeline.Item>

        <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: "16px", color: "#faad14" }} />} color="orange">
          <strong>2:00 PM</strong> – Follow up on 10 overdue tasks ⏰
        </Timeline.Item>

        <Timeline.Item dot={<CalendarOutlined style={{ fontSize: "16px", color: "#722ed1" }} />} color="purple">
          <strong>3:30 PM</strong> – Catch-up meetings with clients A, B, and C 🤝
        </Timeline.Item>

        <Timeline.Item dot={<CheckCircleOutlined style={{ fontSize: "16px", color: "#52c41a" }} />} color="green">
          <strong>5:00 PM</strong> – Wrap up and plan for tomorrow 🌟
        </Timeline.Item>
      </Timeline>
    </Card>
  );
};

export default DailyTimeline;
