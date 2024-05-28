import { Router } from "express";
import {
  deleteFileDataById,
  getCloudinaryFileByPublicId,
  getFileDataById,
  getFileDataByQuery,
  uploadFile,
} from "@controllers/filedata.controller";
import asyncHandler from "@middlewares/asyncHandler";

const router = Router();

router.get("/query", asyncHandler(getFileDataByQuery));

router.post("/upload", asyncHandler(uploadFile));
router.post(
  "/cloudinary/:id",

  asyncHandler(getCloudinaryFileByPublicId),
);

router
  .route("/:id")
  .get(asyncHandler(getFileDataById))
  .delete(asyncHandler(deleteFileDataById));

export default router;
