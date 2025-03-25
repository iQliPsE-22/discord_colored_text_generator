import React from "react";
import { Title } from "@mantine/core";
import { Text } from "@mantine/core";

const Headline = () => {
  return (
    <Title order={1} style={{ fontSize: "2rem" }}>
      VideoDubber's Discord{" "}
      <Text component="span" inherit color="blue">
        Colored
      </Text>{" "}
      Text Generator
    </Title>
  );
};

export default Headline;
