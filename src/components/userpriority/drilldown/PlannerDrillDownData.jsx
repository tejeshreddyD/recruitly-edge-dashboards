import { Layout, Menu } from "antd";
import { CgWebsite } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import { HashRouter as Router, Link, Route, Routes } from "react-router-dom";

import { CalendarOutlined } from "@ant-design/icons";
import PlannerGridTasks from "@components/userpriority/drilldown/PlannerTasksGrid.jsx";
import { Handshake, Microphone } from "@phosphor-icons/react";
import { useState } from "react";
import PlannerJobApplicationsGrid from "@components/userpriority/drilldown/PlannerJobApplicationsGrid.jsx";


const { Sider } = Layout;

const PlannerDrillDownData = ({type="TODAY",filterType="ALL",date = ""}) => {

  const [selectedKey, setSelectedKey] = useState("tasks");

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Navigate to the route
  };

  return (<Router>
      <Layout>
        <Sider width={200} style={{background :"#ffffff",height:"100%"}}>
          <Menu
            mode="inline"
            selectedKey={selectedKey}
            defaultSelectedKey={selectedKey}
            style={{ borderRight: 0 }}
            onClick={handleMenuClick}
            items={[
              {
                key: 'tasks',
                icon: <FaTasks />,
                label: <Link to={"/tasks"}>Tasks/Reminders</Link>,
              },
              {
                key: 'job_applications',
                icon: <CgWebsite />,
                label: <Link to={"/job_applications"}>Job Applications</Link>,
              },
              {
                key: 'events',
                icon: <CalendarOutlined />,
                label: <Link to={"/events"}>Calendar Events</Link>,
              },
              {
                key: 'interviews',
                icon: <Microphone />,
                label: <Link to={"/interviews"}>Interviews</Link>,
              },
              {
                key: 'placement_starters',
                icon: <Handshake />,
                label: <Link to={"/placement_starters"}>Placement Starters</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{height: "80vh" }}>

          <Routes>
            <Route path={"/tasks"} element={<PlannerGridTasks type={type} filterType={filterType} date={date}/>}/>
            <Route path={"/job_applications"} element={<PlannerJobApplicationsGrid/>}/>
            <Route path={"/events"} element={<div>Events</div>}/>
            <Route path={"/interviews"} element={<div>Interviews</div>}/>
            <Route path={"/placement_starters"} element={<div>Placement starters</div>}/>
          </Routes>

        </Layout>
      </Layout>
  </Router>);
}

export default PlannerDrillDownData;