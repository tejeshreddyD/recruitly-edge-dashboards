import React from "react";
import { Card, Timeline } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";

const DailyTimeline = () => {
  return (
    <Card title={"Today"} styles={{header:{borderBottom:0}}}>
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
