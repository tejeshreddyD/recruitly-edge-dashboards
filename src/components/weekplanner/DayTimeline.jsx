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

const DailyTimeline = React.memo(({ title = "Today", color = "#f0f6ff", items = [],reminderViewer}) => {

  const getTypeIcon = (type) => {
    const iconMap = {
      TASK: <GrTask style={{ fontSize: "18px", color: "#1890ff" }} />,
      OVERDUE_TASK:<FaTasks style={{ fontSize: "18px", color: "#8bbdee" }} />,
      CALL: <FaPhoneSquareAlt style={{ fontSize: "18px", color: "#2c30ef" }} />,
      MEETING: <FaCalendarDays style={{ fontSize: "18px", color: "#d64fac" }} />,
      INTERVIEW: <FaMicrophone style={{ fontSize: "18px", color: "#46b17b" }} />,
      REMINDER: <Alarm style={{ fontSize: "18px", color: "#faad14" }} />,
      OVERDUE_REMINDER: <Alarm style={{ fontSize: "18px", color: "#d8a977" }} />,
      APPLICATION: <FaFileWord style={{ fontSize: "18px", color: "#722ed1" }} />,
      PLACEMENT_STARTER: <FaHandshake style={{ fontSize: "18px", color: "#faad14" }} />,
      CUSTOM_ACTION:<IoFlash style={{ fontSize: "18px", color: "#faad14" }} />,
      INVOICE_DUE:<FaFileInvoice style={{ fontSize: "18px", color: "#faad14" }} />,
      DEFAULT: <MdAlarm style={{ fontSize: "18px", color: "#f5222d" }} />,
    };

    return iconMap[type] || iconMap.DEFAULT;
  };

  const timelineTextStyle = useMemo(() => {
    return {
      color: "#000",
    }
  },[]);

  const handleLinkClick = (e,record) => {

    e.preventDefault();

    if(!record || record.type === "USER" || record.type === "UNRECORDED") {
      return false
    }

    window.COOLUTIL.viewRecordPopupByType(record.type, record._id);

  }

  const getTimelineText = (itemData,item,index) => {

    switch (item.type) {
      case "TASK":
        return (<><Link href={'#'} onClick={(e) => dashboardAction(e,dashboardActionCode.VIEW_TASK,{records:[{id:item.id}]})} style={timelineTextStyle}><Text style={{fontWeight:500}}>{item?.subject}</Text></Link>
          {item.records.length > 0 ? <div>{item.records.map((rec, index) => (rec.reference ? <Tooltip key={index} style={{fontSize:10}} title={`View ${recordType(rec.reference).toLowerCase()}`}>
            <Tag color={"blue"} style={{fontSize:10, marginLeft:"1px",cursor:"pointer"}} key={index} onClick={(e) => handleLinkClick(e, {_id:rec.id,type:recordType(rec.reference)})} href={"#"}>
              {rec.name}
            </Tag>
          </Tooltip>:''))}</div>:""}</>);
      case "OVERDUE_TASK":
        return <Link href={`${VISTA_URL}/reminders?type=OVERDUE_TASK&date=${item.time}`} style={timelineTextStyle}>{index > 0 ?'':'Review'}{' '}{item.count} overdue Task(s)<IoOpenOutline style={{paddingLeft:"2px"}} color={"gray"}/></Link>;
      case "REMINDER":
        return (<><Link href={'#'} onClick={(e) => reminderViewer(e,item.id[0])} style={timelineTextStyle}>{item.count} reminder(s) is due</Link>
          {item.records.length > 0 ? <div>{item.records[0].map((rec, index) => (<Tooltip key={index} style={{fontSize:10}} title={`View ${rec.type.toLowerCase()}`}>
            <Tag color={"blue"} style={{fontSize:10, marginLeft:"1px",cursor:"pointer"}} key={index} onClick={(e) => handleLinkClick(e, {_id:rec.recordId,type:rec.type})} href={"#"}>
              {rec.label}
            </Tag>
          </Tooltip>))}</div>:""}</>);
      case "CUSTOM_ACTION":
        return (<><Link href={`${VISTA_URL}/reminders?type=NEXT_ACTION&date=${item.time}`} style={timelineTextStyle}>{item.count} custom next action(s) is due<IoOpenOutline style={{paddingLeft:"2px"}} color={"gray"}/></Link>
          {item.records.length > 0 ? <div>{item.records[0].map((rec, index) => (<Tooltip key={index} style={{fontSize:10}} title={`View ${rec.type.toLowerCase()}`}>
            <Tag color={"blue"} style={{fontSize:10, marginLeft:"1px",cursor:"pointer"}} key={index} onClick={(e) => handleLinkClick(e, {_id:rec.recordId,type:rec.type})} href={"#"}>
              {rec.name}
            </Tag>
          </Tooltip>))}</div>:""}</>);
      case "OVERDUE_REMINDER":
        return <Link href={`${VISTA_URL}/reminders?type=OVERDUE_REMINDER&date=${item.time}`} style={timelineTextStyle}>{index > 0 ?'':'Review'}{' '}{item.count} overdue Reminder(s)<IoOpenOutline style={{paddingLeft:"2px"}} color={"gray"}/></Link>;
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

        return (<>
          <Link
            href="#"
            onClick={(e) =>
              dashboardAction(e, dashboardActionCode.VIEW_CALENDAR_EVENT, {
                records: [{ id: item.eventId }],
              })
            }
            style={timelineTextStyle}
          >
            {item.title || label} {!item.title ? `with ${recordType} ` : ""}
          </Link>{item.attendees.map((rec, index) => (

          <Link key={index} onClick={(e) => handleLinkClick(e, rec)} href={"#"}>
            {index > 0 ? ", ":''}{rec.label}
          </Link>
        ))}
        </>);
      }

      case "PLACEMENT_STARTER":
        return (<><Text style={timelineTextStyle}>Follow-up {item.count} Placement(s) starting</Text>
          {item.placements.map((rec, index) => (
            <Tag color={"blue"} style={{fontSize:10, marginLeft:"1px",cursor:"pointer"}} key={index} onClick={(e) => handleLinkClick(e, {_id:rec.placementId,type:'PLACEMENT'})} href={"#"}>
              {rec.reference}
            </Tag>
          ))}</>);
      case "APPLICATION":
        return <Link style={timelineTextStyle} href={`${VISTA_URL}/applications/pending`}>Review your {item.count} pending job applications<IoOpenOutline style={{paddingLeft:"2px"}} color={"gray"}/></Link>;
      case "INVOICE_DUE":
        return (<><Text style={timelineTextStyle}>Follow-up {item.count} invoice(s) due of total ${item.invoice_due}</Text></>)
      default:
        return <Link>Event</Link>;
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
        <Text style={{fontWeight:"bold", fontSize:"small", fontFamily:"Courier New", backgroundColor:"#f6f6f6", padding:4, borderRadius:4 }}>{itemData.formatted_time}</Text> -{" "}
        {itemData.items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Text style={{color: "#9a9a9a"}}>{" and "}</Text>}
            {getTimelineText(itemData,item,index)}
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

  return (<>
    <Card
      styles={{ header: { borderBottom: 0 }}}
      title={
        <Flex direction="row" align={"center"} justify={"start"} gap={"small"}>
          <RiCalendarView />
          <span>{title}</span>
        </Flex>
      }
      style={{
        backgroundColor: color,
        width: title === 'Today' ? "600px":"350px",
        overflowWrap: "break-word",
        paddingRight:"10px",
        marginBottom: 10,
        borderRadius: "8px",
        textAlign: timelineItems.length > 0 ? "":"center",
      }}
    >
      {timelineItems.length > 0 ? <Timeline items={timelineItems} mode="left" style={{ margin: "20px 0",minWidth:title === 'Today' ? "580px":"330px",paddingRight:'10px' }} /> : (<><Card
        bordered={false}
        style={{ width: title === 'Today' ? "570px":"320px",boxShadow: "none", alignContent: "center" }}
        cover={<GiEmptyHourglass size={100} color={"lightblue"} />}
      >
        <Text color={"lightgray"} style={{fontSize:"14px", color:"#c4b1b1"}}>No activity found for this date.</Text>
      </Card></>)}
    </Card></>);
});

export default DailyTimeline;
