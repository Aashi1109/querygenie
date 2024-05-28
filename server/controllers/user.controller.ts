import {Request, Response} from "express";
import {ClientError, NotFoundError} from "@exceptions";
import {UserService} from "@services";

/**
 * Get user data by ID.
 * @param {Request} req - The modified request object.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws a ClientError if an invalid ID is provided.
 * @returns {Promise<Response>} A Promise that resolves with the user data.
 */
const getUserById = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params?.id;

  // Retrieve user data by ID
  const userData = await UserService.getUserById(+id);

  if (!userData) throw new NotFoundError(`User with id: ${id} not found`);

  // Send response with user data
  return res.status(200).json({ data: userData, success: true });
};

/**
 * Creates a new user based on the provided request data.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A Promise that resolves with created user once the user is created.
 * @throws {ClientError} Throws a ClientError if the provided passwords do not match, if an invalid role is provided,
 * or if a user already exists with the given username.
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, name, image, username } = req.body;

  const existingUser = await UserService.getUserByEmail(username);

  if (existingUser) {
    throw new ClientError(`User already exists with username: ${username}`);
  }

  const createdUser = await UserService.createUser(
    username,
    name,
    email,
    image,
  );

  return res.status(201).json({ data: createdUser, success: true });
};

/**
 * Retrieves a user by username from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @throws {ClientError} If an invalid or incorrect username is provided.
 */
const getUserByQuery = async (req: Request, res: Response) => {
  const {
    username,
    userId,
    email,

    not,
    limit,
    sortBy,
    sortOrder,
    pageNumber,
  } = req.query;
  // console.log("doPopulate -> ", !!populate);

  const filter: { id?: number; username?: string; email?: string } = {};
  if (username) {
    filter.username = username as string;
  }
  if (userId) {
    filter.id = +userId;
  }
  if (email) {
    filter.email = email as string;
  }

  const users = await UserService.getUsersByFilter(
    filter,
    +limit,
    sortBy !== "createdAt" && sortBy !== "updatedAt" ? null : sortBy,
    sortOrder !== "asc" && sortOrder !== "desc" ? null : sortOrder,
    +pageNumber,
    +not,
  );

  return res.json({ success: true, data: users });
};

/**
 * Delete a user by ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws a ClientError if an invalid ID is provided.
 * @returns {Promise<Response>} A Promise that resolves when the user is deleted successfully.
 */
const deleteUserById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  // Delete user by ID
  const deleteResp = await UserService.deleteUserById(+id);

  // Send success response
  return res.status(200).json({
    data: deleteResp,
    success: true,
  });
};

/**
 * Updates a user's information in the database by their ID.
 * @param {Request} req - The custom request object containing user information.
 * @param {Response} res - The response object for sending responses.
 * @throws {ClientError} Throws a ClientError if the provided user ID is invalid or if the user with the specified ID or username is not found, or if an invalid role is provided.
 * @throws {Error} Throws an error if the update fails for any other reason.
 */
const updateUserById = async (req: Request, res: Response) => {
  const { username, name, image } = req.body;
  const { id } = req.params;

  const existingUser = await UserService.getUserById(+id);
  if (!existingUser) {
    throw new NotFoundError(`User with id: ${id} not found`);
  }

  const updatedUser = await UserService.updateUser(
    +id,
    username,
    name || existingUser.name,
    image || existingUser.image,
  );

  return res.status(200).json({ data: updatedUser, success: true });
};

/**
 * Get all the users present in the database
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {Promise<Response>} Promise resolved with all the users
 */
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const { not } = req.query;
  const data = await UserService.getAllUsers(+not);
  return res.status(200).json({ data, success: true });
};

export {
  createUser,
  getAllUsers,
  deleteUserById,
  getUserById,
  getUserByQuery,
  updateUserById,
};
