import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TagsOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  CalendarOutlined,
  NumberOutlined,
  StarOutlined,
  MenuUnfoldOutlined,
  ExclamationCircleOutlined,
  WarningFilled,
  UserOutlined,
  BellFilled,
  FileOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Flex,
  message,
  Modal,
  Typography,
  Dropdown,
} from "antd";
import IconFloatButton from "../Common/IconFloatButton";
import { apiUrl, Colors, getSetNewToken } from "../Common/Constants";
import image from "../../Assets/logo-cropped.svg";
import { useAdminMenuKey } from "./AdminMenuKeyContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";

const { Title } = Typography;
const { Header, Sider, Content } = Layout;

const AdminCustomLayout = ({ children }) => {
  const { selectedMenuKey, updateSelectedMenuKey } = useAdminMenuKey();
  const navigate = useNavigate();
  //  const [user, setUser] = useState("");
  const [userid, setUserid] = useState();
  const [role, setRole] = useState();
  const [Unseennotifications, setUnseenNotifications] = useState([]);
  const [allnotifications, setAllNotifications] = useState([]);
  const UnseennotificationsRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserid(decodedToken.userDetails._id);
      setRole(decodedToken.role);
      setAllNotifications(decodedToken.userDetails.notifications || []);
      const unseenNotifications =
        decodedToken.userDetails?.notifications?.filter(
          (notification) => !notification.seen
        ) || [];
      console.log("Unseen notifications:", unseenNotifications);
      console.log("All notifications:", allnotifications);
      UnseennotificationsRef.current = unseenNotifications;
      const allNotifications = decodedToken.userDetails?.notifications || [];
      setUnseenNotifications(unseenNotifications);
    }
  }, [isOpen]);

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
      {allnotifications.length > 0 ? (
        [...allnotifications].reverse().map((notification) => (
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
                width: "100%",
                textAlign: "left",
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
                    notification.activityId ? "View Activity" : "View Itinerary"
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
          <strong>No notifications available</strong>
        </Menu.Item>
      )}
    </Menu>
  );

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

  const [navBarItems, setNavBarItems] = useState(
    <Flex
      align={"center"}
      justify="center"
      style={{ width: "100%", position: "relative" }}
    >
      <div id="logo" style={{ position: "relative", right: 40, bottom: 3 }}>
        <img src={image} alt="Ajaza Logo" style={{ width: "58px" }} />
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
              setIsOpen(visible);
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
      </Flex>
    </Flex>
  );

  useEffect(() => {
    setNavBarItems(
      <Flex
        align={"center"}
        justify="center"
        style={{ width: "100%", position: "relative" }}
      >
        <div id="logo" style={{ position: "relative", right: 40, bottom: 3 }}>
          <img src={image} alt="Ajaza Logo" style={{ width: "58px" }} />
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
                setIsOpen(visible);
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
        </Flex>
      </Flex>
    );
  }, [allnotifications]);

  const [showManageOptions, setShowManageOptions] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const markNotificationsAsSeen = async (userid) => {
    console.log("Marking notifications as seen for user:", userid);
    try {
      const response = await axios.post(
        `${apiUrl}admin/seeNotifications/${userid}`,
        {}
      );
      if (response.status === 200) {
        console.log("Notifications marked as seen successfully");
        await getSetNewToken(userid, "admin");
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

  useEffect(() => {
    if (isOpen) {
      markNotificationsAsSeen(userid).finally(() => {
        setIsOpen(false); // Reset isOpen to false
      });
    }
  }, [isOpen, userid]);

  const handleMenuClick = ({ key }) => {
    updateSelectedMenuKey(key);
    localStorage.setItem("selectedMenuKey", key);
    if (key === "setting:2") {
      navigate("/admin");
    } else if (key === "5") {
      navigate("/Admin/manage-activity-categories"); // New navigation for activity categories
    } else if (key === "210") {
      navigate("/Admin/deletionRequests");
    } else if (key === "setting:1") {
      navigate("/Admin/add-Accounts");
    } else if (key === "setting:3") {
      navigate("/Admin/examine-Accounts");
    } else if (key === "99") {
      navigate("/Admin/tourists-Complaints");
    } else if (key === "97") {
      navigate("/Admin/events");
    } else if (key === "96") {
      navigate("/Admin/itinerariesAdmin");
    } else if (key === "11") {
      navigate("/Admin/preference-tags");
    } else if (key == "12") {
      navigate("products");
    } else if (key == "13") {
      navigate("myProducts");
    } else if (key == "74") {
      navigate("/Admin/promocode");
    } else if (key == "100") {
      navigate("/Admin/report");
    } else if (key == "14") {
      navigate("change-password");
    } else if (key == "15") {
      navigate("archive");
    }
  };

  const commonStyle = {
    color: "black",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed && !hover}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ backgroundColor: Colors.primary.default }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          //theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedMenuKey]}
          onClick={handleMenuClick}
          style={{
            transition: "all 0.3s ease",
            backgroundColor: Colors.primary.default,
            color: "black",
          }}
          items={[
            {
              key: "5",
              icon: <StarOutlined style={{ color: "black" }} />,
              label: "Activity Categories",
              style: commonStyle,
            },
            {
              key: "6",
              icon: <UserOutlined style={{ color: "black" }} />,
              label: "Accounts",
              style: commonStyle,

              children: [
                {
                  label: "Pending Accounts",
                  key: "setting:3",
                  style: commonStyle,
                },
                //{
                // label: "Add Accounts",
                //   key: "setting:1",
                //   style: commonStyle,
                //  },
                {
                  label: "Accepted Accounts",
                  key: "setting:2",
                  style: commonStyle,
                },
                {
                  label: "Deletion Requests",
                  key: "210",
                  style: commonStyle,
                },
              ],
            },
            {
              key: "11",
              icon: <NumberOutlined />,
              label: "Preference Tags",
              style: commonStyle,
            },
            {
              key: "74",
              icon: <TagsOutlined />,
              label: "Promo Codes",
              style: commonStyle,
            },
            // {
            //   key: "44",
            //   icon: <TeamOutlined />,
            //   label: "User Stats",
            //   style: commonStyle,
            // },
            {
              key: "12",
              icon: <NumberOutlined />,
              label: "Products",
              style: commonStyle,
            },
            {
              key: "13",
              icon: <NumberOutlined />,
              label: "My Products",
              style: commonStyle,
            },
            {
              key: "15",
              icon: <NumberOutlined />,
              label: "Archived Products",
              style: commonStyle,
            },
            {
              key: "14",
              icon: <StarOutlined />,
              label: "Change Password",
              style: commonStyle,
            },
            {
              key: "96",
              icon: <CalendarOutlined />,
              label: "Itineraries",
              style: commonStyle,
            },
            {
              key: "97",
              icon: <CalendarOutlined />,
              label: "Activities",
              style: commonStyle,
            },
            {
              key: "99",
              icon: <ExclamationCircleOutlined />,
              label: "Complaints",
              style: commonStyle,
            },
            {
              key: "100",
              icon: <FileOutlined />,
              label: "Sales Report",
              style: commonStyle,
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
            margin: "40px 50px",
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
