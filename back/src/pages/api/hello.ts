// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {AppDataSource} from "../../data-source"
import User from "@/entity/user";


 async function getServerSideProps() {
  const toto = await AppDataSource.manager.findOneBy(User, {username: 'dnazo'});
  return JSON.stringify(toto);
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await getServerSideProps();
  return res.json({result });
  
}
