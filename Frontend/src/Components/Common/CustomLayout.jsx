import React, { useEffect, useState, useRef } from "react";
import Icon, {
  BellFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WarningFilled,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ContainerOutlined,
  HourglassFilled,
} from "@ant-design/icons";
import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Flex,
  Button,
  Layout,
  Menu,
  theme,
  message,
  Modal,
  Dropdown,
  Badge,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";

import IconFloatButton from "./IconFloatButton";
import { apiUrl, getSetNewToken, Colors } from "./Constants";
import CustomButton from "./CustomButton";
import { jwtDecode } from "jwt-decode";
import image from "../../Assets/logo-cropped.svg";
import style from "./CustomLayout.module.css";
import axios from "axios";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

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
  
  const [Unseennotifications, setUnseenNotifications] = useState([]);
  const [allnotifications, setAllNotifications] = useState([]);
  const UnseennotificationsRef = useRef([]);
  const navigate = useNavigate();
  const guestNavBarItems = (
    <div style={{ display: "flex", marginLeft: "auto" }}>
      <div
        id="logo"
        style={{ position: "relative", bottom: 3, marginRight: "450px" }}
      >
        <img
          src={image}
          alt="Ajaza Logo"
          style={{
            width: "58px",
          }}
        />
      </div>
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
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.userDetails);

      const unseenNotifications =
        decodedToken.userDetails?.notifications?.filter(
          (notification) => !notification.seen
        ) || [];
      UnseennotificationsRef.current = unseenNotifications;
      const allNotifications = decodedToken.userDetails?.notifications || [];
      const userid = decodedToken.userDetails._id;

      const notificationMenu = (
        <Menu
          style={{
            maxHeight: 500,
            overflowY: "auto",
            width: 300,
            padding: "10px",
          }}
        >
          <div className="notification-header" style={{ marginBottom: "15px" }}>
            <Title level={3}>Notifications</Title>
            <p>Keep track of all your updates and messages here.</p>
          </div>
          {allNotifications.length > 0 ? (
            [...allNotifications].reverse().map((notification) => (
              <Menu.Item key={notification._id} style={{ padding: 0 }}>
                <div
                  className={`notification-item ${
                    notification.seen ? "seen" : "unseen"
                  }`}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: notification.seen ? "#f0f0f0" : "#d4f8d4", // Light green for unseen
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="notification-text" style={{ flex: 1 }}>
                    {notification.text}
                  </div>
                  {/* Show button if activityId or itineraryId exists */}
                  {(notification.activityId || notification.itineraryId) && (
                    <CustomButton
                      size="xs"
                      rounded={true}
                      style={{
                        backgroundColor: "#1b696a",
                        color: "#fff",
                        border: "1px solid #4caf50",
                      }}
                      value={
                        notification.activityId
                          ? "View Activity"
                          : "View Itinerary"
                      }
                      onClick={() => {
                        if (notification.activityId) {
                          navigate(
                            `/tourist/activities/${notification.activityId}`
                          );
                        } else if (notification.itineraryId) {
                          navigate(
                            `/tourist/itineraries/${notification.itineraryId}`
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </Menu.Item>
            ))
          ) : (
            <Menu.Item disabled style={{ textAlign: "center" }}>
              No notifications available
            </Menu.Item>
          )}
        </Menu>
      )
      const markNotificationsAsSeen = async (userid) => {
        console.log("Marking notifications as seen for user:", userid);
        try {
          const response = await axios.post(
            `${apiUrl}tourist/seeNotifications/${userid}`,
            {} // Empty body as required by API
          );
          if (response.status === 200) {
            console.log("Notifications marked as seen successfully");
            const updatedNotifications = allnotifications.map((notification) => ({
              ...notification,
              seen: true,
            }));
            setAllNotifications(updatedNotifications);
            setUnseenNotifications([]); // Reset the unseen notifications count
            UnseennotificationsRef.current = [];
          }
        } catch (error) {
          console.error("Error marking notifications as seen:", error.message);
        }
      };

      setNavBarItems(
        <Flex justify="center" style={{ width: "100%", position: "relative" }}>
          <div id="logo" style={{ position: "relative", right: 40, bottom: 3 }}>
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
            <Dropdown
              overlay={notificationMenu}
              trigger={["click"]}
              onVisibleChange={(visible) => {
                if (visible) {
                  markNotificationsAsSeen(userid);
                  UnseennotificationsRef.current = [];
                }
              }}
            >
              <div onClick={(e) => e.preventDefault()}>
                <IconFloatButton
                  icon={BellFilled}
                  badge={{ count: UnseennotificationsRef.current.length }}
                />
              </div>
            </Dropdown>

            {decodedToken.role === "tourist" && (
              <IconFloatButton
                icon={ShoppingCartOutlined}
                onClick={() =>
                  navigate(`/${decodedToken.role}/cart/${decodedToken.userId}`)
                }
                style={{ marginLeft: "20px" }}
              />
            )}
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
            {(decodedToken.role == "governor" ||
              decodedToken.role == "admin") && (
              <div
                className="hover"
                style={{
                  display: "flex",
                  marginLeft: "20px",
                  fontWeight: "bold",
                  color: Colors.warning,
                }}
                onClick={confirmLogOut}
              >
                Log Out
              </div>
            )}
          </Flex>
        </Flex>
      );
    }
  }, []);

  const confirmLogOut = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to log out?",
      // content: "This action is irreversable",
      okText: "Log Out",
      okType: "danger",
      icon: <WarningFilled style={{ color: "#ff4d4f" }} />,
      onOk: () => {
        localStorage.removeItem("token");
        message.success("Logged Out");
        navigate("/");
      },
    });
  };

  

  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem("selectedMenuKey") || "1"
  );

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    localStorage.setItem("selectedMenuKey", e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed && !hover}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundColor: "#1b696a",
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          //theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          items={sideBarItems}
          onClick={handleMenuClick}
          style={{
            backgroundColor: "#1b696a",
            color: "black",
          }}
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
