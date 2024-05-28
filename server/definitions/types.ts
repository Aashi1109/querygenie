import { EProcessingStages, EStorageTypes } from "@definitions/enums";

interface IUser {
  id?: number;
  email: string;
  name: string;
  image: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  projects?: IProject[];
  chats?: IChat[];
}

interface IFileData {
  id?: number;
  url: string;
  storageType: EStorageTypes | any;
  name: string;
  format: string;
  project?: IProject[];
  createdAt: Date;
  updatedAt: Date;
}

interface IProject {
  id?: number;
  description?: string;
  name: string;
  fileData?: IFileData;
  fileDataId: number;
  user?: IUser;
  userId: number;
  collectionId?: string;
  processingStage: EProcessingStages | any;
  vector?: IVector[];
  createdAt: Date;
  updatedAt: Date;
}

interface IVector {
  id?: number;
  project?: IProject;
  projectId: number;
  vectorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IChat {
  id?: number;
  user?: IUser;
  userId: number;
  messages?: IMessage[];
  project?: IProject;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IMessage {
  id?: number;
  chat?: IChat;
  chatId: number;
  query: string;
  answer?: string;
  regeneratedFor?: IMessage;
  message?: IMessage;
  messageId?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GetByFilterOptions {
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pageNumber?: number;
  not?: number;
}

interface ICloudinaryImageUploadOptions {
  user_filename?: boolean;
  unique_filename?: boolean;
  overwrite?: boolean;
  resource_type?: string | any;
  folder?: string;
}

interface IFileInterface {
  file: string;
  name: string;
  format: string;
  size: string;
}

interface IUploadFileInterface extends IFileInterface {
  uploadTo: EStorageTypes;
  path?: string;
  projectId?: string;
}

interface ICloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

interface IProjectCollection {
  id: number;
  project?: IProject;
  projectId?: number;
  collectionId: string;
}

export {
  IUser,
  IFileData,
  IProjectCollection,
  IProject,
  IUploadFileInterface,
  ICloudinaryResponse,
  ICloudinaryImageUploadOptions,
  IVector,
  IChat,
  IMessage,
  GetByFilterOptions,
};
