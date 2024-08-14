import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from '../../../data-source';
import { SharingSessionController } from "@/controllers/sharing_sessionController";
import { SharingSessionService } from "@/services/sharing_sessionService";
import Cors from 'nextjs-cors';

const sharingSessionService = new SharingSessionService();
const sharingSessionController = new SharingSessionController(sharingSessionService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await initializeDataSource();
        await Cors(req, res, {
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
            origin: 'http://localhost:3000'
        });

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        switch (req.method) {
            case "POST":
                await sharingSessionController.createSharingSession(req, res);
                break;

            case "GET":
                if (req.query.sharing_session_uuid) {
                    await sharingSessionController.getSharingSessionById(req, res);
                } else {
                    await sharingSessionController.getAllSharingSessions(req, res);
                }
                break;

            case "PUT":
                await sharingSessionController.replaceSharingSession(req, res);
                break;

            case "DELETE":
                if (!req.query.sharing_session_uuid) {
                    return res.status(400).json({ error: "Sharing session UUID is required for deletion" });
                }
                await sharingSessionController.deleteSharingSession(req, res);
                break;

            default:
                res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Handler error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
