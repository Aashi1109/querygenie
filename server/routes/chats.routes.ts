import {
  createChat,
  deleteUserChatById,
  getChatById,
  getChatsByQuery,
} from "@controllers/chats.controller";
import asyncHandler from "@middlewares/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/query", asyncHandler(getChatsByQuery));

router.post("", asyncHandler(createChat));

router
  .route("/:chatId")
  .delete(asyncHandler(deleteUserChatById))
  .get(asyncHandler(getChatById));

export default router;
