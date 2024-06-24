import { IFileData } from "@definitions/types";
import prisma from "@prisma";
import { Prisma } from "@prisma/client";
import { EStorageTypes } from "@definitions/enums";
import { getByFilter } from "@lib/utils";
import Prisma__FileDataClient = Prisma.Prisma__FileDataClient;

/**
 * Service class for FileData.
 */
class FileDataService {
  /**
   * Retrieves a file data by its ID from the database.
   * @param {number} id - The ID of the file data to retrieve.
   * @returns {Prisma__FileDataClient<IFileData>} A Prisma client promise that resolves with the retrieved file data if found, or null.
   */
  static getFileDataById(id: number): Prisma__FileDataClient<IFileData> {
    return prisma.fileData.findUnique({
      where: { id },
    });
  }

  /**
   * Deletes file data by its ID from the database.
   * @param {number} id - The ID of the file data to delete.
   * @returns {Prisma__FileDataClient<IFileData>} A Prisma client promise that resolves once the file data is deleted.
   * @throws {Error} Throws an error if the file data with the specified ID is not found.
   */
  static deleteFileDataById(id: number): Prisma__FileDataClient<IFileData> {
    return prisma.fileData.delete({ where: { id } });
  }

  /**
   * Creates new file data in the database.
   * @param {string} url - The URL of the file data.
   * @param {EStorageTypes} storageType - The storage type of the file data.
   * @param {string} name - The name of the file data.
   * @param {string} format - The format of the file data.
   * @returns {Prisma__FileDataClient<IFileData>} A Prisma client promise that resolves with the newly created file data.
   */
  static createFileData(
    url: string,
    storageType: EStorageTypes | any,
    name: string,
    format: string,
  ): Prisma__FileDataClient<IFileData> {
    return prisma.fileData.create({
      data: {
        url,
        storageType,
        name,
        format,
      },
    });
  }

  /**
   * Updates file data in the database with the provided information.
   * @param {number} id - The ID of the file data to update.
   * @param {string} url - The updated URL of the file data.
   * @param {EStorageTypes} storageType - The updated storage type of the file data.
   * @param {string} name - The updated name of the file data.
   * @param {string} format - The updated format of the file data.
   * @returns {Prisma__FileDataClient<IFileData>} A Prisma client promise that resolves with the updated file data.
   * @throws {Error} Throws an error if the update fails for any reason.
   */
  static updateFileData(
    id: number,
    url: string,
    storageType: EStorageTypes | any,
    name: string,
    format: string,
  ): Prisma__FileDataClient<IFileData> {
    return prisma.fileData.update({
      where: {
        id,
      },
      data: {
        url,
        storageType,
        name,
        format,
      },
    });
  }

  /**
   * Retrieves file data from the database based on the provided filter criteria.
   * @param {Object} filter - Filter criteria for querying file data.
   * @param {number} [filter.id] - The ID of the file data to retrieve.
   * @param {number} [limit] - Limit the number of file data to retrieve.
   * @param {"createdAt" | "updatedAt"} [sortBy] - Sort file data by creation or update time.
   * @param {"asc" | "desc"} [sortOrder] - Sort order for file data.
   * @param {number} [pageNumber] - The page number for pagination.
   * @param {number} [not] - The ID not to include in results.
   * @returns {Prisma__FileDataClient<IFileData[]>} A Prisma client promise that resolves to an array of retrieved file data objects.
   * @throws {Error} If there's an error fetching file data by the provided filter.
   */
  static getFileDataByFilter(
    filter: {
      chatId?: string;
      id?: number;
    },
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    pageNumber?: number,
    not?: number,
  ): Prisma__FileDataClient<IFileData[]> {
    pageNumber ??= 1;
    return getByFilter(prisma.fileData, filter, {
      limit,
      sortBy,
      sortOrder,
      pageNumber,
      not,
    }) as unknown as Prisma__FileDataClient<IFileData[]>;
  }
}

export default FileDataService;
