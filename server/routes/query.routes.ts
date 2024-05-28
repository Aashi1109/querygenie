import { Router } from "express";
import asyncHandler from "@middlewares/asyncHandler";
import {
  getAnswersFromOpenAI,
  getTextSearchResultFromQdrant,
  getTextTokenLength,
  performEmbeddings,
  splitTextIntoTokens,
} from "@controllers/query.controller";

const router = Router();

router.post("/embeddings", asyncHandler(performEmbeddings));
router.post("/qdranttextsearch", asyncHandler(getTextSearchResultFromQdrant));
router.post("/prompt", asyncHandler(getAnswersFromOpenAI));
router.post("/textsplit", asyncHandler(splitTextIntoTokens));
router.post("/texttokenlength", asyncHandler(getTextTokenLength));

export default router;
