"use client";

import * as Yup from "yup";

const createProjectSchema = Yup.object({
  name: Yup.string()
    .required("Project name is required")
    .min(5, "Project name should be minimum 5 characters")
    .max(20, "Project name should be max 20 characters"),
  description: Yup.string().optional(),
  file: Yup.mixed()
    .required("File is required")
    .test("fileTest", "Invalid file provided. Only PDF allowed", (value) => {
      const split = (value as string)?.split(".");
      const extension = split?.[split.length - 1];
      return extension === "pdf";
    }),
});

export default createProjectSchema;
