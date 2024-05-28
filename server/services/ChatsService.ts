import { IChat } from "@definitions/types";
import prisma from "@prisma";
import { Prisma } from "@prisma/client";
import { getByFilter } from "@lib/utils";
import Prisma__ChatClient = Prisma.Prisma__ChatClient;

class ChatService {
  /**
   * Retrieves a chat by its ID from the database.
   * @param {number} id - The ID of the chat to retrieve.
   * @returns {Prisma.Prisma__ChatClient<IChat>} A Prisma client promise that resolves with the retrieved chat if found, or null.
   */
  static getChatById(id: number): Prisma__ChatClient<IChat> {
    return prisma.chat.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new chat in the database.
   * @param {number} projectId - The ID of the project associated with the chat.
   * @param {number} userId - The ID of the user creating the chat.
   * @returns {Prisma.Prisma__ChatClient<IChat>} A Prisma client promise that resolves with the newly created chat.
   */
  static createChat(
    userId: number,
    projectId: number,
  ): Prisma__ChatClient<IChat> {
    return prisma.chat.create({
      data: {
        userId,
        projectId,
      },
    });
  }

  /**
   * Deletes a chat by its ID from the database.
   * @param {number} id - The ID of the chat to delete.
   * @returns {Prisma.Prisma__ChatClient<IChat>} A Prisma client promise that resolves once the chat is deleted.
   * @throws {Error} Throws an error if the chat with the specified ID is not found.
   */
  static deleteChatById(id: number): Prisma__ChatClient<IChat> {
    return prisma.chat.delete({ where: { id } });
  }

  /**
   * Retrieves chat data from the database based on the provided filter criteria.
   * @param {Object} filter - Filter criteria for querying chats.
   * @param {number} [filter.id] - The ID of the chat to retrieve.
   * @param {number} [filter.userId] - The ID of the user associated with the chat.
   * @param {number} [filter.projectId] - The ID of the project associated with the chat.
   * @param {number} [limit] - Limit the number of chats to retrieve.
   * @param {"createdAt" | "updatedAt"} [sortBy] - Sort chats by creation or update time.
   * @param {"asc" | "desc"} [sortOrder] - Sort order for chats.
   * @param {number} [pageNumber] - The page number for pagination.
   * @param {number} [not] - The ID of the chat to exclude from the results.
   * @returns {Prisma.Prisma__ChatClient<IChat[]>} A Prisma client promise that resolves to an array of retrieved chat objects.
   * @throws {Error} If there's an error fetching chats by the provided filter.
   */
  static getChatsByFilter(
    filter: {
      id?: number;
      userId?: number;
      projectId?: number;
    },
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    pageNumber?: number,
    not?: number,
  ): Prisma.Prisma__ChatClient<IChat[]> {
    pageNumber ??= 1;

    return getByFilter<IChat[]>(prisma.chat, filter, {
      limit,
      sortBy,
      sortOrder,
      pageNumber,
      not,
    }) as Prisma__ChatClient<IChat[]>;
  }
}

export default ChatService;
