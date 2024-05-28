import { Router } from "express";

import {
  createVector,
  deleteVectorById,
  getVectorById,
  getVectorsByQuery,
  updateVectorById,
} from "@controllers/vector.controller";
import asyncHandler from "@middlewares/asyncHandler";

const router = Router();

router.route("").post(asyncHandler(createVector));

router.get("/query", asyncHandler(getVectorsByQuery));

router
  .route("/:id")
  .get(asyncHandler(getVectorById))
  .patch(asyncHandler(updateVectorById))
  .delete(asyncHandler(deleteVectorById));

export default router;
