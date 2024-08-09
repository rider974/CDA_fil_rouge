import type { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "../../data-source";
import { User } from "@/entity/user";

let dataSourceInitialized = false;

async function initializeDataSource() {
  if (!dataSourceInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("DataSource initialized");
      dataSourceInitialized = true;
    } catch (error) {
      console.error("Error during DataSource initialization:", error);
      throw error; 
    }
  }
}

async function getServerSideProps() {
  const toto = await AppDataSource.manager.findOneBy(User, { username: "dzano" });
  return JSON.stringify(toto);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    await initializeDataSource();

    const result = await getServerSideProps();
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
