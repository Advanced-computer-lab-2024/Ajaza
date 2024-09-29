import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ContainerOutlined,
  HourglassFilled,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

import { IconButton } from "../Components";
import { Colors } from "../Components/Constants";

const { Header, Sider, Content } = Layout;

const CustomLayout = ({ children }) => {
  const testFunction = () => {
    console.log("Test");
  };
  const [user, setUser] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  let navBarItems = [];
  let sideBarItems = [];
  let items = [];

  if (user == "Tour Guide") {
    navBarItems = [];
    sideBarItems = [
      {
        key: "1",
        icon: <CalendarOutlined />,
        label: "Itineraries",
        onClick: () => navigate("/itineraries"),
      },
      {
        key: "2",
        icon: <ContainerOutlined />,
        label: "Report",
      },
      {
        key: "3",
        icon: <CalendarOutlined />,
        label: "Tourists's itineraries",
      },
            // {
      //   key: "4",
      //   icon: <CalendarOutlined />,
      //   label: "Actiivities",
      // },
    ];
  } else if (user == "Tourism Governor") {
    navBarItems = [];
    sideBarItems = [
      {
        key: "1",
        icon: <CalendarOutlined />,
        label: "Itineraries",
      },
      // {
      //   key: "5",
      //   icon: <CalendarOutlined />,
      //   label: "Actiivities",
      // },
      {
        key: "2",
        icon: <HourglassFilled />,
        label: "Museums",
      },
      {
        key: "3",
        icon: <HourglassFilled />,
        label: "Historical places",
      },
      {
        key: "4",
        icon: <HourglassFilled />,
        label: "Tags or Historical locations",
      }
    ];
  } else if (user == "Advertiser") {
    navBarItems = [];
    sideBarItems = [
      {
        key: "1",
        icon: <CalendarOutlined />,
        label: "Itineraries",
      },
      {
        key: "2",
        icon: <CalendarOutlined />,
        label: "Actiivities",
      },
      {
        key: "3",
        icon: <HourglassFilled />,
        label: "Museums",
      },
      {
        key: "4",
        icon: <HourglassFilled />,
        label: "Historical places",
      },
      {
        key: "5",
        icon: <ContainerOutlined />,
        label: "Report",
      },
    ];
  }

  //in seller navbar to have profile icon
  //sidebar: product
  else if (user == "seller") {
    navBarItems = [];
    sideBarItems = [{}];
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed && !hover}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout>
      <NavBar />
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;