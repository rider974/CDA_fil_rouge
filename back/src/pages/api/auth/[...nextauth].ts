import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/services/authService"; 
import { initializeDataSource } from "@/data-source";

// Initialisez la base de données avant toute autre opération
async function initDatabase() {
  try {
    await initializeDataSource();
  } catch (error) {
    console.error("Failed to initialize the database:", error);
    throw new Error("Database initialization failed");
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          await initDatabase(); 
          const authService = new AuthService();
          const user = await authService.login(credentials.email, credentials.password);

          if (user) {
            return {
              id: user.user_uuid,
              name: user.username,
              email: user.email,
              role: user.role.role_name,
              createdAt: user.created_at,
              provider: "credentials",
            };
          }

          return null;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
 
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Si un utilisateur est présent lors de la connexion, ajoute ses informations au token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token; // avec les nouvelles propriétés
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session?.user, // Conserve les autres propriétés de `session.user`
          id: token.id as string, // Ajoute l'ID de l'utilisateur à la session
          role: token.role as string, // Ajoute le rôle de l'utilisateur à la session
        };
      }
      return session; // session avec les nouvelles propriétés
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return baseUrl + "/authentification/hello-page";
      }
      return baseUrl + "/authentification/signin";
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Clé secrète pour signer les tokens JWT
};

export default NextAuth(authOptions);