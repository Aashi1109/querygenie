import { IProject } from "@definitions/types";
import prisma from "@prisma";
import { Prisma } from "@prisma/client";
import { getByFilter } from "@lib/utils";
import { EProcessingStages } from "@definitions/enums";
import Prisma__ProjectClient = Prisma.Prisma__ProjectClient;

class ProjectService {
  /**
   * Retrieves a project by its ID from the database.
   * @param {number} id - The ID of the project to retrieve.
   * @returns {Prisma.Prisma__ProjectClient<IProject>} A Prisma client promise that resolves with the retrieved project if found, or null.
   */
  static getProjectById(id: number): Prisma__ProjectClient<IProject> {
    return prisma.project.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new project in the database.
   * @param {string} name - The name of the new project.
   * @param {string} description - The description of the new project.
   * @param {number} userId - The ID of the user creating the project.
   * @param {number} [fileDataId] - The ID of the file data associated with the project.
   * @param {EProcessingStages} [processingStage] - The processing stage of the project.
   * @param [collectionId] - ID of the collection associated with the project in qdrant.
   * @returns {Prisma.Prisma__ProjectClient<IProject>} A Prisma client promise that resolves with the newly created project.
   */
  static createProject(
    name: string,
    description: string,
    userId: number,
    fileDataId?: number,
    processingStage?: EProcessingStages | any,
    collectionId?: string,
  ): Prisma__ProjectClient<IProject> {
    const data = {
      description,
      name,
      userId,
    };
    if (fileDataId) data["fileDataId"] = fileDataId;
    if (processingStage) data["processingStage"] = processingStage;
    if (processingStage) data["collectionId"] = collectionId;
    return prisma.project.create({
      data,
    });
  }

  /**
   * Updates a project in the database with the provided information.
   * @param {number} id - The ID of the project to update.
   * @param {string} name - The updated name of the project.
   * @param {string} description - The updated description of the project.
   * @param {number} fileDataId - The updated ID of the file data associated with the project.
   * @param {EProcessingStages} processingStage - The updated processing stage of the project.
   * @param [collectionId] - The updated collection ID of the project
   * @returns {Prisma.Prisma__ProjectClient<IProject>} A Prisma client promise that resolves with the updated project.
   * @throws {Error} Throws an error if the update fails for any reason.
   */
  static updateProject(
    id: number,
    name: string,
    description: string,
    fileDataId: number,
    processingStage?: EProcessingStages | any,
    collectionId?: string,
  ): Prisma__ProjectClient<IProject> {
    const data = {
      name,
      description,
      fileDataId,
      collectionId,
      processingStage,
    };

    return prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Deletes a project by its ID from the database.
   * @param {number} id - The ID of the project to delete.
   * @returns {Prisma.Prisma__ProjectClient<IProject>} A Prisma client promise that resolves once the project is deleted.
   * @throws {Error} Throws an error if the project with the specified ID is not found.
   */
  static deleteProjectById(id: number): Prisma__ProjectClient<IProject> {
    return prisma.project.delete({ where: { id } });
  }

  /**
   * Retrieves project data from the database based on the provided filter criteria.
   * @param {Object} filter - Filter criteria for querying projects.
   * @param {number} [filter.id] - The ID of the project to retrieve.
   * @param {number} [filter.userId] - The ID of the user associated with the project.
   * @param {number} [filter.collectionId] - The ID of the collection associated with the project.
   * @param {number} [limit] - Limit the number of projects to retrieve.
   * @param {"createdAt" | "updatedAt"} [sortBy] - Sort projects by creation or update time.
   * @param {"asc" | "desc"} [sortOrder] - Sort order for projects.
   * @param {number} [pageNumber] - The page number for pagination.
   * @param {number} [not] - The ID of the project to exclude from the results.
   * @returns {Prisma.Prisma__ProjectClient<IProject[]>} A Prisma client promise that resolves to an array of retrieved project objects.
   * @throws {Error} If there's an error fetching projects by the provided filter.
   */
  static getProjectsByFilter(
    filter: {
      id?: number;
      userId?: number;
      collectionId?: string;
    },
    limit?: number,
    sortBy?: "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc",
    pageNumber?: number,
    not?: number,
  ): Prisma.Prisma__ProjectClient<IProject[]> {
    pageNumber ??= 1;
    // ts-ignore
    return getByFilter<IProject[]>(prisma.project, filter, {
      limit,
      sortBy,
      sortOrder,
      pageNumber,
      not,
    }) as Prisma__ProjectClient<IProject[]>;
  }
}

export default ProjectService;
