"use client";

import React, { useState } from "react";
import FallbackAvatar from "@/components/FallbackAvatar";
import { useTheme } from "next-themes";
import { Check, Copy } from "lucide-react";
import TooltipWrapper from "@/components/TooltipWrapper";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const SystemChatCard: React.FC<{ text: string }> = ({ text }) => {
  const { theme } = useTheme();
  const [isTextCopied, setIsTextCopied] = useState(false);

  const handleCopyText = () => {
    setIsTextCopied(true);
    window.navigator.clipboard.writeText(text).then(() =>
      setTimeout(() => {
        setIsTextCopied(false);
      }, 1000),
    );
  };

  const handleRegenerateClick = () => {};

  const actionButtonClass =
    "cursor-pointer w-7 h-7 dark:hover:bg-gray-600 rounded-sm p-[6px]";
  return (
    <div className={"self-start flex gap-4 max-w-[100%]"}>
      <FallbackAvatar
        imagePath={`/assets/images/logo-${theme === "dark" ? "light" : "dark"}.png`}
        size={37}
        fallbackText={"QG"}
        altText={"profile image"}
      />
      <div className={""}>
        <MarkdownRenderer text={text} />
        {/* actions items */}
        <div className={"flex"}>
          <TooltipWrapper tooltipText={"Copy text"}>
            <div onClick={handleCopyText}>
              {isTextCopied ? (
                <Check className={actionButtonClass} />
              ) : (
                <Copy className={actionButtonClass} />
              )}
            </div>
          </TooltipWrapper>

          {/*<TooltipWrapper tooltipText={"Regenerate"}>*/}
          {/*  <RefreshCcw*/}
          {/*    className={actionButtonClass}*/}
          {/*    onClick={handleRegenerateClick}*/}
          {/*  />*/}
          {/*</TooltipWrapper>*/}
        </div>
      </div>
    </div>
  );
};

export default SystemChatCard;
