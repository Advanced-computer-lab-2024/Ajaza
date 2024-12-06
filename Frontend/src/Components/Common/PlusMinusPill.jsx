import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Colors } from "./Constants";
import "./PlusMinusPill.css";

const height = 35;
const iconStyle = {
  display: "flex",
  justifyContent: "center",
  borderRadius: "50%",
  height: height,
  width: height,
};

const PlusMinusPill = ({
  handlePlus,
  handleMinus,
  handleDelete,
  quantity,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid",
        borderColor: Colors.grey[100],
        borderRadius: "20px",
        width: "90px",
        height: height,
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
