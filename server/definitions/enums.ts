enum ESocketConnectionEvents {
  // Connection events
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

enum EProcessingStages {
  InProgress = "InProgress",
  Completed = "Completed",
  Failed = "Failed",
}

enum EStorageTypes {
  AWS = "AWS",
  Cloudinary = "Cloudinary",
  LocalStorage = "LocalStorage",
}

export enum EEmbeddingModel {
  GTELarge = "GTE-Large",
  TextEmbeddingAda = "text-embedding-ada-002",
  MiniLML6V2 = "MiniLML6V2",
}

export { ESocketConnectionEvents, EProcessingStages, EStorageTypes };
