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
             /**
             * @swagger
             * /api/sharing_session:
             *   post:
             *     description: Create a new sharing session
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               name:
             *                 type: string
             *                 description: The name of the sharing session
             *               description:
             *                 type: string
             *                 description: Description of the sharing session
             *     responses:
             *       201:
             *         description: Sharing session created successfully
             *       400:
             *         description: Invalid input
             */
            case "POST":
                await sharingSessionController.createSharingSession(req, res);
                break;

             /**
             * @swagger
             * /api/sharing_session:
             *   get:
             *     description: Retrieve all sharing sessions or a specific sharing session by ID
             *     parameters:
             *       - name: sharing_session_uuid
             *         in: query
             *         description: UUID of the sharing session to retrieve
             *         required: false
             *         schema:
             *           type: string
             *     responses:
             *       200:
             *         description: A list of sharing sessions or a specific sharing session
             *         content:
             *           application/json:
             *             schema:
             *               type: array
             *               items:
             *                 type: object
             *                 properties:
             *                   sharing_session_uuid:
             *                     type: string
             *                     description: The UUID of the sharing session
             *                   name:
             *                     type: string
             *                     description: The name of the sharing session
             *                   description:
             *                     type: string
             *                     description: Description of the sharing session
             *       404:
             *         description: Sharing session not found
             */
            case "GET":
                if (req.query.sharing_session_uuid) {
                    await sharingSessionController.getSharingSessionById(req, res);
                } else {
                    await sharingSessionController.getAllSharingSessions(req, res);
                }
                break;

             /**
             * @swagger
             * /api/sharing_session:
             *   put:
             *     description: Replace an existing sharing session
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               sharing_session_uuid:
             *                 type: string
             *                 description: UUID of the sharing session to replace
             *               name:
             *                 type: string
             *                 description: The new name of the sharing session
             *               description:
             *                 type: string
             *                 description: New description of the sharing session
             *     responses:
             *       200:
             *         description: Sharing session replaced successfully
             *       400:
             *         description: Invalid input
             *       404:
             *         description: Sharing session not found
             */
            case "PUT":
                await sharingSessionController.replaceSharingSession(req, res);
                break;

             /**
             * @swagger
             * /api/sharing_session:
             *   delete:
             *     description: Delete a sharing session by UUID
             *     parameters:
             *       - name: sharing_session_uuid
             *         in: query
             *         description: UUID of the sharing session to delete
             *         required: true
             *         schema:
             *           type: string
             *     responses:
             *       204:
             *         description: Sharing session deleted successfully
             *       400:
             *         description: Invalid UUID
             *       404:
             *         description: Sharing session not found
             */
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
