import React, { useState } from "react";
import { Button as AntdButton } from "antd";
import { Colors } from "./Constants";

const Button = ({ size, style, rounded, value, onClick }) => {
  const [hover, setHover] = useState(false);

  let width = null;
  let height = null;
  let borderRadius = null;
  let fontSize = null;
  let fontWeight = null;
  let margin = null;
  let backgroundColor = hover ? Colors.primary.light : Colors.primary.default;

  if (size === "s") {
    width = "100px";
    height = "40px";
    borderRadius = rounded ? "16px" : "10px";
    fontSize = "14px";
    margin = "10px";
    fontWeight = "500";
    margin = "10px";
  } else if (size === "m") {
    width = "150px";
    height = "60px";
    borderRadius = rounded ? "28px" : "15px";
    fontSize = "20px";
    fontWeight = "bold";
    margin = "15px";
  } else {
    width = "200px";
    height = "70px";
    borderRadius = rounded ? "50px" : "20px";
    fontSize = "26px";
    fontWeight = "bold";
    margin = "20px";
  }
  console.log("render");

  return (
    <AntdButton
      type="primary"
      style={{
        backgroundColor: backgroundColor,
        width: width,
        height: height,
        borderRadius: borderRadius,
        fontSize: fontSize,
        fontWeight: fontWeight,
        margin: margin,
        ...style,
      }}
      onClick={() => onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {value}
    </AntdButton>
  );
};

export default Button;
