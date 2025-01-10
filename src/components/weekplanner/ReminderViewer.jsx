import React from "react";
import { Card, Typography, Space, Divider } from "antd";
import { getDateMoment } from "@utils/dateUtil.js";

const { Text, Link } = Typography;

const ReminderViewer = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <Text>No reminder data available.</Text>
      </Card>
    );
  }

  const reminder_data = data[0];

  const handleLinkClick = (e, record) => {
    e.preventDefault();

    if (!record || record.type === "USER" || record.type === "UNRECORDED") {
      return false;
    }

    window.COOLUTIL.viewRecordPopupByType(record.type, record._id);
  };

  return (
    <div>
      {/* Details and Linked Records */}
      <Card style={{ marginBottom: "16px" }}>
        <Divider orientation="left">Details</Divider>
        <Space direction="vertical" size="small">
          <Text>
            <Text strong>Reminder Date:</Text> {getDateMoment(reminder_data.reminderDate)}
          </Text>
          <Text>
            <Text strong>Activity Type:</Text> {reminder_data.type?.name || "N/A"}
          </Text>
        </Space>

        <Divider orientation="left">Linked Records</Divider>
        {reminder_data.links && reminder_data.links.length > 0 ? (
          <Space direction="vertical" size="small">
            {reminder_data.links.map((link) => (
              <Link
                key={link.id}
                href="#"
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.reference} {link.label}
              </Link>
            ))}
          </Space>
        ) : (
          <Text>No linked records available.</Text>
        )}
      </Card>

      {/* Notes */}
      <Card>
        <Divider orientation="left">Notes</Divider>
        <div
          dangerouslySetInnerHTML={{
            __html: reminder_data.notes || "<p>No notes available.</p>",
          }}
        />
      </Card>
    </div>
  );
};

export default ReminderViewer;
