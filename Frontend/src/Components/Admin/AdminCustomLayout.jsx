import React, { useEffect, useState } from "react";
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
import { Button, Layout, Menu, theme, Flex, message, Modal } from "antd";
import IconFloatButton from "../Common/IconFloatButton";
import { Colors } from "../Common/Constants";

import image from "../../Assets/logo-cropped.svg";
import { useAdminMenuKey } from "./AdminMenuKeyContext";

const { Header, Sider, Content } = Layout;

const AdminCustomLayout = ({ children }) => {
  const { selectedMenuKey, updateSelectedMenuKey } = useAdminMenuKey();
  const navigate = useNavigate();
  //  const [user, setUser] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [hover, setHover] = useState(false);

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
  const [showManageOptions, setShowManageOptions] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    updateSelectedMenuKey(key);
    localStorage.setItem("selectedMenuKey", key);
    if (key === "setting:2") {
      navigate("/admin");
    } else if (key === "5") {
      navigate("/Admin/manage-activity-categories"); // New navigation for activity categories
    }
    else if(key === "210"){
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
    } else if(key == "74"){
      navigate("/Admin/promocode");
    }
    else if(key == "100"){
      navigate("/Admin/report");
    }
    else if(key == "44"){
      navigate("/Admin/numberOfUsers");
    }
    else if (key == "14") {
      navigate("change-password");
    } else if (key == "15") {
      navigate("archive");
    }
  };

  const commonStyle = {
    color: 'black', 
    };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed && !hover}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ backgroundColor: "#1b696a" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          //theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedMenuKey]}
          onClick={handleMenuClick}
          style={{ transition: "all 0.3s ease" , backgroundColor: "#1b696a" , color:"black"}}
          items={[ 
            {
              key: "5",
              icon: <StarOutlined />,
              label: "Activity Categories",
              style: commonStyle,
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Accounts",
              style: commonStyle,

              children: [
                {
                  label: "Pending Accounts",
                  key: "setting:3",
                  style: commonStyle,
                },
                {
                  label: "Add Accounts",
                  key: "setting:1",
                  style: commonStyle,
                },
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
              label: "PromoCode",
              style: commonStyle,
            },
            {
              key: "44",
              icon: <TeamOutlined />,
              label: "User Stats",
              style: commonStyle,
            },
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
              key:"100",
              icon:<FileOutlined />,
              label:"Sales Report",
              style: commonStyle,
            }
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
