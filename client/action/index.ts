"use server";

import config from "@/config";
import { formQueryUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// user functions
const getUserByQuery = async (query: any) => {
  const url = config.apiUrl + "/users/query" + formQueryUrl(query);
  const response = await fetch(url);
  return await response.json();
};

const createUser = async (
  name: string,
  email: string,
  username: string,
  image: string,
) => {
  const url = config.apiUrl + "/users";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      username,
      image,
    }),
  });
  return await response.json();
};

const createFileData = async (
  name: string,
  format: string,
  file: string,
  projectId: number,
) => {
  const url = config.apiUrl + "/files/upload";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      format,
      file,
      uploadTo: config.storageType,
      projectId: projectId,
    }),
  });
  return await response.json();
};

// project actions
const createProject = async (
  name: string,
  userId: number,
  description?: string,
  fileDataId?: number,
) => {
  const url = config.apiUrl + "/projects";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      userId,
      description: description,
      fileDataId: fileDataId,
    }),
  });

  const data = await response.json();
  revalidatePath("/projects");
  return data;
};

const updateProject = async (
  projectId: number,
  name?: string,
  description?: string,
  fileDataId?: string,
) => {
  const url = config.apiUrl + `/projects/${projectId}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      description: description,
      fileDataId: fileDataId,
    }),
  });

  return await response.json();
};

const getProjectsByQuery = async (query: any) => {
  const url = config.apiUrl + "/projects/query" + formQueryUrl(query);
  const response = await fetch(url);
  return await response.json();
};

const deleteProject = async (projectId: number) => {
  const url = config.apiUrl + `/projects/${projectId}`;
  const response = await fetch(url, { method: "DELETE" });
  return await response.json();
};

// chat actions
const createChat = async (projectId: number, userId: number) => {
  const url = config.apiUrl + "/chats";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: projectId,
      userId: userId,
    }),
  });
  return await response.json();
};

const getChatByQuery = async (query: any) => {
  const url = config.apiUrl + "/chats/query" + formQueryUrl(query);
  const response = await fetch(url);
  return await response.json();
};

// messages actions
const createMessage = async (
  chatId: number,
  userId: number,
  query: string,
  answer?: string,
) => {
  const url = config.apiUrl + "/messages";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId: chatId,
      userId: userId,
      query: query,
      answer: answer,
    }),
  });
  return await response.json();
};

const getMessagesByQuery = async (query: any) => {
  const url = config.apiUrl + "/messages/query" + formQueryUrl(query);
  const response = await fetch(url);
  return await response.json();
};

const updateMessage = async (
  messageId: number,
  answer?: string,
  regeneratedFor?: number,
) => {
  const url = config.apiUrl + `/messages/${messageId}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer: answer,
      regeneratedFor: regeneratedFor,
    }),
  });
  return await response.json();
};

const deleteMessage = async (messageId: number) => {
  const url = config.apiUrl + `/messages/${messageId}`;
  const response = await fetch(url, { method: "DELETE" });
  return await response.json();
};

const getQdrantSearchResult = async (
  text: string,
  modelName: string,
  collectionName: string,
  limit: number,
  threshold: number,
) => {
  const url = config.apiUrl + "/query/qdranttextsearch";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      modelName: modelName,
      collectionName: collectionName,
      limit: limit,
      threshold: threshold,
    }),
  });
  return await response.json();
};

const getPromptAnswer = async (
  modelname: string,
  input_text: Array<{ role: string; content: string }>,
) => {
  const url = config.apiUrl + "/query/prompt";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      modelname: modelname,
      texts: input_text,
    }),
  });
  return await response.json();
};

export {
  getUserByQuery,
  createUser,
  createFileData,
  createProject,
  updateProject,
  getProjectsByQuery,
  deleteProject,
  createChat,
  getChatByQuery,
  createMessage,
  getMessagesByQuery,
  updateMessage,
  deleteMessage,
  getQdrantSearchResult,
  getPromptAnswer,
};
