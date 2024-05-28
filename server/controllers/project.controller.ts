import {Request, Response} from "express";
import {ProjectService} from "@services";
import {NotFoundError} from "@exceptions";
import logger from "@logger";
import {jsstr} from "@lib/utils";

/**
 * Get project data by ID.
 * @param {Request} req - The modified request object.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws a ClientError if an invalid ID is provided.
 * @returns {Promise<Response>} A Promise that resolves with the project data.
 */
const getProjectById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params?.id;

  // Retrieve project data by ID
  const projectData = await ProjectService.getProjectById(+id);

  if (!projectData) throw new NotFoundError(`Project with id: ${id} not found`);

  // Send response with project data
  return res.status(200).json({ data: projectData, success: true });
};

/**
 * Creates a new project based on the provided request data.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A Promise that resolves with created project once the project is created.
 */
const createProject = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { description, name, userId, fileDataId, collectionId } = req.body;

  const createdProject = await ProjectService.createProject(
    name,
    description,
    userId,
    fileDataId,
    null,
    collectionId,
  );

  return res.status(201).json({ data: createdProject, success: true });
};

/**
 * Retrieves a project by projectname from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @throws {ClientError} If an invalid or incorrect projectname is provided.
 */
const getProjectByQuery = async (req: Request, res: Response) => {
  const {
    projectId,
    userId,
    collectionId,

    not,
    limit,
    sortBy,
    sortOrder,
    pageNumber,
  } = req.query;
  // console.log("doPopulate -> ", !!populate);

  const filter: { id?: number; userId?: number; collectionId?: string } = {};
  if (userId) {
    filter.userId = +userId;
  }
  if (projectId) {
    filter.id = +projectId;
  }

  if (collectionId) {
    filter.collectionId = collectionId as string;
  }

  logger.debug(
    "Project query service: getProjectByQuery -> filter: ",
    jsstr(filter),
  );

  const projects = await ProjectService.getProjectsByFilter(
    filter,
    +limit,
    sortBy !== "createdAt" && sortBy !== "updatedAt" ? null : sortBy,
    sortOrder !== "asc" && sortOrder !== "desc" ? null : sortOrder,
    +pageNumber,
    +not,
  );

  return res.json({ success: true, data: projects });
};

/**
 * Delete a project by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws a ClientError if an invalid ID is provided.
 * @returns {Promise<Response>} A Promise that resolves when the project is deleted successfully.
 */
const deleteProjectById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  // Delete project by ID
  const deleteResp = await ProjectService.deleteProjectById(+id);

  // Send success response
  return res.status(200).json({
    data: deleteResp,
    success: true,
  });
};

/**
 * Updates a project's information in the database by their ID.
 * @param {Request} req - The custom request object containing project information.
 * @param {Response} res - The response object for sending responses.
 * @throws {ClientError} Throws a ClientError if the provided project ID is invalid or if the project with the specified ID or projectname is not found, or if an invalid role is provided.
 * @throws {Error} Throws an error if the update fails for any other reason.
 */
const updateProjectById = async (req: Request, res: Response) => {
  const { description, name, fileDataId, processingStage, collectionId } =
    req.body;
  const { id } = req.params;

  const existingProject = await ProjectService.getProjectById(+id);
  if (!existingProject) {
    throw new NotFoundError(`Project with id: ${id} not found`);
  }

  const updatedProject = await ProjectService.updateProject(
    +id,
    name || existingProject.name,
    description || existingProject.description,
    fileDataId || existingProject.fileDataId,
    processingStage || existingProject.processingStage,
    collectionId || existingProject.collectionId,
  );

  return res.status(200).json({ data: updatedProject, success: true });
};

export {
  createProject,
  deleteProjectById,
  getProjectById,
  getProjectByQuery,
  updateProjectById,
};
