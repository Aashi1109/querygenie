import React from "react";
import { EIndicators } from "@/types";
import { cn } from "@/lib/utils";

const ProgressIndicators: React.FC<{
  indicatorType: EIndicators;
  classes?: string;
}> = ({ indicatorType, classes }) => {
  return (
    <div
      className={cn(
        "top-[-14px] right-[-10px] w-3 h-3 rounded-full",
        {
          "bg-orange-300 animate-pulse":
            indicatorType === EIndicators.InProgress,
          "bg-green-600 dark:bg-green-400":
            indicatorType === EIndicators.Completed,
          "bg-red-300": indicatorType === EIndicators.Failed,
        },
        classes,
      )}
    ></div>
  );
};

export default ProgressIndicators;
