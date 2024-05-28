import { Router } from "express";

import {
  createProject,
  deleteProjectById,
  getProjectById,
  getProjectByQuery,
  updateProjectById,
} from "@controllers/project.controller";
import asyncHandler from "@middlewares/asyncHandler";
import { validateProject } from "@middlewares/validators";

const router = Router();

router
  .route("")
  .post([validateProject], asyncHandler(createProject));

router.get("/query", asyncHandler(getProjectByQuery));

router
  .route("/:id")
  .get(asyncHandler(getProjectById))
  .patch(asyncHandler(updateProjectById))
  .delete(asyncHandler(deleteProjectById));

export default router;
