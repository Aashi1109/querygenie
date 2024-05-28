"use client";

import React from "react";
import FallbackAvatar from "@/components/FallbackAvatar";

const UserChatCard: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={"self-end  max-w-[70%] flex gap-4"}>
      <div className={"rounded-xl bg-background px-6 py-3"}>{text}</div>
      <FallbackAvatar
        imagePath={"/assets/images/logo-base.png"}
        size={37}
        fallbackText={"AN"}
        altText={"profile image"}
      />
    </div>
  );
};

export default UserChatCard;
