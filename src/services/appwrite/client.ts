import { APP_CONFIG } from "@/src/core/config/app";
import { Account, Client, Databases, Storage, Functions } from "react-native-appwrite";

class AppwriteClient {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  functions: Functions;

  constructor() {
    this.client = new Client();

    this.client
      .setEndpoint(APP_CONFIG.APPWRITE.ENDPOINT)
      .setProject(APP_CONFIG.APPWRITE.PROJECT_ID)
      .setPlatform("com.arhanansari.ResuMate"); // Ensure this matches app.json bundleIdentifier

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.functions = new Functions(this.client);
  }
}

export const appwrite = new AppwriteClient();
