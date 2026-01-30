import { Client, Storage } from "appwrite";

// Appwrite configuration for myDrive project
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_MYDRIVE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_MYDRIVE_APPWRITE_PROJECT_ID);

export const storage = new Storage(client);

export const BUCKET_ID = import.meta.env.VITE_MYDRIVE_BUCKET_ID;

export default client;
