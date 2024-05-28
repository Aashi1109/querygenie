import { IUser } from "@definitions/types";
import prisma from "@prisma";
import { getByFilter } from "@lib/utils";
import { Prisma } from "@prisma/client";
import Prisma__UserClient = Prisma.Prisma__UserClient;

class UserService {
  /**
   * Retrieves a user by their ID from the database.
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Prisma.Prisma__UserClient<IUser>} A Prisma client promise that resolves with the retrieved user if found, or null.
   */
  static getUserById(id: number): Prisma__UserClient<IUser> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieves a user by their email from the database.
   * @param {string} email - The email of the user to retrieve.
   * @returns {Prisma.Prisma__UserClient<IUser>} A Prisma client promise that resolves with the retrieved user if found, or null.
   */
  static getUserByEmail(email: string): Prisma__UserClient<IUser> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Deletes a user by their ID from the database.
   * @param {number} id - The ID of the user to delete.
   * @returns {Prisma.Prisma__UserClient<IUser>} A Prisma client promise that resolves once the user is deleted.
   * @throws {Error} Throws an error if the user with the specified ID is not found.
   */
  static deleteUserById(id: number): Prisma__UserClient<IUser> {
    return prisma.user.delete({ where: { id } });
  }

  /**
   * Creates a new user in the database.
   * @param {string} username - The username of the new user.
   * @param {string} name - The name of the new user.
   * @param {string} email - The email of the new user.
   * @param {string} image - The profile image of the new user.
   * @returns {Prisma.Prisma__UserClient<IUser>} A Prisma client promise that resolves with the newly created user.
   */
  static createUser(
    username: string,
    name: string,
    email: string,
    image: string,
  ): Prisma__UserClient<IUser> {
    return prisma.user.create({
      data: {
        username,
        name,
        email,
        image,
      },
    });
  }

  /**
   * Updates a user in the database with the provided information.
   * @param {number} id - The ID of the user to update.
   * @param {string} username - The updated username of the user.
   * @param {string} name - The updated name of the user.
   * @param {string} image - The updated image of the user.
   * @returns {Prisma.Prisma__UserClient<IUser>} A Prisma client promise that resolves with the updated user.
   * @throws {Error} Throws an error if the update fails for any reason.
   */
  static updateUser(
    id: number,
    username: string,
    name: string,
    image: string,
  ): Prisma__UserClient<IUser> {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        name,
        image,
      },
    });
  }

  /**
   * Retrieves all users from the database, optionally excluding a specific user.
   * @param {number} [not] - The ID of the user to exclude from the results.
   * @returns {Prisma.Prisma__UserClient<IUser[]>} A Prisma client promise that resolves with an array of all users, excluding the specified user if provided.
   */
  static getAllUsers(not?: number): Prisma__UserClient<IUser[]> {
    let filter = {};
    if (not) {
      filter = { id: { not: not } };
    }
    // @ts-ignore
    return prisma.user.findMany({
      where: {
        ...filter,
      },
    });
  }

  /**
   * Retrieves user data from the database based on the provided filter criteria.
   * @param {Object} filter - Filter criteria for querying users.
   * @param {string} [filter.username] - The username of the user to retrieve.
   * @param {string} [filter.email] - The email of the user to retrieve.
   * @param {number} [filter.id] - The ID of the user to retrieve.
   * @param {number} [limit] - Limit the number of users to retrieve.
   * @param {"createdAt" | "updatedAt"} [sortBy] - Sort users by creation or update time.
   * @param {"asc" | "desc"} [sortOrder] - Sort order for users.
   * @param {number} [pageNumber] - The page number for pagination.
   * @param {number} [not] - The ID of the user to exclude from the results.
   * @returns {Prisma.Prisma__UserClient<IUser[]>} A Prisma client promise that resolves to an array of retrieved user objects.
   * @throws {Error} If there's an error fetching users by the provided filter.
   */
  static getUsersByFilter(
    filter: {
      username?: string;
      id?: number;
      email?: string;
    },
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    pageNumber?: number,
    not?: number,
  ): Prisma__UserClient<IUser[]> {
    pageNumber ??= 1;
    return getByFilter(prisma.user, filter, {
      limit,
      sortBy,
      sortOrder,
      pageNumber,
      not,
    }) as Prisma__UserClient<IUser[]>;
  }
}

export default UserService;
