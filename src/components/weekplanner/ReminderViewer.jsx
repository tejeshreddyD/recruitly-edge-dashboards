import React from "react";
import { Button, Col, Divider, Row, Space, Typography } from "antd";

import { getDateMoment } from "@utils/dateUtil.js";
import { FaRegEdit } from "react-icons/fa";
import { dashboardAction, dashboardActionCode } from "@utils/actionsUtil.js";

const { Text, Link } = Typography;

const ReminderViewer = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text>No reminder data available.</Text>;
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
    <div style={{ padding: "8px",position: "relative" }}>
      <Button
        type="default"
        onClick={(e) => dashboardAction(e,dashboardActionCode.EDIT_NOTE,{records:[{id:reminder_data._id}]})}
        style={{
          right: "8px",
        }}
        icon={<FaRegEdit size={16}/>}
      >
        Edit
      </Button>
      <Divider orientation="left" style={{ margin: "8px 0" }}>
        Notes
      </Divider>
      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          background: "#f9f9f9",
          padding: "12px",
          borderRadius: "4px",
        }}
        dangerouslySetInnerHTML={{
          __html: reminder_data.notes || "<p>No notes available.</p>",
        }}
      />
      <Divider orientation="left" style={{ marginBottom: "8px" }}>
        Details
      </Divider>
      <Row gutter={16} style={{ marginBottom: "8px" }}>
        <Col span={12}>
          <Text strong style={{ fontSize: "16px" }}>
            Reminder Date:
          </Text>
          <br />
          <Text style={{ fontSize: "14px", color: "#555" }}>
            {getDateMoment(reminder_data.reminderDate)}
          </Text>
        </Col>
        <Col span={12}>
          <Text strong style={{ fontSize: "16px" }}>
            Activity Type:
          </Text>
          <br />
          <Text style={{ fontSize: "14px", color: "#555" }}>
            {reminder_data.type?.name || "N/A"}
          </Text>
        </Col>
      </Row>

      <Divider orientation="left" style={{ margin: "8px 0" }}>
        Linked Records
      </Divider>
      <Space direction="vertical" size="small" style={{ display: "block", marginBottom: "8px" }}>
        {reminder_data.links && reminder_data.links.length > 0 ? (
          reminder_data.links.map((link) => (
            <Link
              key={link.id}
              href="#"
              onClick={(e) => handleLinkClick(e, link)}
              style={{ display: "inline-block", margin: "4px 0" }}
            >
              {link.reference} {link.label}
            </Link>
          ))
        ) : (
          <Text>No linked records available.</Text>
        )}
      </Space>
    </div>
  );
};

export default ReminderViewer;
