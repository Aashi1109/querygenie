import {Request, Response} from "express";

import config from "@config";
import {EStorageTypes} from "@definitions/enums";
import {IFileData, IUploadFileInterface} from "@definitions/types";
import {ClientError} from "@exceptions";
import {CloudinaryService, FileDataService} from "@services";
import {pdfParserQueue} from "@bmq";

/**
 * Upload a file and create file data in the database.
 * @param {Request} req - The request object containing file upload data.
 * @param {Response} res - The response object.
 * @throws {ClientError} Throws an error if the file upload fails.
 */
const uploadFile = async (req: Request, res: Response) => {
  const { file, format, name, size, uploadTo, projectId } =
    req.body as IUploadFileInterface;

  if (!file && !uploadTo) {
    throw new ClientError("file and uploadTo data is required");
  }
  if (uploadTo === EStorageTypes.Cloudinary) {
    console.log("inside cloudinary section");
    const cloudinaryService = new CloudinaryService(
      config.cloudinary.folderPath,
    );

    const result = await cloudinaryService.uploadFile(file);

    if (!(result && result?.public_id)) {
      throw new ClientError("Error uploading file");
    }
    req.body.storageType = uploadTo;
    req.body.fileMetadata = result;
    req.body.url = result.secure_url;
  }

  await pdfParserQueue.add(
    name + "__PDFParser",
    {
      file: file,
      projectId: projectId,
    },
    { removeOnFail: false, removeOnComplete: true },
  );

  await createFileData(req, res);
};

/**
 * Create file data in the database.
 * @param {Request} req - The request object containing file data.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with created file data.
 */
const createFileData = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { format, name, url, storageType } = req.body as IFileData;
  const fileDataSave = await FileDataService.createFileData(
    url,
    storageType,
    name,
    format,
  );

  return res
    .status(201)
    .type("json")
    .send({ data: fileDataSave, success: true });
};

/**
 * Get Cloudinary file information by public ID.
 * @param {Request} req - The request object containing the file public ID.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with Cloudinary file information.
 */
const getCloudinaryFileByPublicId = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;

  const { options } = req.body;
  const cloudinaryService = new CloudinaryService(config.cloudinary.folderPath);
  const result = await cloudinaryService.getAssetInfo(id, options ?? {});
  return res.status(200).type("json").send({ data: result, success: true });
};

/**
 * Get file data by ID.
 * @param {Request} req - The request object containing the file ID.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with the file data.
 */
const getFileDataById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const fileData = await FileDataService.getFileDataById(+id);
  return res.status(200).type("json").send({ data: fileData, success: true });
};

/**
 * Delete file data by ID.
 * @param {Request} req - The request object containing the file ID.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with the deleted file data.
 */
const deleteFileDataById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const fileData = await FileDataService.deleteFileDataById(+id);
  const isCloudinaryFile = fileData.storageType === EStorageTypes.Cloudinary;
  const isLocalFile = fileData.storageType === EStorageTypes.LocalStorage;

  return res.status(200).type("json").send({ data: fileData, success: true });
};

/**
 * Retrieves filedata by query params from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @throws {ClientError} If an invalid or incorrect username is provided.
 */
const getFileDataByQuery = async (req: Request, res: Response) => {
  const {
    fileDataId,

    not,
    limit,
    sortBy,
    sortOrder,
    pageNumber,
  } = req.query;
  // console.log("doPopulate -> ", !!populate);

  const filter: { id?: number } = {};

  if (fileDataId) {
    filter.id = +fileDataId;
  }

  const users = await FileDataService.getFileDataByFilter(
    filter,
    +limit,
    sortBy !== "createdAt" && sortBy !== "updatedAt" ? null : sortBy,
    sortOrder !== "asc" && sortOrder !== "desc" ? null : sortOrder,
    +pageNumber,
    +not,
  );

  return res.json({ success: true, data: users });
};

export {
  createFileData,
  deleteFileDataById,
  getFileDataByQuery,
  getCloudinaryFileByPublicId,
  getFileDataById,
  uploadFile,
};
