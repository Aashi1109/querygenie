import {Request, Response} from "express";
import {VectorService} from "@services";
import {ClientError, NotFoundError} from "@exceptions";

/**
 * Get vector data by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws a ClientError if an invalid ID is provided.
 * @returns {Promise<Response>} A Promise that resolves with the vector data.
 */
const getVectorById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params?.id;

  // Retrieve vector data by ID
  const vectorData = await VectorService.getById(+id);

  if (!vectorData) throw new NotFoundError(`Vector with id: ${id} not found`);

  // Send response with vector data
  return res.status(200).json({ data: vectorData, success: true });
};

/**
 * Creates a new vector based on the provided request data.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @throws {ClientError} Throws ClientError if projectID or vectorUUID not provided
 * @returns {Promise<Response>} A Promise that resolves with created vector once the vector is created.
 */
const createVector = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, vectorUUID } = req.body;

  if (!projectId) throw new ClientError(`Project ID not specified`);

  const createdVector = await VectorService.create(+projectId, vectorUUID);

  return res.status(201).json({ data: createdVector, success: true });
};

/**
 * Retrieves a vector by query params from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @return {Promise<Response>} A promise containing Response object with vector data
 */
const getVectorsByQuery = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {
    projectId,
    vectorId,
    vectorUUID,

    not,
    limit,
    sortBy,
    sortOrder,
    pageNumber,
  } = req.query;
  // console.log("doPopulate -> ", !!populate);

  const filter: { id?: number; projectId?: number; vectorId?: string } = {};
  if (projectId) {
    filter.projectId = +projectId;
  }
  if (vectorUUID) {
    filter.vectorId = vectorUUID as string;
  }
  if (vectorId) {
    filter.id = +vectorId;
  }

  const vectors = await VectorService.getByFilter(
    filter,
    +limit,
    sortBy !== "createdAt" && sortBy !== "updatedAt" ? null : sortBy,
    sortOrder !== "asc" && sortOrder !== "desc" ? null : sortOrder,
    +pageNumber,
    +not,
  );

  return res.json({ success: true, data: vectors });
};

/**
 * Delete a vector by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws a ClientError if an invalid ID is provided.
 * @returns {Promise<Response>} A Promise that resolves when the vector is deleted successfully.
 */
const deleteVectorById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  // Delete vector by ID
  const deleteResp = await VectorService.deleteById(+id);

  // Send success response
  return res.status(200).json({
    data: deleteResp,
    success: true,
  });
};

/**
 * Updates a vector's information in the database by their ID.
 * @param {Request} req - The custom request object containing vector information.
 * @param {Response} res - The response object for sending responses.
 * @throws {NotFoundError} Throws a NotFoundError if the provided vector ID not found.
 * @return {Promise<Response>} A Promise that resolves when the vector is updated successfully
 */
const updateVectorById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { vectorUUID } = req.body;
  const { id } = req.params;

  const existingVector = await VectorService.getById(+id);
  if (!existingVector) {
    throw new NotFoundError(`Vector with id: ${id} not found`);
  }

  const updatedVector = await VectorService.updateById(
    +id,
    existingVector.projectId,
    vectorUUID || existingVector.vectorId,
  );

  return res.status(200).json({ data: updatedVector, success: true });
};

export {
  createVector,
  deleteVectorById,
  getVectorById,
  getVectorsByQuery,
  updateVectorById,
};
