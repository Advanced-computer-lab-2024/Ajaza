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
import image from "../../Assets/logo-cropped.svg";
import style from "./CustomLayout.module.css";

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
      <Flex justify="center" style={{ width: "100%", position: "relative" }}>
        <div
          id="logo"
          style={{ position: "relative", right: 40, bottom: 3 }}
          onClick={() => navigate("/")}
        >
          <img
            src={image}
            alt="Ajaza Logo"
            style={{
              width: "58px",
            }}
          />
        </div>
        <Flex
          align={"center"}
          style={{
            position: "absolute",
            right: "28px",
            top: "0",
            bottom: "0",
            margin: "auto 0",
          }}
        >
          <IconFloatButton icon={BellFilled} badge={{ count: 5 }} />
          {decodedToken.role !== "governor" &&
            decodedToken.role !== "admin" && (
              <UserOutlined
                className="hover"
                style={{ fontSize: "20px", marginLeft: "30px" }}
                onClick={() => {
                  navigate(`/${decodedToken.role}/profile`);
                }}
              />
            )}
        </Flex>
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
          className={style.navShadow}
          style={{
            background: colorBgContainer,
            display: "flex",
            padding: 0,
            paddingRight: 0,
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
