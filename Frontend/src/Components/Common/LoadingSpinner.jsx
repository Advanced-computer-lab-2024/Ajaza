import React from "react";
import { Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Colors } from "./Constants";

const LoadingSpinner = ({ containerStyle, spinStyle }) => {
  return (
    <Flex
      align="center"
      justify="center"
      gap="middle"
      style={{ marginTop: "100px", ...containerStyle }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              color: Colors.primary.default,
              fontSize: 48,
              ...spinStyle,
            }}
            spin
          />
        }
      />
    </Flex>
  );
};

export default LoadingSpinner;
