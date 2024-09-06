import type { NextApiRequest, NextApiResponse } from 'next';
import { CommentService } from '@/services/commentServices';
import { CommentController } from '@/controllers/commentController';
import { initializeDataSource } from '../../../data-source';
import { corsMiddleware } from '@/utils/corsMiddleware';
import { authenticateToken } from '@/utils/verifToken';

// Initialize the service and controller
const commentService = new CommentService();
const commentController = new CommentController(commentService);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the database connection
    await initializeDataSource();

    // Set up CORS
    await corsMiddleware(req, res);

    // Remove the X-Powered-By header to hide Next.js usage
    res.removeHeader('X-Powered-By');

    // Set additional security headers (Helmet-like)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Handle the request based on the method
    switch (req.method) {
       /**
       * @swagger
       * /api/comments:
       *   get:
       *     description: Retrieve a single comment by ID or all comments
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - comments
       *     parameters:
       *       - name: comment_uuid
       *         in: query
       *         description: UUID of the comment to retrieve
       *         required: false
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: A list of comments or a single comment
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 comments:
       *                   type: array
       *                   items:
       *                     type: object
       *                     properties:
       *                       uuid:
       *                         type: string
       *                       content:
       *                         type: string
       *                       created_at:
       *                         type: string
       *                         format: date-time
       *                       updated_at:
       *                         type: string
       *                         format: date-time
       *       404:
       *         description: Comment not found
       */
      case 'GET':
        if (req.query.comment_uuid) {
          return commentController.getCommentById(req, res);
        } else {
          return commentController.getAllComments(req, res);
        }

       /**
       * @swagger
       * /api/comments:
       *   post:
       *     description: Create a new comment
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - comments
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               content:
       *                 type: string
       *                 description: The content of the comment
       *               created_at:
       *                 type: string
       *                 format: date-time
       *     responses:
       *       201:
       *         description: Comment created successfully
       *       400:
       *         description: Invalid input
       */
      case 'POST':
        return commentController.createComment(req, res);

       /**
       * @swagger
       * /api/comments:
       *   put:
       *     description: Replace an existing comment by ID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - comments
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               comment_uuid:
       *                 type: string
       *                 description: UUID of the comment to replace
       *               content:
       *                 type: string
       *                 description: The new content of the comment
       *     responses:
       *       200:
       *         description: Comment replaced successfully
       *       404:
       *         description: Comment not found
       */
      case 'PUT':
        return commentController.replaceComment(req, res);

       /**
       * @swagger
       * /api/comments:
       *   patch:
       *     description: Update specific fields of an existing comment
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - comments
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               comment_uuid:
       *                 type: string
       *                 description: UUID of the comment to update
       *               content:
       *                 type: string
       *                 description: The new content of the comment
       *     responses:
       *       200:
       *         description: Comment updated successfully
       *       404:
       *         description: Comment not found
       */
      case 'PATCH':
        return commentController.updateCommentFields(req, res);

       /**
       * @swagger
       * /api/comments:
       *   delete:
       *     description: Delete a comment by ID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - comments
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               comment_uuid:
       *                 type: string
       *                 description: UUID of the comment to delete
       *     responses:
       *       204:
       *         description: Comment deleted successfully
       *       404:
       *         description: Comment not found
       */
      case 'DELETE':
        return commentController.deleteComment(req, res);

      default:
        // If the method is not allowed, return a 405 Method Not Allowed response
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default authenticateToken(handler)