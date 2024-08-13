// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { User as AppUser } from "../../../back/src/entity/user";
// import { comparePassword } from "../../../back/src/utils/authUtils";
// import { AppDataSource } from "./../../../back/src/data-source";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         if (!AppDataSource.isInitialized) await AppDataSource.initialize();

//         const userRepository = AppDataSource.getRepository(AppUser);
//         const user = await userRepository.findOneBy({
//           email: credentials.email,
//         });

//         if (user && await comparePassword(credentials.password, user.password)) {
//             // Mapping des propriétés de `User` à celles attendues par NextAuth
//             return {
//               id: user.user_uuid,  
//               name: user.username,  
//               email: user.email,    
//               is_active: user.is_active, 
//               createdAt: user.created_at, 
//               updatedAt: user.updated_at, 
//               role: user.role, 
//               ressources: user.ressources, 
//               comments: user.comments, 
//               sharingSessions: user.sharingSessions, 
//               following: user.following, 
//               followers: user.followers 
//             };
//           }
  
//           return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt" as const,
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = (user as any).id || (user as any).sub || undefined;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           ...session.user,
//           id: token.id as unknown as string,
//         };
//       }
//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       if (url.startsWith(baseUrl)) {
//         return baseUrl + "/authentification/hello-page";
//       }
//       return baseUrl + "/authentification/signin";
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };