import React from "react";
import { Separator } from "@/components/ui/separator";
import { getProjectsByQuery } from "@/action";
import { Projects } from "@/components/projects";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const userId = searchParams?.userId;

  let projects = await getProjectsByQuery({
    userId: parseInt(userId as string),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <div className={"h-full p-2 flex flex-col w-full gap-4 overflow-y-auto"}>
      <div className={"flex-between"}>
        <h2 className={"text-2xl"}>Projects</h2>
        {/*TODO implemented in next version*/}
        {/*<Select>*/}
        {/*  <SelectTrigger className={"w-[180px]"}>*/}
        {/*    <SelectValue placeholder={"All"} />*/}
        {/*  </SelectTrigger>*/}
        {/*  <SelectContent>*/}
        {/*    <SelectItem value={"1"}>All</SelectItem>*/}
        {/*    <SelectItem value={"2"}>In-progress</SelectItem>*/}
        {/*    <SelectItem value={"3"}>Completed</SelectItem>*/}
        {/*    /!*<SelectItem value={"2"}>In-progress</SelectItem>*!/*/}
        {/*    <SelectGroup></SelectGroup>*/}
        {/*  </SelectContent>*/}
        {/*</Select>*/}
      </div>
      <Separator />
      <div className="project__list h-full w-full">
        {projects && projects?.data?.length ? (
          <Projects
            projects={projects?.data}
            userId={searchParams.userId! as string}
          />
        ) : (
          <p className={"text-center"}>No projects yet</p>
        )}
      </div>
    </div>
  );
};

export default Page;
