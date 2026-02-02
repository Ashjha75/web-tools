import { Client, Storage, Account } from "appwrite";

// Appwrite configuration for Mydrive project
// Reuse the main client to maintain authentication session
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || "http://localhost/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const storage = new Storage(client);
export const account = new Account(client);

export const BUCKET_ID = import.meta.env.VITE_MYDRIVE_BUCKET_ID;

// Log config for debugging

export default client;
