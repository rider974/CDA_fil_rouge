
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Étend l'interface User pour inclure les propriétés de votre entité User
  interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    provider?: string;
  }

  // Étend l'interface Session pour inclure l'ID utilisateur et les propriétés de base
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      provider?: string; // Ajoute le provider si nécessaire dans la session
    } & DefaultSession["user"];
  }

  // Étend l'interface JWT pour inclure l'ID utilisateur
  interface JWT {
    id: string;
    email: string;
    name: string;
    provider?: string; // Ajoute le provider si nécessaire dans le JWT
  }
}
