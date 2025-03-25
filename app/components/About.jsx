import React from "react";
import { Container } from "@mantine/core";
import { Title } from "@mantine/core";
import { Text } from "@mantine/core";
import { Anchor } from "@mantine/core";

const About = () => {
  return (
    <Container size="xs">
      <Title order={3} mt="md">
        About
      </Title>
      <Text mt="sm">
        This is a simple app that creates colored Discord messages using the
        ANSI color codes available on the latest Discord desktop versions.
      </Text>
      <Text mt="sm">
        To use this, write your text, select parts of it, assign colors to them,
        then copy and send it as a Discord message.
      </Text>

      <Title order={3} mt="md">
        Source Code
      </Title>
      <Text mt="sm">
        This app runs entirely in your browser and the source code is freely
        available on{" "}
        <Anchor href="https://github.com" target="_blank">
          GitHub
        </Anchor>
        . Shout out to kkrypt0nn for{" "}
        <Anchor href="https://example.com" target="_blank">
          this guide
        </Anchor>
        .
      </Text>

      <Title order={2} mt="md">
        Create Your Text
      </Title>
    </Container>
  );
};

export default About;
