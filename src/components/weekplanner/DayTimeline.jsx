import React, { useMemo } from "react";
import { Card, Flex, List, Tag, Timeline, Tooltip, Typography } from "antd";
import { CgWebsite } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";
import { FaFileInvoice, FaHandshake, FaMicrophone, FaRegCheckCircle, FaTasks } from "react-icons/fa";
import { GiEmptyHourglass } from "react-icons/gi";
import { IoFlash, IoOpenOutline } from "react-icons/io5";
import { MdAlarm } from "react-icons/md";
import { RiCalendarView } from "react-icons/ri";

import { VISTA_URL } from "@constants";
import { Alarm, PhoneCall } from "@phosphor-icons/react";
import { dashboardAction, dashboardActionCode, recordType } from "@utils/actionsUtil.js";
import { FaRegCircleDot } from "react-icons/fa6";
import { extractTimeFromTimestamp } from "@utils/dateUtil.js";

const { Text, Link } = Typography;

const DailyTimeline = React.memo(({ title = "Today", color = "#f0f6ff", items = [],reminderViewer}) => {

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
      CUSTOM_ACTION:<IoFlash style={{ fontSize: "16px", color: "#faad14" }} />,
      INVOICE_DUE:<FaFileInvoice style={{ fontSize: "16px", color: "#faad14" }} />,
      DEFAULT: <MdAlarm style={{ fontSize: "16px", color: "#f5222d" }} />,
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
        return (<><Link href={'#'} onClick={(e) => dashboardAction(e,dashboardActionCode.VIEW_TASK,{records:[{id:item.id}]})} style={timelineTextStyle}>Task is due with subject <Text style={{fontWeight:500}}>{item?.subject}</Text></Link>
          {item.records.length > 0 ? <div>{item.records.map((rec, index) => (rec.reference ? <Tooltip key={index} style={{fontSize:10}} title={`View ${recordType(rec.reference).toLowerCase()}`}>
            <Tag color={"blue"} style={{fontSize:10, marginLeft:"1px",cursor:"pointer"}} key={index} onClick={(e) => handleLinkClick(e, {_id:rec.id,type:recordType(rec.reference)})} href={"#"}>
              {rec.name}
            </Tag>
          </Tooltip>:''))}</div>:""}</>);
      case "OVERDUE_TASK":
        return <Link href={`${VISTA_URL}/reminders?type=OVERDUE_TASK&date=${item.time}`} style={timelineTextStyle}>{index > 0 ?'':'Review'}{' '}{item.count} overdue Task(s)<IoOpenOutline style={{paddingLeft:"2px"}} color={"gray"}/></Link>;
      case "REMINDER":
        return (<><Link href={'#'} onClick={(e) => reminderViewer(e,item.id[0])} style={timelineTextStyle}>Reminder is due</Link>
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

        return (<>
          <Link href={"#"} onClick={(e) => dashboardAction(e,dashboardActionCode.VIEW_CALENDAR_EVENT,{records:[{id:item.eventId}]})} style={timelineTextStyle}>
            {item.title}
          </Link>{item.attendees.length > 0 ? <div><Tag color={"magenta"} style={{fontSize:'10px'}}>{`${extractTimeFromTimestamp(item.startDate)} - ${extractTimeFromTimestamp(item.endDate)}`}</Tag> {item.attendees.map((rec, index) => (<Tooltip key={index} style={{fontSize:10}} title={`View ${rec.type.toLowerCase()}`}>
          <Tag color={"blue"} style={{fontSize:10, marginLeft:"1px",cursor:"pointer"}} key={index} onClick={(e) => handleLinkClick(e, {_id:rec._id,type:rec.type})} href={"#"}>
            {rec.label}
          </Tag>
        </Tooltip>))}</div>:""}
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
      boxShadow: "none",
    };

    return (
      <Card style={textStyle} bordered={false} styles={{header:{minHeight:'20px',padding:0,fontWeight:600,fontSize:'14px',border:0},body:{padding:0}}} title={itemData.formatted_time}>
        <List
          itemLayout="horizontal"
          style={{border:0}}
          dataSource={itemData.items}
          renderItem={(item, index) => (
            <List.Item style={{alignItems:'center',justifyContent:"center"}}>
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                description={getTimelineText(itemData,item,index)}
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  const timelineItems = useMemo(
    () =>
      items.map((itemData) => ({
        children: renderPlannerText(itemData),
        dot: <FaRegCircleDot size={18} color={'#89CFF0'}/>,
      })),
    [items]
  );

  return (<>
    <Card
      styles={{ header: { borderBottom: 0,paddingLeft:'10px' }}}
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
