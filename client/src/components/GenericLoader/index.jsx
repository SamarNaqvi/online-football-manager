import { Flex, Spin } from "antd";
import React from "react";

function Loader() {
  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <Spin tip="Loading" size="large" />
    </Flex>
  );
}

export default Loader;
