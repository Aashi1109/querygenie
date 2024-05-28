import { Router } from "express";

import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserByQuery,
  updateUserById,
} from "@controllers/user.controller";
import asyncHandler from "@middlewares/asyncHandler";
import { validateUser } from "@middlewares/validators";

const router = Router();

router
  .route("")
  .get(asyncHandler(getAllUsers))
  .post([validateUser], asyncHandler(createUser));

router.get("/query", asyncHandler(getUserByQuery));

router
  .route("/:id")
  .get(asyncHandler(getUserById))
  .patch(asyncHandler(updateUserById))
  .delete(asyncHandler(deleteUserById));

export default router;
