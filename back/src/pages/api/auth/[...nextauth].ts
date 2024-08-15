import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { corsMiddleware } from "@/utils/corsMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Appliquer le middleware CORS
  await corsMiddleware(req, res);

  // Appeler NextAuth avec les options configurées
  return NextAuth(authOptions)(req, res);
}
