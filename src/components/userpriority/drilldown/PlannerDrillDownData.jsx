import { Layout, Menu } from "antd";
import { CgWebsite } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";

import { CalendarOutlined } from "@ant-design/icons";
import PlannerGridTasks from "@components/userpriority/drilldown/PlannerTasksGrid.jsx";
import { Handshake, Microphone } from "@phosphor-icons/react";

const { Sider } = Layout;

const PlannerDrillDownData = ({type="Today",filterType="ALL"}) => {

  return (
      <Layout>
        <Sider width={200} style={{background :"#ffffff",height:"100%"}}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ borderRight: 0 }}
            items={[
              {
                key: '1',
                icon: <FaTasks />,
                label: 'Tasks/Reminders',
              },
              {
                key: '2',
                icon: <CgWebsite />,
                label: 'Job Applications',
              },
              {
                key: '3',
                icon: <CalendarOutlined />,
                label: 'Calendar Events',
              },
              {
                key: '4',
                icon: <Microphone />,
                label: 'Interviews',
              },
              {
                key: '5',
                icon: <Handshake />,
                label: 'Placement starters',
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px',height: "80vh" }}>

          <PlannerGridTasks/>

        </Layout>
      </Layout>
  );
}

export default PlannerDrillDownData;