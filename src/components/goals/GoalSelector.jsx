import React, { useState, useMemo } from "react";
import { Checkbox, Drawer, Collapse, Tooltip, Alert } from "antd";
import {
  DollarCircleFilled,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined, QuestionCircleOutlined
} from "@ant-design/icons"; // Icons for activity types
import useUserDashboardGoalsConfigStore from "@api/userDashboardGoalsConfigStore.js";
import { FaCircleQuestion } from "react-icons/fa6";

const { Panel } = Collapse;

const activityTypeIcons = {
  LETTER: <MailOutlined />,
  COMMENT: <MessageOutlined />,
  EMAIL: <MailOutlined />,
  CALL: <PhoneOutlined />,
  EVENT: <CalendarOutlined />,
  MEETING: <TeamOutlined />,
  INTERVIEW: <UserOutlined />
};

const GoalSelector = ({ open, onClose }) => {
  const { configData } = useUserDashboardGoalsConfigStore();
  const [checkedValues, setCheckedValues] = useState([]);

  // Prepare options dynamically
  const options = useMemo(() => {
    if (!configData || !configData.kpiData) return { system: [], activity: [] };

    const { system = [], activity = [] } = configData.kpiData;

    // Sort system by type (VALUE first, then COUNT)
    const sortByType = (a, b) => (a.type === "VALUE" ? -1 : b.type === "VALUE" ? 1 : 0);

    const sortedSystem = [...system].sort(sortByType).map((item) => ({
      label: (
        <Tooltip title={(item.desc || "").replace(/<[^>]*>/g, "")}>
          {item.name} {item.type === "VALUE" && <DollarCircleFilled style={{ marginLeft: 4, color: "green" }} />}
        </Tooltip>
      ),
      value: item._id
    }));

    // Sort activities by type.code and name
    const sortByTypeAndName = (a, b) => {
      const typeComparison = (a.type?.code || "").localeCompare(b.type?.code || "");
      return typeComparison !== 0 ? typeComparison : a.name.localeCompare(b.name);
    };

    const sortedActivity = [...activity].sort(sortByTypeAndName).map((item) => ({
      label: (
        <Tooltip title={(item.desc || "").replace(/<[^>]*>/g, "")}>
          {activityTypeIcons[item.type?.code] || <UserOutlined />}
          <span style={{ marginLeft: 8 }}>{item.name}</span>
        </Tooltip>
      ),
      value: item._id
    }));

    return { system: sortedSystem, activity: sortedActivity };
  }, [configData]);

  return (
    <Drawer title="Customise Goals" onClose={onClose} open={open}>
      {/* Accordion with Checkbox Groups */}
      <Collapse accordion>
        {/* System Actions Panel */}
        <Panel
          header="System Actions"
          key="1"
        >
          <Alert
            message={
              <span>
              System actions are automatically calculated based on your interactions within the
              platform. For example, metrics are updated when you create a new record, close a deal, make a placement,
              or generate billing etc.,
              </span>
            }
            type="info"
            style={{ marginBottom: "16px" }}
          />
          <Checkbox.Group
            value={checkedValues}
            onChange={(values) => setCheckedValues(values)}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {options.system.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Panel>

        {/* User Activity Types Panel */}
        <Panel
          header="Your Activity Types"
          key="2"
        >
          <Alert
            message={
              <span>
              Activity types are master data items defined and managed by you or your administrator in the system, allowing
              you to tag actions such as notes, emails, calls, or journal entries, helping you organise and track activities more effectively.
              </span>
            }
            type="info"
            style={{ marginBottom: "16px" }}
          />
          <Checkbox.Group
            value={checkedValues}
            onChange={(values) => setCheckedValues(values)}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {options.activity.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Panel>
      </Collapse>
    </Drawer>
  );
};

export default GoalSelector;
