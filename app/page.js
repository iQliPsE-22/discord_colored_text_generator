"use client";
import { Container, Title, Group, Stack, Button, Box } from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import Headline from "./components/Headline";
import About from "./components/About";

const styles = `
  .ansi-editor {
    margin-top: 20px;
    width: 18cm;
    min-height: 8cm;
    background-color: #1e1e1e;
    color: white;
    border: 1px solid #333;
    padding: 10px;
    outline: none;
    white-space: pre-wrap;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  .ansi-0{ color: #fff !important; font-weight: 400 !important; text-decoration: none !important;background-color: #000 !important; }
  .ansi-1 { font-weight: 700 !important; }
  .ansi-4 { text-decoration: underline !important; }

  .ansi-30 { color: #4f545c !important; }
  .ansi-31 { color: #dc322f !important; }
  .ansi-32 { color: #859900 !important; }
  .ansi-33 { color: #b58900 !important; }
  .ansi-34 { color: #268bd2 !important; }
  .ansi-35 { color: #d33682 !important; }
  .ansi-36 { color: #2aa198 !important; }
  .ansi-37 { color: #ffffff !important; }
  
  .ansi-40 { background-color: #002b36 !important; }
  .ansi-41 { background-color: #cb4b16 !important; }
  .ansi-42 { background-color: #586e75 !important; }
  .ansi-43 { background-color: #657b83 !important; }
  .ansi-44 { background-color: #839496 !important; }
  .ansi-45 { background-color: #6c71c4 !important; }
  .ansi-46 { background-color: #93a1a1 !important; }
  .ansi-47 { background-color: #fdf6e3 !important; }

  .fg-swatch {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #555 !important;
  }

  .fg-swatch-30 { background-color: #4f545c; }
  .fg-swatch-31 { background-color: #dc322f; }
  .fg-swatch-32 { background-color: #859900; }
  .fg-swatch-33 { background-color: #b58900; }
  .fg-swatch-34 { background-color: #268bd2; }
  .fg-swatch-35 { background-color: #d33682; }
  .fg-swatch-36 { background-color: #2aa198; }
  .fg-swatch-37 { background-color: #ffffff; }

  .bg-swatch-40 { background-color: #002b36; }
  .bg-swatch-41 { background-color: #cb4b16; }
  .bg-swatch-42 { background-color: #586e75; }
  .bg-swatch-43 { background-color: #657b83; }
  .bg-swatch-44 { background-color: #839496; }
  .bg-swatch-45 { background-color: #6c71c4; }
  .bg-swatch-46 { background-color: #93a1a1; }
  .bg-swatch-47 { background-color: #fdf6e3; }
`;

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
    <Container size="md" style={{ textAlign: "center", padding: "40px" }}>
      <style>{styles}</style>
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
        <Group position="center" mt="lg">
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
        <Group position="center" mt="lg">
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
        <Group position="center" mt="lg">
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
