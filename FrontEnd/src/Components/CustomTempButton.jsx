import React from "react";
import { Colors } from "./Constants";
import { SearchOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";

// CircularButton component
const CircularButton = ({
  icon,
  onClick,
  size = 50,
  fontSize = "30px", // Size of icon
  backgroundColor = Colors.primary.default,
  iconColor = "#FFFFFF",
}) => {
  // Styles for the circular button
  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: `${size}px`, // Button width
    height: `${size}px`, // Button height
    borderRadius: "50%", // Makes the button circular
    backgroundColor: backgroundColor, // Background color of the button
    border: "none", // No border
    cursor: "pointer", // Pointer cursor on hover
    outline: "none", // Remove outline
    transition: "background-color 0.3s", // Transition for hover effect
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      <Icon component={icon} style={{ color: iconColor, fontSize: fontSize }} />
    </button>
  );
};

export default CircularButton;
