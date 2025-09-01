import { Client, Account, ID, Databases } from "appwrite";
import conf from "../conf/conf"; // your config file with IDs

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(conf.appwriteUrl) // e.g. http://localhost/v1
    .setProject(conf.appwriteProjectId);

const account = new Account(client);
const databases = new Databases(client);

export class AuthService {
    // ------------------ SIGNUP ------------------
    async createAccount({ email, password, name, college }) {
        try {
            // 1. Create account in Appwrite Auth
            const userAccount = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                // 2. Create user profile document in "users" collection
                await databases.createDocument(
                    conf.appwriteDatabaseId,          // marketplace DB id
                    conf.appwriteUsersCollectionId,   // users collection id
                    userAccount.$id,                  // use same id as auth user
                    {
                        name: userAccount.name,
                        email: userAccount.email,
                        college: college || ""
                    }
                );

                // 3. Log user in immediately after signup
                return this.login({ email, password });
            }
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    }

    // ------------------ LOGIN ------------------
    async login({ email, password }) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    // ------------------ GET CURRENT USER ------------------
    async getCurrentUser() {
        try {
            const user = await account.get();
            if (!user) return null;

            // Fetch profile from users collection
            const profile = await databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUsersCollectionId,
                user.$id
            );

            return { ...user, profile };
        } catch (error) {
            console.error("getCurrentUser error:", error);
            return null;
        }
    }

    // ------------------ LOGOUT ------------------
    async logout() {
        try {
            return await account.deleteSessions();
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
