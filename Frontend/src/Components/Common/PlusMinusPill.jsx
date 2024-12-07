import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Colors } from "./Constants";
import "./PlusMinusPill.css";

const PlusMinusPill = ({
  handlePlus,
  handleMinus,
  handleDelete,
  quantity,
  style,
  containerHeight = 42,
  iconSize = 16,
}) => {
  const height = containerHeight;
  const iconStyle = {
    display: "flex",
    justifyContent: "center",
    borderRadius: "50%",
    height: height,
    width: height,
    fontSize: iconSize,
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid",
        borderColor: Colors.grey[100],
        borderRadius: "25px",
        width: height * 2.5,
        height: height,
        fontSize: "17px",
        ...style,
      }}
    >
      {quantity > 1 ? (
        <MinusOutlined
          className="plusMinusIcon"
          style={{ ...iconStyle, marginRight: "auto" }}
          onClick={handleMinus}
        />
      ) : (
        <DeleteOutlined
          className="plusMinusIcon"
          style={{ ...iconStyle, marginRight: "auto" }}
          onClick={handleDelete}
        />
      )}
      {quantity}
      <PlusOutlined
        className="plusMinusIcon"
        style={{ ...iconStyle, marginLeft: "auto" }}
        onClick={handlePlus}
      />
    </div>
  );
};

export default PlusMinusPill;
