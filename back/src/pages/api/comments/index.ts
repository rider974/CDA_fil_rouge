import type { NextApiRequest, NextApiResponse } from 'next';
import { CommentService } from '@/services/commentServices';
import { CommentController } from '@/controllers/commentController';
import { initializeDataSource } from '../../../data-source';
import Cors from 'nextjs-cors';

// Initialize the service and controller
const commentService = new CommentService();
const commentController = new CommentController(commentService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize the database connection
    await initializeDataSource();

    // Set up CORS
    await Cors(req, res, {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      origin: 'http://localhost:3000', // Adjust this to your front-end URL or use `*` for all origins
    });

    // Handle the request based on the method
    switch (req.method) {
      case 'GET':
        // Check if the request is for a single comment by ID or all comments
        if (req.query.comment_uuid) {
          return commentController.getCommentById(req, res);
        } else {
          return commentController.getAllComments(req, res);
        }
      case 'POST':
        return commentController.createComment(req, res);
      case 'PUT':
        return commentController.replaceComment(req, res);
      case 'PATCH':
        return commentController.updateCommentFields(req, res);
      case 'DELETE':
        return commentController.deleteComment(req, res);
      default:
        // If the HTTP method is not supported
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
