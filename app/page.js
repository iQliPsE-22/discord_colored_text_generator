"use client";
import { Container, Title, Group, Stack, Button, Box } from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import Headline from "./components/Headline";
import About from "./components/About";

export default function Home() {
  const contentRef = useRef(null);
  const [copyCount, setCopyCount] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = "hello";
    }
  }, []);

  const applyANSI = (code) => {
    const selection = window.getSelection();
    if (code === "0") {
      // Reset entire content to plain text
      const content = contentRef.current;
      content.innerHTML = content.textContent;
      return;
    }
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    const span = document.createElement("span");
    span.className = `ansi-${code}`;

    try {
      range.surroundContents(span);
    } catch (e) {
      const text = document.createTextNode(selection.toString());
      span.appendChild(text);
      range.insertNode(span);
    }

    window.getSelection().removeAllRanges();
  };

  const processNodes = (nodes) => {
    let output = "";

    const walker = (nodes) => {
      Array.from(nodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          output += node.textContent;
          return;
        }

        if (node.nodeName === "BR") {
          output += "\n";
          return;
        }

        const classes = node.className?.split(" ") || [];
        const ansiCodes = classes
          .filter((c) => c.startsWith("ansi-"))
          .map((c) => parseInt(c.split("-")[1]));

        if (ansiCodes.length > 0) {
          output += `\x1b[${ansiCodes.join(";")}m`;
        }

        walker(node.childNodes);

        if (ansiCodes.length > 0) {
          output += `\x1b[0m`;
        }
      });
    };

    walker(nodes);
    return output;
  };

  const copyStyledText = async () => {
    try {
      const content = processNodes(contentRef.current.childNodes);
      const formattedText = `\`\`\`ansi\n${content}\n\`\`\``;

      await navigator.clipboard.writeText(formattedText);
      setCopyCount((prev) => Math.min(11, prev + 1));
      setTimeout(() => setCopyCount(0), 2000);
    } catch (err) {
      alert("Copy failed, showing content instead:");
      alert(formattedText);
    }
  };

  const fgColors = [
    { code: "31", color: "#dc322f" },
    { code: "32", color: "#859900" },
    { code: "33", color: "#b58900" },
    { code: "34", color: "#268bd2" },
    { code: "35", color: "#d33682" },
    { code: "36", color: "#2aa198" },
    { code: "37", color: "#ffffff", textColor: "#000000" },
  ];

  const bgColors = [
    { code: "40", color: "#002b36" },
    { code: "41", color: "#cb4b16" },
    { code: "42", color: "#586e75" },
    { code: "43", color: "#657b83" },
    { code: "45", color: "#6c71c4" },
    { code: "46", color: "#93a1a1" },
    { code: "47", color: "#fdf6e3", textColor: "#000000" },
  ];

  return (
    <Container size="md" className="main">
      <Headline />
      <About />

      <Container
        size="md"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Group position="center" mt="lg" style={{ flexWrap: "wrap" }}>
          <Button variant="filled" color="gray" onClick={() => applyANSI("0")}>
            Reset All
          </Button>
          <Button variant="filled" color="gray" onClick={() => applyANSI("1")}>
            Bold
          </Button>
          <Button variant="filled" color="gray" onClick={() => applyANSI("4")}>
            Underline
          </Button>
        </Group>
        <Group position="center" mt="lg" style={{ flexWrap: "wrap" }}>
          <Title order={3}> FG </Title>
          {fgColors.map(({ code, color, textColor }) => (
            <Button
              key={code}
              variant="filled"
              style={{ backgroundColor: color, color: textColor || "#ffffff" }}
              onClick={() => applyANSI(code)}
            ></Button>
          ))}
        </Group>
        <Group position="center" mt="lg" style={{ flexWrap: "wrap" }}>
          <Title order={3}>BG </Title>
          {bgColors.map(({ code, color, textColor }) => (
            <Button
              key={code}
              variant="filled"
              style={{ backgroundColor: color, color: textColor || "#ffffff" }}
              onClick={() => applyANSI(code)}
            ></Button>
          ))}
        </Group>

        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className="ansi-editor"
        />

        <Button mt="lg" onClick={copyStyledText}>
          Copy to Clipboard
        </Button>
      </Container>
    </Container>
  );
}
