import { Button, Col, Row, Flex, Grid } from "antd";
import React from "react";
import CustomButton from "./Common/CustomButton";
import image from "../Assets/landingPage.png";
import { Colors } from "./Common/Constants";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns: "40% 65%",
      }}
    >
      <Flex
        style={{ paddingLeft: "40px", textAlign: "left" }}
        vertical
        justify="center"
      >
        <h1 style={{ marginBottom: "3px", fontWeight: "900" }}>
          Welcome to{" "}
          <span style={{ color: Colors.primary.default }}>Ajaza</span>
        </h1>
        <h2 style={{ marginBottom: "15px", fontWeight: "bold" }}>
          Your Ultimate Tourism Experience{" "}
        </h2>
        <h5 style={{ color: Colors.grey[700] }}>
          Ajaza is a comprehensive tourism platform designed for tourists, tour
          guides, advertisers, sellers, and tourism administrators. Whether
          you're planning your next vacation, promoting an event, or selling
          products related to tourism, Ajaza has you covered.
        </h5>
        <Flex align="center" style={{ marginTop: "20px" }}>
          <CustomButton
            size="m"
            value={"Sign up"}
            onClick={() => navigate("/adminCustom")}
          />
          <CustomButton
            size="m"
            value={"Sign in"}
            onClick={() => navigate("/auth/signin")}
          />
          <a
            style={{ textDecoration: "underline", marginLeft: "35px" }}
            onClick={() => navigate("TODO/")}
          >
            Try as Guest
          </a>
        </Flex>
      </Flex>

      <Flex justify="center">
        <img
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            position: "relative",
            left: 40,
          }}
          src={image}
          alt=""
        />
      </Flex>
    </div>
  );
};

export default Landing;
