import React, { useEffect, useState } from "react";
import Icon, {
  BellFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ContainerOutlined,
  HourglassFilled,
} from "@ant-design/icons";
import { Flex, Button, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

import IconFloatButton from "./IconFloatButton";
import { Colors } from "./Constants";
import CustomButton from "./CustomButton";
import { jwtDecode } from "jwt-decode";
import image from "../../Assets/logo.svg";

const { Header, Sider, Content } = Layout;

const CustomLayout = ({
  userType = "Tour Guide",
  guest,
  children,
  sideBarItems,
}) => {
  // navBar:Boolean true->Normal navbar, false-> landing page navBar
  const testFunction = () => {
    console.log("Test");
  };
  const [user, setUser] = useState("");
  const [navBarItems, setNavBarItems] = useState(
    <Flex align={"center"} style={{ marginLeft: "auto" }}>
      <IconFloatButton icon={BellFilled} badge={{ count: 5 }} />
      <UserOutlined
        className="hover"
        style={{ fontSize: "20px", marginLeft: "30px" }}
      />
    </Flex>
  );
  const [collapsed, setCollapsed] = useState(true);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const guestNavBarItems = (
    <div style={{ marginLeft: "auto" }}>
      <CustomButton
        size={"s"}
        value={"Sign in"}
        onClick={() => navigate("/auth/signin")}
      />
      <CustomButton
        size={"s"}
        value={"Sign up"}
        style={{ marginLeft: "20px" }}
        onClick={() => navigate("/auth/signup")}
      />
    </div>
  );
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUser(decodedToken.userDetails);

    setNavBarItems(
      <Flex align={"center"} style={{ marginLeft: "auto" }}>
        <IconFloatButton icon={BellFilled} badge={{ count: 5 }} />
        <UserOutlined
          className="hover"
          style={{ fontSize: "20px", marginLeft: "30px" }}
          onClick={() => {
            navigate(`/profile`);
          }}
        />
      </Flex>
    );
  }, []);
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
          items={sideBarItems}
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
          {guest ? guestNavBarItems : navBarItems}
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
