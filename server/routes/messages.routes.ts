import {
  createMessage,
  deleteMessageById,
  getMessageById,
  getMessageByQuery,
  updateMessageById,
} from "@controllers/messages.controller";
import asyncHandler from "@middlewares/asyncHandler";

import { Router } from "express";
import { validateMessage } from "@middlewares/validators";

const router = Router();

router.get("/query", asyncHandler(getMessageByQuery));
router.route("").post([validateMessage], asyncHandler(createMessage));

router
  .route("/:messageId")
  .get(asyncHandler(getMessageById))
  .patch(asyncHandler(updateMessageById))
  .delete(asyncHandler(deleteMessageById));

export default router;
