import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from '@/data-source';
import { Ressources_typesController } from "@/controllers/ressources_typesController";
import { Ressources_typesService } from "@/services/ressources_typesService";
import Cors from 'nextjs-cors';

const ressources_typesService = new Ressources_typesService();
const ressources_typesController = new Ressources_typesController(ressources_typesService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();

    await Cors(req, res, {
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
      origin: 'http://localhost:3000',
    });

    switch (req.method) {
      case "POST":
        // Appelle la méthode pour créer un type de ressource
        await ressources_typesController.createRessources_types(req, res);
        break;

      case "GET":
        // Récupère tous les types de ressources ou un type par UUID
        if (req.query.ressource_type_uuid) {
          await ressources_typesController.getRessources_typesById(req, res);
        } else {
          await ressources_typesController.getAllRessources_types(req, res);
        }
        break;

      case "PUT":
      case "PATCH":
        // Met à jour un type de ressource par UUID
        await ressources_typesController.replaceRessources_types(req, res);
        break;

      case "DELETE":
        // Supprime un type de ressource par UUID
        await ressources_typesController.deleteRessources_types(req, res);
        break;

      default:
        res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}