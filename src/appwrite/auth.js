// src/appwrite/auth.js
import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  // ---------- Auth ----------
  async createAccount({ email, password, name /* college not stored by Account */ }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        // Auto-login after sign-up
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const u = await this.account.get();
      // Surface gender at top-level for convenience
      return { ...u, gender: u?.prefs?.gender ?? "" };
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error:", error);
      return null;
    }
  }

  async logOut() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }

  // ---------- Profile updates ----------
  // Unified "save changes" you call from Profile page (no email here)
  async updateProfile({ name, gender }) {
    try {
      // Update name if provided
      if (typeof name === "string" && name.trim().length) {
        await this.account.updateName(name.trim());
      }

      // Update gender in preferences
      if (typeof gender === "string") {
        // Merge existing prefs to avoid overwriting other keys
        const currentPrefs = await this.account.getPrefs();
        await this.account.updatePrefs({ ...currentPrefs, gender });
      }

      // Return fresh user with gender surfaced
      const updated = await this.account.get();
      return { ...updated, gender: updated?.prefs?.gender ?? "" };
    } catch (error) {
      console.error("Appwrite service :: updateProfile :: error", error);
      throw error;
    }
  }

  // Change password (Appwrite requires oldPassword)
  async updatePassword(newPassword, oldPassword) {
    try {
      return await this.account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.log("Appwrite service :: updatePassword :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
