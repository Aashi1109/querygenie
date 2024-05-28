import {ClientError, NotFoundError} from "@exceptions";
import {ChatsService} from "@services";

import {Request, Response} from "express";

/**
 * Creates a new user chat with the provided projectId and userId.
 * @param {Request} req - The request object containing the chat creation information.
 * @param {Response} res - The response object for sending responses.
 * @throws {Error} Throws an error if the name or description is missing.
 */
const createChat = async (req: Request, res: Response) => {
  const { userId, projectId } = req.body as {
    projectId: string;
    userId: string;
  };

  if (!userId && !projectId) {
    throw new ClientError("userId and projectId are required");
  }

  const newChat = await ChatsService.createChat(+userId, +projectId);

  res.status(201).json({ success: true, data: newChat });
};

/**
 * Retrieves a chat by its ID from the database.
 * @param {Request} req - The request object containing the room ID.
 * @param {Response} res - The response object for sending responses.
 * @throws {NotFoundError} Throws a NotFoundError if the chat with the specified ID is not found.
 */
const getChatById = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const userChats = await ChatsService.getChatById(+chatId);

  if (!userChats) throw new NotFoundError(`Chat with id: ${chatId} not found`);

  res.json({ success: true, data: userChats });
};

/**
 * Retrieves a chat by its ID from the database.
 * @param {Request} req - The request object containing the room ID.
 * @param {Response} res - The response object for sending responses.
 * @throws {NotFoundError} Throws a NotFoundError if the chat with the specified ID is not found.
 */
const getChatsByQuery = async (req: Request, res: Response) => {
  // options to configure query parameters
  let {
    limit,
    sortBy,
    sortOrder,
    pageNumber,
    not,

    chatId,
    userId,
    projectId,
  } = req.query;

  const filter: { id?: number; userId?: number; projectId?: number } = {};
  if (chatId) {
    filter.id = +chatId;
  }
  if (userId) {
    filter.userId = +userId;
  }
  if (projectId) {
    filter.projectId = +projectId;
  }

  const chats = await ChatsService.getChatsByFilter(
    filter,
    +limit,
    sortBy !== "createdAt" && sortBy !== "updatedAt" ? null : sortBy,
    sortOrder !== "asc" && sortOrder !== "desc" ? null : sortOrder,
    +pageNumber,
    +not,
  );

  res.json({ success: true, data: chats });
};

/**
 * Deletes a room by its ID from the database.
 * @param {Request} req - The request object containing the room ID.
 * @param {Response} res - The response object for sending responses.
 * @throws {NotFoundError} Throws a NotFoundError if the room with the specified ID is not found.
 */
const deleteUserChatById = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const userChatDelete = await ChatsService.deleteChatById(+chatId);

  res.status(200).json({
    message: "Chats deleted successfully",
    data: userChatDelete,
    success: true,
  });
};

/**
 * Deletes a room by its ID from the database.
 * @param {Request} req - The request object containing the room ID.
 * @param {Response} res - The response object for sending responses.
 * @throws {NotFoundError} Throws a NotFoundError if the room with the specified ID is not found.
 */
const getByUserAndProjectId = async (req: Request, res: Response) => {
  const { userId, projectId } = req.params;
  // console.log(userId, projectId);

  const chatData = await ChatsService.getChatsByFilter({
    userId: +userId,
    projectId: +projectId,
  });
  res.status(200).json({ data: chatData, success: true });
};

export {
  createChat,
  deleteUserChatById,
  getByUserAndProjectId,
  getChatById,
  getChatsByQuery,
};
