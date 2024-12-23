import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';

import { CalendarOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from "@ant-design/icons";
import { FaTasks } from "react-icons/fa";
import { Alarm, Handshake, Microphone } from "@phosphor-icons/react";
import { CgWebsite } from "react-icons/cg";

const { Header, Content, Sider } = Layout;

const PlannerDrillDownData = () => {

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
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              //background: colorBgContainer,
              //borderRadius: borderRadiusLG,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
  );
}

export default PlannerDrillDownData;