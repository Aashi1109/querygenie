import React from "react";
import { parse } from "marked";

const MarkdownRenderer = ({ text }: { text: string }) => {
  const createMarkup = (markdownText: string) => {
    const rawMarkup = parse(markdownText || "");
    // const sanitizedMarkup = sanitize(rawMarkup as string);
    return { __html: rawMarkup as string };
  };

  return (
    <div
      className="rounded-xl px-0 py-2 flex flex-col w-full md-container"
      dangerouslySetInnerHTML={createMarkup(text)}
    />
  );
};

export default MarkdownRenderer;
