import { IMessage } from "@definitions/types";
import { Prisma } from "@node_modules/.prisma/client";
import prisma from "@prisma";
import { getByFilter } from "@lib/utils";
import Prisma__MessageClient = Prisma.Prisma__MessageClient;

class MessageService {
  /**
   * Retrieves a message by its ID from the database.
   * @param {number} id - The ID of the message to retrieve.
   * @returns {Prisma__MessageClient<IMessage>} A Prisma client promise that resolves with the retrieved message if found, or null.
   */
  static getById(id: number): Prisma__MessageClient<IMessage> {
    return prisma.message.findUnique({
      where: { id },
    });
  }

  /**
   * Deletes a message by its ID from the database.
   * @param {number} id - The ID of the message to delete.
   * @returns {Prisma__MessageClient<IMessage>} A Prisma client promise that resolves once the message is deleted.
   * @throws {Error} Throws an error if the message with the specified ID is not found.
   */
  static deleteById(id: number): Prisma__MessageClient<IMessage> {
    return prisma.message.delete({ where: { id } });
  }

  /**
   * Creates a new message in the database.
   * @param {number} chatId - The ID of the chat the message belongs to.
   * @param {string} query - The query content of the message.
   * @param {string} [answer] - Optional answer content of the message.
   * @param {number} [messageId] - The ID of the message (if applicable).
   * @param {number} [userId] - The id of the user (if applicable).
   * @returns {Prisma__MessageClient<IMessage>} A Prisma client promise that resolves with the newly created message.
   */
  static create(
    chatId: number,
    query: string,
    answer?: string,
    messageId?: number,
    userId?: number,
  ): Prisma__MessageClient<IMessage> {
    const data = {
      chatId,
      query,
    };

    if (answer) {
      data["answer"] = answer;
    }

    if (messageId) {
      data["messageId"] = messageId;
    }
    if (userId) {
      data["userId"] = userId;
    }
    return prisma.message.create({
      data,
    });
  }

  /**
   * Updates a message in the database with the provided information.
   * @param {number} id - The ID of the message to update.
   * @param {string} query - The updated query content of the message.
   * @param {string} [answer] - The updated answer content of the message.
   * @param {string} [regeneratedFor] - The updated regeneratedFor id if current the message is created in context with some message.
   * @returns {Prisma__MessageClient<IMessage>} A Prisma client promise that resolves with the updated message.
   * @throws {Error} Throws an error if the update fails for any reason.
   */
  static updateById(
    id: number,
    query: string,
    answer?: string,
    regeneratedFor?: number,
  ): Prisma__MessageClient<IMessage> {
    return prisma.message.update({
      where: {
        id,
      },
      data: {
        query,
        answer,
        messageId: regeneratedFor,
      },
    });
  }

  /**
   * Retrieves messages from the database based on the provided filter criteria.
   * @param {Object} filter - Filter criteria for querying file data.
   * @param {string} [filter.chatId] - The ID of the chat to retrieve .
   * @param {number} [filter.id] - The ID of the message to retrieve.
   * @param {number} [filter.userId] - The user ID of the message to retrieve.
   * @param {number} [limit] - Limit the number of file data to retrieve.
   * @param {"createdAt" | "updatedAt"} [sortBy] - Sort file data by creation or update time.
   * @param {"asc" | "desc"} [sortOrder] - Sort order for file data.
   * @param {number} [pageNumber] - The page number for pagination.
   * @param {number} [not] - The ID not to include in results.
   * @returns {Prisma__MessageClient<IMessage[]>} A Prisma client promise that resolves to an array of retrieved file data objects.
   * @throws {Error} If there's an error fetching file data by the provided filter.
   */
  static getByFilter(
    filter: {
      chatId?: number;
      id?: number;
      userId?: number;
    },
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    pageNumber?: number,
    not?: number,
  ): Prisma__MessageClient<IMessage[]> {
    pageNumber ??= 1;
    return getByFilter(prisma.message, filter, {
      limit,
      sortBy,
      sortOrder,
      pageNumber,
      not,
    }) as Prisma__MessageClient<IMessage[]>;
  }
}

export default MessageService;
