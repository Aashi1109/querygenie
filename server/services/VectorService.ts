import { IVector } from "@definitions/types";
import prisma from "@prisma";
import { Prisma } from "@prisma/client";
import { getByFilter } from "@lib/utils";
import Prisma__VectorClient = Prisma.Prisma__VectorClient;

class VectorService {
  /**
   * Retrieves a vector by its ID from the database.
   * @param {number} id - The ID of the vector to retrieve.
   * @returns {Prisma.Prisma__VectorClient<IVector>} A Prisma client promise that resolves with the retrieved vector if found, or null.
   */
  static getById(id: number): Prisma__VectorClient<IVector> {
    return prisma.vector.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new vector in the database.
   * @param {number} projectId - The ID of the project associated with the vector.
   * @param {string} vectorId - The unique ID of the vector.
   * @returns {Prisma.Prisma__VectorClient<IVector>} A Prisma client promise that resolves with the newly created vector.
   */
  static create(
    projectId: number,
    vectorId?: string,
  ): Prisma__VectorClient<IVector> {
    const data = {
      projectId: projectId,
    };

    if (vectorId) data["vectorId"] = vectorId;
    return prisma.vector.create({
      data,
    });
  }

  /**
     * Creates a new vectors in bulk in the database.
     * @param vectorData - Data to create vectors in bulk.
     * @param vectorData.projectId - The ID of the project associated with the vector.
     * @param vectorData.vectorId - The ID of the vector in qdrant database.

     * @returns {Prisma.PrismaPromise<Prisma.BatchPayload>} A Prisma client promise that resolves with the newly created vector.
     */
  static createBulk(
    vectorData: {
      projectId: number;
      vectorId: string;
    }[],
  ): Prisma.PrismaPromise<Prisma.BatchPayload> {
    return prisma.vector.createMany({ data: vectorData });
  }

  /**
   * Updates a vector in the database with the provided information.
   * @param {number} id - The ID of the vector to update.
   * @param {number} projectId - The updated project ID associated with the vector.
   * @param {string} vectorId - The updated unique ID of the vector.
   * @returns {Prisma.Prisma__VectorClient<IVector>} A Prisma client promise that resolves with the updated vector.
   * @throws {Error} Throws an error if the update fails for any other reason.
   */
  static updateById(
    id: number,
    projectId: number,
    vectorId: string,
  ): Prisma__VectorClient<IVector> {
    return prisma.vector.update({
      where: {
        id,
      },
      data: {
        projectId,
        vectorId,
      },
    });
  }

  /**
   * Deletes a vector by its ID from the database.
   * @param {number} id - The ID of the vector to delete.
   * @returns {Prisma.Prisma__VectorClient<IVector>} A Prisma client promise that resolves once the vector is deleted.
   * @throws {Error} Throws an error if the vector with the specified ID is not found.
   */
  static deleteById(id: number): Prisma__VectorClient<IVector> {
    return prisma.vector.delete({ where: { id } });
  }

  /**
   * Retrieves vector data from the database based on the provided filter criteria.
   * @param {Object} filter - Filter criteria for querying vectors.
   * @param {number} [filter.id] - The ID of the vector to retrieve.
   * @param {string} [filter.vectorId] - The unique ID of the vector to retrieve.
   * @param {number} [filter.projectId] - The project ID associated with the vector.
   * @param {number} [limit] - Limit the number of vectors to retrieve.
   * @param {"createdAt" | "updatedAt"} [sortBy] - Sort vectors by creation or update time.
   * @param {"asc" | "desc"} [sortOrder] - Sort order for vectors.
   * @param {number} [pageNumber] - Current page number for pagination.
   * @param not
   * @returns {Prisma.Prisma__VectorClient<IVector[]>} A Prisma client promise that resolves to an array of retrieved vector objects.
   * @throws {Error} If there's an error fetching vectors by the provided filter.
   */
  static getByFilter(
    filter: {
      id?: number;
      vectorId?: string;
      projectId?: number;
    },
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    pageNumber?: number,
    not?: number,
  ): Prisma__VectorClient<IVector[]> {
    pageNumber ??= 1;

    return getByFilter<IVector[]>(prisma.vector, filter, {
      limit,
      sortBy,
      sortOrder,
      pageNumber,
      not,
    }) as Prisma__VectorClient<IVector[]>;
  }
}

export default VectorService;
