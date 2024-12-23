import React, { useRef } from "react";
import { Breadcrumb, Card, Layout, Menu } from "antd";

import { CalendarOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from "@ant-design/icons";
import { FaTasks } from "react-icons/fa";
import { Alarm, Handshake, Microphone } from "@phosphor-icons/react";
import { CgWebsite } from "react-icons/cg";
import { AgGridReact } from "ag-grid-react";

const { Header, Content, Sider } = Layout;

const PlannerDrillDownData = ({type="Today",filterType="ALL"}) => {

  const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));

  const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
      const key = String(index + 1);

      return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,

        children: new Array(4).fill(null).map((_, j) => {
          const subKey = index * 4 + j + 1;
          return {
            key: subKey,
            label: `option${subKey}`,
          };
        }),
      };
    },
  );

  const gridRef = useRef(null);

  const columnDef = [{
    field: "name",
    title: "Name",
  }]

  return (
      <Layout>
        <Sider width={200} style={{/*{ background: colorBgContainer }*/}}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
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
        <Layout style={{ padding: '0 24px 24px' }}>
          <Card bordered={false} title={type} styles={{header:{border:0},body:{height:100}}} content={"Content goes here..."}>
           <AgGridReact
                        gridRef={gridRef}
           columnDefs={[]}/>
          </Card>

        </Layout>
      </Layout>
  );
}

export default PlannerDrillDownData;