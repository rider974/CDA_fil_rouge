// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/authentification/signin",
//   },
//   callbacks: {
//     async authorized({ req, token }) {
//       // Ajout de restriction : Autoriser l'accès seulement si un token est présent
//       return !!token;
//     },
//   },
// });

// export const config = { matcher: [ "/dashboard/:path*"] }; // Protégez les pages de tableau de bord