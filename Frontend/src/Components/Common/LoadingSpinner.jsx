import React from "react";
import { Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Colors } from "./Constants";

const LoadingSpinner = () => {
  return (
    <Flex
      align="center"
      justify="center"
      gap="middle"
      style={{ marginTop: "100px" }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              color: Colors.primary.default,
              fontSize: 48,
            }}
            spin
          />
        }
      />
    </Flex>
  );
};

export default LoadingSpinner;
