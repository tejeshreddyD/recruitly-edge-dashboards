import { Tabs } from "antd";
import { CgWebsite } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";

import { CalendarOutlined } from "@ant-design/icons";
import PlannerJobApplicationsGrid from "@components/userpriority/drilldown/PlannerJobApplicationsGrid.jsx";
import PlannerGridTasks from "@components/userpriority/drilldown/PlannerTasksGrid.jsx";
import { Handshake, Microphone } from "@phosphor-icons/react";
import PlannerCalendarEventsGrid from "@components/userpriority/drilldown/PlannerCalendarEventsGrid.jsx";
import DayTimeline from "@components/userpriority/DayTimeline.jsx";
import PlannerDailyTimeline from "@components/userpriority/drilldown/PlannerDrilldownTimeline.jsx";


const PlannerDrillDownData = ({type="TODAY",filterType="ALL",viewType="FULL_DAY",date = 0, data=[]}) => {

  return (
      <div className={"planner-stats-tab"} style={{height:"100vh", width:"100%",paddingTop: "10px"}}>
        <PlannerDailyTimeline items={data} filterType={filterType} />
          {/*<Tabs
            tabPosition="left"
            defaultActiveKey="tasks"
            style={{ width: "100%", height: "100%",borderRight: 0 }}
            items={[
              {
                key: 'tasks',
                icon: <FaTasks />,
                label: 'Tasks/Reminders',
                children:<PlannerGridTasks type={type} date={date} viewType={viewType} />
              },
              {
                key: 'job_applications',
                icon: <CgWebsite />,
                label:'Job Applications',
                children:<PlannerJobApplicationsGrid/>
              },
              {
                key: 'events',
                icon: <CalendarOutlined />,
                label: 'Calendar Events',
                children:<PlannerCalendarEventsGrid/>
              },
              {
                key: 'interviews',
                icon: <Microphone />,
                label: 'Interviews',
                children:<PlannerCalendarEventsGrid eventType={"INTERVIEW"}/>
              },
              {
                key: 'placement_starters',
                icon: <Handshake />,
                label: 'Placement Starters',
                children:<div>Placements</div>
              },
            ]}
          />*/}
      </div>);
}

export default PlannerDrillDownData;