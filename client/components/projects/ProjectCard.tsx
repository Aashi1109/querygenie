import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProgressIndicators from "@/components/ProgressIndicators";
import { EIndicators } from "@/types";
import { CalendarDays, MoveRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import Link from "next/link";

interface IProjectCardProps {
  currentProgress: EIndicators;
  filepath?: string;
  fileFormat?: string;
  name: string;
  description?: string;
  creationDate: Date;
  projectId: number;
  userId: number;
  collectionId: string;
}

const ProjectCard = ({
  currentProgress,
  filepath,
  fileFormat,
  name,
  description,
  creationDate,
  projectId,
  userId,
  collectionId,
}: IProjectCardProps) => {
  filepath ??= "/assets/icons/pdf.png";
  fileFormat ??= "PDF";
  return (
    <Card className="min-w-[250px] max-w-[400px] break-inside-avoid">
      <CardContent className={"p-6 h-full"}>
        <div className="flex space-x-4 relative">
          <Avatar>
            <AvatarImage src={filepath} />
            <AvatarFallback>{fileFormat.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            {/*<div className={"flex items-center justify-between"}>*/}
            <h4 className="text-sm font-semibold">{name}</h4>
            <ProgressIndicators
              indicatorType={currentProgress}
              classes={"absolute"}
            />
            {/*</div>*/}
            {description && <p className="text-sm">{description}</p>}
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Created {moment(creationDate).format("MMMM YYYY")}
              </span>
            </div>
          </div>
        </div>
        {currentProgress === EIndicators.Completed && (
          <>
            <Separator className={"mx-auto mt-2"} />
            <div className="flex-between pt-2 text-gray-600 dark:text-gray-400">
              <p className={"text-sm"}>Start querying</p>
              <Link
                href={`/chat?projectId=${projectId}&userId=${userId}&collectionId=${collectionId}`}
              >
                <MoveRight
                  className={
                    "cursor-pointer h-5 transition-transform hover:translate-x-1"
                  }
                />
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
