import { Session } from "next-auth";

export interface ISession extends Session {
  user: IUser;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  image: string;
}

export interface IFileDetails {
  base64: string;
  name: string;
  format: string;
}

export enum EProcessingStages {
  InProgress = "InProgress",
  Completed = "Completed",
  Failed = "Failed",
}

export interface IProject {
  id: number;
  description?: string;
  name: string;
  fileDataId?: number;
  userId: number;
  processingStage: EProcessingStages | any;
  collectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EIndicators {
  InProgress = "InProgress",
  Completed = "Completed",
  Failed = "Failed",
}

export interface IMessage {
  id: number;
  chatId: number;
  userId?: number;
  query: string;
  answer?: string;
  messageId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
