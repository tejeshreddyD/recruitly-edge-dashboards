import React, { useMemo } from "react";
import { Card, Flex, Tag, Timeline, Tooltip, Typography } from "antd";
import { CgWebsite } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";
import { FaFileInvoice, FaFileWord, FaHandshake, FaMicrophone, FaPhoneSquareAlt, FaTasks } from "react-icons/fa";
import { GiEmptyHourglass } from "react-icons/gi";
import { IoFlash, IoOpenOutline } from "react-icons/io5";
import { MdAlarm } from "react-icons/md";
import { RiCalendarView } from "react-icons/ri";

import { VISTA_URL } from "@constants";
import { Alarm, PhoneCall, PhoneOutgoing } from "@phosphor-icons/react";
import { dashboardAction, dashboardActionCode, recordType } from "@utils/actionsUtil.js";
import { GoTasklist } from "react-icons/go";
import { GrTask, GrTasks } from "react-icons/gr";
import { FaCalendarDays } from "react-icons/fa6";

const { Text, Link } = Typography;

const DailyTimeline = React.memo(({ title = "Today", color = "#f0f6ff", items = [], reminderViewer }) => {
  // Define a consistent link style to be used throughout the component
  const linkStyle = useMemo(() => {
    return {
      color: "#1890ff", // Using the same blue color as the TASK icon
    };
  }, []);

  const getTypeIcon = (type) => {
    const iconMap = {
      TASK: <GrTask style={{ fontSize: "18px", color: "#1890ff" }} />,
      OVERDUE_TASK: <FaTasks style={{ fontSize: "18px", color: "#8bbdee" }} />,
      CALL: <FaPhoneSquareAlt style={{ fontSize: "18px", color: "#2c30ef" }} />,
      MEETING: <FaCalendarDays style={{ fontSize: "18px", color: "#d64fac" }} />,
      INTERVIEW: <FaMicrophone style={{ fontSize: "18px", color: "#46b17b" }} />,
      REMINDER: <Alarm style={{ fontSize: "18px", color: "#faad14" }} />,
      OVERDUE_REMINDER: <Alarm style={{ fontSize: "18px", color: "#d8a977" }} />,
      APPLICATION: <FaFileWord style={{ fontSize: "18px", color: "#722ed1" }} />,
      PLACEMENT_STARTER: <FaHandshake style={{ fontSize: "18px", color: "#faad14" }} />,
      CUSTOM_ACTION: <IoFlash style={{ fontSize: "18px", color: "#faad14" }} />,
      INVOICE_DUE: <FaFileInvoice style={{ fontSize: "18px", color: "#faad14" }} />,
      DEFAULT: <MdAlarm style={{ fontSize: "18px", color: "#f5222d" }} />,
    };

    return iconMap[type] || iconMap.DEFAULT;
  };

  const handleLinkClick = (e, record) => {
    e.preventDefault();

    console.log('handleLinkClick called with record:', record);

    if (!record || record.type === "USER" || record.type === "UNRECORDED") {
      console.log('Invalid record type, not opening popup');
      return false;
    }

    try {
      console.log('Opening record popup with type:', record.type, 'and ID:', record._id);
      if (window.COOLUTIL && typeof window.COOLUTIL.viewRecordPopupByType === 'function') {
        window.COOLUTIL.viewRecordPopupByType(record.type, record._id);
      } else {
        console.log('COOLUTIL not available or viewRecordPopupByType is not a function');
        console.log('Would show popup for:', { type: record.type, id: record._id });
      }
    } catch (error) {
      console.error('Error opening record popup:', error);
    }
  };

  const renderLinkedRecords = (records, recordTransform = (rec) => rec, parentItem = null) => {
    // Limit to 3-4 records, then show additional count
    const MAX_VISIBLE_RECORDS = 3;

    if (!records || records.length === 0) return null;

    // If less than or equal to MAX_VISIBLE_RECORDS, show all
    if (records.length <= MAX_VISIBLE_RECORDS) {
      return records.map((rec, index) => {
        const transformedRec = recordTransform(rec);
        return (
          <Tooltip key={index} style={{ fontSize: 10 }} title={`View ${transformedRec.type?.toLowerCase()}`}>
            <Tag
              color="blue"
              style={{ fontSize: 10, marginLeft: "1px", cursor: "pointer" }}
              onClick={(e) => handleLinkClick(e, transformedRec)}
              href={"#"}
            >
              {transformedRec.label || transformedRec.name || transformedRec.reference}
            </Tag>
          </Tooltip>
        );
      });
    }

    // If more than MAX_VISIBLE_RECORDS, show first 3 and the count of others
    return (
      <>
        {records.slice(0, MAX_VISIBLE_RECORDS).map((rec, index) => {
          const transformedRec = recordTransform(rec);
          return (
            <Tooltip key={index} style={{ fontSize: 10 }} title={`View ${transformedRec.type?.toLowerCase()}`}>
              <Tag
                color="blue"
                style={{ fontSize: 10, marginLeft: "1px", cursor: "pointer" }}
                onClick={(e) => handleLinkClick(e, transformedRec)}
                href={"#"}
              >
                {transformedRec.label || transformedRec.name || transformedRec.reference}
              </Tag>
            </Tooltip>
          );
        })}
        <Tag
          color="blue"
          style={{ fontSize: 10, marginLeft: "1px", cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            console.log('Clicked on "+ others" tag');

            // If we have a parent item, use its handler instead of the records handler
            if (parentItem) {
              console.log('Using parent item handler for type:', parentItem.type);

              // For reminders, use the reminder viewer
              if (parentItem.type === 'REMINDER') {
                try {
                  if (typeof reminderViewer === 'function') {
                    console.log('Opening reminder viewer with ID:', parentItem.id ? parentItem.id[0] : null);
                    reminderViewer(e, parentItem.id ? parentItem.id[0] : null);
                  } else {
                    console.log('reminderViewer not available');
                  }
                } catch (error) {
                  console.error('Error opening reminder viewer:', error);
                }
              }
              // For tasks
              else if (parentItem.type === 'TASK') {
                try {
                  if (typeof dashboardAction === 'function') {
                    console.log('Opening task view with ID:', parentItem.id);
                    dashboardAction(e, dashboardActionCode.VIEW_TASK, { records: [{ id: parentItem.id }] });
                  } else {
                    console.log('dashboardAction not available');
                  }
                } catch (error) {
                  console.error('Error opening task view:', error);
                }
              }
              // For calendar events
              else if (['CALL', 'MEETING', 'INTERVIEW', 'CAL_EVENT'].includes(parentItem.type)) {
                try {
                  if (typeof dashboardAction === 'function') {
                    console.log('Opening calendar event with ID:', parentItem.eventId);
                    dashboardAction(e, dashboardActionCode.VIEW_CALENDAR_EVENT, {
                      records: [{ id: parentItem.eventId }],
                    });
                  } else {
                    console.log('dashboardAction not available');
                  }
                } catch (error) {
                  console.error('Error opening calendar event:', error);
                }
              }
              // Default fallback - use the first record
              else {
                const firstRec = records[0];
                const transformedRec = recordTransform(firstRec);
                console.log('Using first record as fallback:', transformedRec);
                handleLinkClick(e, transformedRec);
              }
            }
            // No parent item, use first record as fallback
            else {
              const firstRec = records[0];
              const transformedRec = recordTransform(firstRec);
              console.log('No parent item, using first record:', transformedRec);
              handleLinkClick(e, transformedRec);
            }
          }}
        >
          + {records.length - MAX_VISIBLE_RECORDS} others
        </Tag>
      </>
    );
  };

  const getTimelineText = (itemData, item, index) => {
    switch (item.type) {
      case "TASK":
        return (
          <>
            <Link
              href={"#"}
              onClick={(e) => {
                try {
                  console.log('Task clicked with ID:', item.id);
                  if (typeof dashboardAction === 'function') {
                    dashboardAction(e, dashboardActionCode.VIEW_TASK, { records: [{ id: item.id }] });
                  } else {
                    console.log('dashboardAction not available, would view task:', item.id);
                    // Try a fallback approach to open the task view
                    if (item && item.id) {
                      // Here you could implement a fallback method
                      console.log('Would attempt fallback method to view task:', item.id);
                    }
                  }
                } catch (error) {
                  console.error('Error in task click handler:', error);
                }
              }}
              style={linkStyle}
            >
              <Text style={{ fontWeight: 500 }}>{item?.subject}</Text>
            </Link>
            {item.records.length > 0 ? (
              <div>
                {renderLinkedRecords(
                  item.records,
                  (rec) => ({
                    _id: rec.id,
                    type: recordType(rec.reference),
                    label: rec.name,
                    reference: rec.reference,
                  }),
                  item
                )}
              </div>
            ) : (
              ""
            )}
          </>
        );
      case "OVERDUE_TASK":
        return (
          <Link
            href={`${VISTA_URL}/reminders?type=OVERDUE_TASK&date=${item.time}`}
            style={linkStyle}
          >
            {index > 0 ? "" : "Review"} {item.count} overdue Task(s)
            <IoOpenOutline style={{ paddingLeft: "2px" }} color={"gray"} />
          </Link>
        );
      case "REMINDER":
        return (
          <>
            <Link
              href={"#"}
              onClick={(e) => {
                try {
                  console.log('Reminder clicked with ID:', item.id[0]);
                  if (typeof reminderViewer === 'function') {
                    reminderViewer(e, item.id[0]);
                  } else {
                    console.log('reminderViewer not available, would view reminder:', item.id[0]);
                  }
                } catch (error) {
                  console.error('Error in reminder click handler:', error);
                }
              }}
              style={linkStyle}
            >
              {item.count} reminder(s){" "}
              {item.activity_type.length > 0 ? "(" + item.activity_type[0].name + ")" : ""} is due
            </Link>
            {item.records.length > 0 ? (
              <div>
                {renderLinkedRecords(
                  item.records[0],
                  (rec) => ({
                    _id: rec.recordId,
                    type: rec.type,
                    label: rec.label,
                  }),
                  item
                )}
              </div>
            ) : (
              ""
            )}
          </>
        );
      case "CUSTOM_ACTION":
        return (
          <>
            <Link
              href={`${VISTA_URL}/reminders?type=NEXT_ACTION&date=${item.time}`}
              style={linkStyle}
            >
              {item.count} custom next action(s) is due
              <IoOpenOutline style={{ paddingLeft: "2px" }} color={"gray"} />
            </Link>
            {item.records.length > 0 ? (
              <div>
                {renderLinkedRecords(
                  item.records[0],
                  (rec) => ({
                    _id: rec.recordId,
                    type: rec.type,
                    label: rec.name,
                  }),
                  item
                )}
              </div>
            ) : (
              ""
            )}
          </>
        );
      case "OVERDUE_REMINDER":
        return (
          <Link
            href={`${VISTA_URL}/reminders?type=OVERDUE_REMINDER&date=${item.time}`}
            style={linkStyle}
          >
            {index > 0 ? "" : "Review"} {item.count} overdue Reminder(s)
            <IoOpenOutline style={{ paddingLeft: "2px" }} color={"gray"} />
          </Link>
        );
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

        let updated_title = item.title ? item.title : label;

        if (item.activityType && item.activityType.name) {
          updated_title = label + " (" + item.activityType.name + ")";
        }

        return (
          <>
            <Link
              href="#"
              onClick={(e) => {
                try {
                  console.log('Calendar event clicked with ID:', item.eventId);
                  if (typeof dashboardAction === 'function') {
                    dashboardAction(e, dashboardActionCode.VIEW_CALENDAR_EVENT, {
                      records: [{ id: item.eventId }],
                    });
                  } else {
                    console.log('dashboardAction not available, would view calendar event:', item.eventId);
                  }
                } catch (error) {
                  console.error('Error in calendar event click handler:', error);
                }
              }}
              style={linkStyle}
            >
              {updated_title} {!item.title ? `with ${recordType} ` : "with "}
            </Link>
            {renderLinkedRecords(
              item.attendees,
              (rec) => ({
                _id: rec._id,
                type: rec.type,
                label: rec.label,
              }),
              item
            )}
          </>
        );
      }

      case "PLACEMENT_STARTER":
        return (
          <>
            <Text style={linkStyle}>Follow-up {item.count} Placement(s) starting</Text>
            {renderLinkedRecords(
              item.placements,
              (rec) => ({
                _id: rec.placementId,
                type: "PLACEMENT",
                label: rec.reference,
              }),
              item
            )}
          </>
        );
      case "APPLICATION":
        return (
          <Link style={linkStyle} href={`${VISTA_URL}/applications/pending`}>
            Review your {item.count} pending job applications
            <IoOpenOutline style={{ paddingLeft: "2px" }} color={"gray"} />
          </Link>
        );
      case "INVOICE_DUE":
        return (
          <>
            <Text style={linkStyle}>
              Follow-up {item.count} invoice(s) due of total ${item.invoice_due}
            </Text>
          </>
        );
      default:
        return <Link style={linkStyle}>Event</Link>;
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
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "small",
            fontFamily: "Courier New",
            backgroundColor: "#f6f6f6",
            padding: 4,
            borderRadius: 4,
          }}
        >
          {itemData.formatted_time}
        </Text>{" "}
        -{" "}
        {itemData.items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Text style={{ color: "#9a9a9a" }}>{" and "}</Text>}
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
    [items]
  );

  return (
    <>
      <Card
        styles={{ header: { borderBottom: 0 } }}
        title={
          <Flex direction="row" align={"center"} justify={"start"} gap={"small"}>
            <RiCalendarView />
            <span>{title}</span>
          </Flex>
        }
        style={{
          backgroundColor: color,
          width: title === "Today" ? "600px" : "350px",
          overflowWrap: "break-word",
          paddingRight: "10px",
          marginBottom: 10,
          borderRadius: "8px",
          textAlign: timelineItems.length > 0 ? "" : "center",
        }}
      >
        {timelineItems.length > 0 ? (
          <Timeline
            items={timelineItems}
            mode="left"
            style={{
              margin: "20px 0",
              minWidth: title === "Today" ? "580px" : "330px",
              paddingRight: "10px",
            }}
          />
        ) : (
          <>
            <Card
              bordered={false}
              style={{
                width: title === "Today" ? "570px" : "320px",
                boxShadow: "none",
                alignContent: "center",
              }}
              cover={<GiEmptyHourglass size={100} color={"lightblue"} />}
            >
              <Text color={"lightgray"} style={{ fontSize: "14px", color: "#c4b1b1" }}>
                No activity found for this date.
              </Text>
            </Card>
          </>
        )}
      </Card>
    </>
  );
});

export default DailyTimeline;