import React from "react";
import Icon, { QuestionCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import "./IconButton.css";
import { Colors } from "./Constants";

const IconButton = ({
  icon,
  color = Colors.grey[900],
  badge,
  backgroundColor,
  size = 60,
  fontSize = 30,
  onClick,
}) => {
  // Check documentation for badge types https://ant.design/components/float-button
  return (
    <div className="iconButton">
      <FloatButton
        shape="circle"
        badge={badge}
        onClick={onClick}
        style={{
          backgroundColor: backgroundColor,
          position: "relative",
          bottom: 0,
          width: `${size}px`,
          height: `${size}px`,
          insetInlineEnd: 0,
        }}
        icon={
          <Icon
            component={icon}
            style={{
              width: "100%",
              fontSize: `${fontSize}px`,
              color: color,
            }}
            width={"100%"}
          />
        }
      />
    </div>
  );
};

export default IconButton;
