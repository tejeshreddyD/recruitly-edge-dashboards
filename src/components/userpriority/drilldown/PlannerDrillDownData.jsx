import { Tabs } from "antd";
import { CgWebsite } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";

import { CalendarOutlined } from "@ant-design/icons";
import PlannerJobApplicationsGrid from "@components/userpriority/drilldown/PlannerJobApplicationsGrid.jsx";
import PlannerGridTasks from "@components/userpriority/drilldown/PlannerTasksGrid.jsx";
import { Handshake, Microphone } from "@phosphor-icons/react";


const PlannerDrillDownData = ({type="TODAY",filterType="ALL",date = ""}) => {

  return (
      <div className={"planner-drilldown"} style={{paddingTop: "10px"}}>
          <Tabs
            tabPosition="left"
            defaultActiveKey="tasks"
            style={{ width: "100%", height: "100%",borderRight: 0 }}
            items={[
              {
                key: 'tasks',
                icon: <FaTasks />,
                label: 'Tasks/Reminders',
                children:<PlannerGridTasks type={type} filterType={filterType} date={date}/>
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
                children:<div>Events</div>
              },
              {
                key: 'interviews',
                icon: <Microphone />,
                label: 'Interviews',
                children:<div>Interviews</div>
              },
              {
                key: 'placement_starters',
                icon: <Handshake />,
                label: 'Placement Starters',
                children:<div>Placements</div>
              },
            ]}
          />
      </div>);
}

export default PlannerDrillDownData;