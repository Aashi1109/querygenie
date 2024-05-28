"use client";

import React, { useEffect, useState } from "react";
import { EProcessingStages, IProject } from "@/types";
import { ProjectCard } from "@/components/projects/index";
import { getProjectsByQuery } from "@/action";

const Projects = ({
  projects,
  userId,
}: {
  projects: IProject[];
  userId: string;
}) => {
  const [projectData, setProjectData] = useState(projects);

  const isInProgressProjectsPresent = projectData.some(
    (project) => project.processingStage == EProcessingStages.InProgress,
  );

  // run a interval to fetch data from projects for updating their status
  useEffect(() => {
    const fetchData = async () => {
      const projects = await getProjectsByQuery({
        userId: userId,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (projects?.success && projects?.data?.length) {
        // check if previous data and current data have changed
        if (JSON.stringify(projects.data) !== JSON.stringify(projectData)) {
          setProjectData(projects.data);
        }
      }
    };

    let runningInterval: string | number | NodeJS.Timeout | undefined;
    if (isInProgressProjectsPresent)
      runningInterval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(runningInterval);
    };
  });
  return (
    <div className={" prompt_layout"}>
      {projectData.map((project) => (
        <ProjectCard
          key={project.id}
          currentProgress={project.processingStage}
          name={project.name}
          creationDate={project.createdAt}
          projectId={project.id}
          description={project.description}
          userId={+userId}
          collectionId={project.collectionId ?? ""}
        />
      ))}
    </div>
  );
};

export default Projects;
