import {ClientError, NotFoundError} from "@exceptions";
import {MessageService} from "@services";
import {Request, Response} from "express";

/**
 * Create message
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 * @throws {ClientError} Throws a ClientError if userId, chatId or content not provided.
 * @return {Promise<Response>} Promise resolved when message is created
 */
const createMessage = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { chatId, query, answer, messageId, userId } = req.body;

  if (!query) {
    throw new ClientError("Message query is missing");
  }

  if (!chatId) {
    throw new ClientError(`Chat id is missing chat id: ${chatId}`);
  }

  const createdMessage = await MessageService.create(
    +chatId,
    query,
    answer,
    messageId,
    userId,
  );

  return res.status(201).json({ data: createdMessage, success: true });
};

/**
 * Updates a particular message
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 * @throws {NotFoundError} Throws a NotFoundError if the room or message with the specified ID is not found.
 */
const updateMessageById = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const { regeneratedFor, answer } = req.body;

  if (!messageId) {
    throw new ClientError(`Message id invalid messageId: ${messageId}`);
  }

  const previousMessage = await MessageService.getById(+messageId);

  if (!previousMessage) {
    throw new NotFoundError(`Message with id: ${messageId} not found`);
  }

  const updatedMessage = await MessageService.updateById(
    +messageId,
    previousMessage.query,
    answer || previousMessage?.answer,
    +regeneratedFor || previousMessage?.messageId,
  );
  return res.status(200).json({ data: updatedMessage, success: true });
};

/**
 * Delete specific message
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 * @return {Promise<Response>} Promise resolved with deleted message data
 */
const deleteMessageById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { messageId } = req.params;

  const deleteMessage = await MessageService.deleteById(+messageId);
  return res.status(204).json({ data: deleteMessage, success: true });
};

/**
 * Get a message by its id
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 * @return {Promise<Response>} Promise resolved with message data for that id
 */
const getMessageById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { messageId } = req.params;
  const existingMessage = await MessageService.getById(+messageId);

  if (!existingMessage)
    throw new NotFoundError(`Message with id: ${messageId} not found`);

  return res.status(200).json({ data: existingMessage, success: true });
};

/**
 * Get messages by query parameters
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 * @return {Promise<Response>} Promise resolved with messages data for passed query parameters
 */
const getMessageByQuery = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {
    chatId,
    userId,
    messageId,
    limit,
    sortBy,
    sortOrder,
    pageNumber,
    not,
  } = req.query;

  const messageFilter: {
    chatId?: number;
    id?: number;
    userId?: number;
  } = {};
  if (chatId) {
    messageFilter.chatId = +chatId;
  }

  if (messageId) {
    messageFilter.id = +messageId;
  }
  if (userId) {
    messageFilter.userId = +userId;
  }

  const existingMessage = await MessageService.getByFilter(
    messageFilter,
    +limit,
    sortBy !== "createdAt" && sortBy !== "updatedAt" ? null : sortBy,
    sortOrder !== "asc" && sortOrder !== "desc" ? null : sortOrder,
    +pageNumber,
    +not,
  );

  return res.status(200).json({ data: existingMessage, success: true });
};

export {
  createMessage,
  deleteMessageById,
  getMessageById,
  getMessageByQuery,
  updateMessageById,
};
