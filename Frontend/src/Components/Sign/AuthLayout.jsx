import React from "react";
import { Layout, theme, Flex } from "antd";
import { Colors } from "../Common/Constants";
import CustomButton from "../Common/CustomButton";
import { useNavigate } from "react-router-dom";
import image from "../../Assets/logo.svg";




const { Header, Content, Footer, Sider } = Layout;

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Flex
        align="center"
        style={{
          backgroundColor: colorBgContainer,
          fontSize: "40px",
          fontWeight: "900",
          textAlign: "left",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          height: "70px",
          padding: "0 20px",
        }}
      >
          <div id="logo" style={{ position: 'relative' }}>
            <img src={image} alt="Ajaza Logo" style={{ width: '155px', height: 'auto', position: 'absolute', left: -40 , top:-77}} />
           </div>

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
      </Flex>
      <Content>{children}</Content>
    </Layout>
  );
};

export default AuthLayout;
