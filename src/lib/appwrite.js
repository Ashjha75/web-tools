import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("http://localhost/v1")
    .setProject("web-tools");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
