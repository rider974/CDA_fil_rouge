
import NextAuth, { DefaultSession } from "next-auth";

// Déclaration du type Role
interface Role {
  role_uuid: string;
  role_name: string;
}

 // Étend l'interface User pour inclure les propriétés de votre entité User
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    role: Role;
    provider?: string;
  }

  
  // Étend l'interface Session pour inclure l'ID utilisateur et les propriétés de base, ainsi que l'accessToken
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: Role;
      provider?: string; // Ajoute le provider si nécessaire dans la session
    } & DefaultSession["user"];
    accessToken?: string; // Ajoute accessToken pour gérer l'authentification via OAuth
  }

  // Étend l'interface JWT pour inclure l'ID utilisateur
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    provider?: string; // Ajoute le provider si nécessaire dans le JWT
  }
}
