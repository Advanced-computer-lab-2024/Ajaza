import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  NumberOutlined,
  StarOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DownOutlined,
  BellFilled,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Flex } from "antd";
import IconFloatButton from "../Common/IconFloatButton";

const { Header, Sider, Content } = Layout;

const AdminCustomLayout = ({ children }) => {
  const navigate = useNavigate();
  //  const [user, setUser] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [hover, setHover] = useState(false);
  const [navBarItems, setNavBarItems] = useState(
    <Flex align={"center"} style={{ marginLeft: "auto" }}>
      <IconFloatButton icon={BellFilled} badge={{ count: 5 }} />
      <UserOutlined
        className="hover"
        style={{ fontSize: "20px", marginLeft: "30px" }}
      />
    </Flex>
  );
  const [showManageOptions, setShowManageOptions] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === "setting:2") {
      navigate("/admin");
    } else if (key === "5") {
      navigate("/Admin/manage-activity-categories"); // New navigation for activity categories
    } else if (key === "setting:1") {
      navigate("/Admin/add-Accounts");
    }
    else if (key === "setting:3") {
      navigate("/Admin/examine-Accounts");

    } else if (key === "11") {
      navigate("/Admin/preference-tags");
    } else if (key == "12") {
      navigate("products");
    } else if (key == "13") {
      navigate("myProducts");
    }
  };

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
          onClick={handleMenuClick}
          style={{ transition: "all 0.3s ease" }}
          items={[
            {
              key: "5",
              icon: <StarOutlined />,
              label: "Activity Categories",
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Accounts",

              children: [
                {
                  label: "Examine Accounts",
                  key: "setting:3"
                },
                {
                  label: "Add Accounts",
                  key: "setting:1",
                },
                {
                  label: "All Accounts",
                  key: "setting:2",
                },
              ],
            },
            {
              key: "11",
              icon: <NumberOutlined />,
              label: "Preference Tags",
            },
            {
              key: "12",
              icon: <NumberOutlined />,
              label: "Products",
            },
            {
              key: "13",
              icon: <NumberOutlined />,
              label: "My Products",
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
            paddingRight: "20px",
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
          {navBarItems}
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

export default AdminCustomLayout;
