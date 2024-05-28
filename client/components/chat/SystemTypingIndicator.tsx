import React from "react";
import FallbackAvatar from "@/components/FallbackAvatar";
import TypingIndicator from "@/components/chat/TypingIndicator";

const SystemTypingIndicator = () => {
  return (
    <div className={"self-start flex gap-4"}>
      <FallbackAvatar
        imagePath={"/assets/images/logo-base.png"}
        size={37}
        fallbackText={"QG"}
        altText={"Querygenie"}
      />
      <TypingIndicator />
    </div>
  );
};

export default SystemTypingIndicator;
