// src/components/CustomLayout.js
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  let navBarItems = [];
  let sideBarItems = [];
  let items = [];

  if (user == "tourist") {
    navBarItems = [];
    sideBarItems = [
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
    ];
  } else if (user == "admin") {
    navBarItems = [];
    sideBarItems = [{}];
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
