import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const FallbackAvatar: React.FC<{
  imagePath: string;
  size: number;
  fallbackText: string;
  altText: string;
  classes?: string;
}> = ({ imagePath, fallbackText, altText, size }) => {
  return (
    <Avatar>
      <AvatarImage
        src={imagePath}
        alt={altText}
        height={size}
        width={size}
        className={cn("object-contain")}
      />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};

export default FallbackAvatar;
