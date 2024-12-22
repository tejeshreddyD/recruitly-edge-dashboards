import { Tooltip } from "antd";
import {
  DollarCircleFilled,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined
} from "@ant-design/icons";

// Icons for activity types
export const activityTypeIcons = {
  LETTER: <MailOutlined />,
  COMMENT: <MessageOutlined />,
  EMAIL: <MailOutlined />,
  CALL: <PhoneOutlined />,
  EVENT: <CalendarOutlined />,
  MEETING: <TeamOutlined />,
  INTERVIEW: <UserOutlined />
};

// Help text for System Actions
export const helpSystem = (
  <span>
    System actions are automatically calculated based on your interactions within the platform. For example, metrics
    are updated when you create a new record, close a deal, make a placement, or generate billing. These actions help
    you track key activities and outcomes effortlessly.
  </span>
);

// Help text for Activity Types
export const helpActivity = (
  <span>
    Activity types are master data items defined and managed by you or your administrator in the system. They allow
    you to tag actions such as notes, emails, calls, or journal entries, helping you organise and track activities
    more effectively.
  </span>
);

// Sort function for system metrics (VALUE first, then COUNT)
export const sortByType = (a, b) => (a.type === "VALUE" ? -1 : b.type === "VALUE" ? 1 : 0);

// Sort function for activity types (by type.code, then name)
export const sortByTypeAndName = (a, b) => {
  const typeComparison = (a.type?.code || "").localeCompare(b.type?.code || "");
  return typeComparison !== 0 ? typeComparison : a.name.localeCompare(b.name);
};

// Process and sort system options
export const getSortedSystemOptions = (system = []) =>
  system
    .sort(sortByType)
    .map((item) => ({
      label: (
        <Tooltip title={(item.desc || "").replace(/<[^>]*>/g, "")}>
          {item.name} {item.type === "VALUE" && <DollarCircleFilled style={{ marginLeft: 4, color: "green" }} />}
        </Tooltip>
      ),
      value: item._id
    }));

// Process and sort activity options
export const getSortedActivityOptions = (activity = []) =>
  activity
    .sort(sortByTypeAndName)
    .map((item) => ({
      label: (
        <Tooltip title={(item.desc || "").replace(/<[^>]*>/g, "")}>
          {activityTypeIcons[item.type?.code] || <UserOutlined />}
          <span style={{ marginLeft: 8 }}>{item.name}</span>
        </Tooltip>
      ),
      value: item._id
    }));
