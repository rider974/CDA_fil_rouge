// src/__tests__/commentController.test.js
const { CommentController } = require("../controllers/CommentController");
const { CommentService } = require("../services/commentServices");
const { EntityNotFoundError } = require("../errors/errors");
const Joi = require("joi");

// Mock CommentService
jest.mock("../services/commentServices");

// Configuration de base pour les tests
describe("CommentController", () => {
  let req;
  let res;
  let commentController;

  beforeEach(() => {
    req = {
      body: {
        content: "Test comment",
        is_reported: false,
        parentCommentUuid: "123e4567-e89b-12d3-a456-426614174000",
        userUuid: "123e4567-e89b-12d3-a456-426614174000",
        ressourceUuid: "123e4567-e89b-12d3-a456-426614174000",
      },
      query: {
        comment_uuid: "123e4567-e89b-12d3-a456-426614174000",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };

    commentController = new CommentController(new CommentService());
  });

  it("devrait créer un commentaire avec succès", async () => {
    const newComment = { id: "1", ...req.body };
    CommentService.prototype.createComment.mockResolvedValue(newComment);

    await commentController.createComment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newComment);
  });

  it("devrait retourner une erreur 400 pour une validation échouée", async () => {
    const invalidBody = { ...req.body, userUuid: undefined };
    req.body = invalidBody;

    await commentController.createComment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "\"userUuid\" is required" });
  });

  it("devrait récupérer tous les commentaires avec succès", async () => {
    const comments = [{ id: "1", ...req.body }];
    CommentService.prototype.getAllComments.mockResolvedValue(comments);

    await commentController.getAllComments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comments);
  });

  it("devrait récupérer un commentaire par ID avec succès", async () => {
    const comment = { id: "1", ...req.body };
    CommentService.prototype.getCommentById.mockResolvedValue(comment);

    await commentController.getCommentById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(comment);
  });

  it("devrait retourner une erreur 404 si le commentaire n'est pas trouvé", async () => {
    CommentService.prototype.getCommentById.mockResolvedValue(null);

    await commentController.getCommentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
  });

  it("devrait remplacer un commentaire avec succès", async () => {
    const updatedComment = { id: "1", ...req.body };
    CommentService.prototype.replaceComment.mockResolvedValue(updatedComment);

    await commentController.replaceComment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedComment);
  });

  it("devrait retourner une erreur 404 lors du remplacement d'un commentaire non trouvé", async () => {
    CommentService.prototype.replaceComment.mockResolvedValue(null);

    await commentController.replaceComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
  });

  it("devrait mettre à jour des champs de commentaire avec succès", async () => {
    const updatedComment = { id: "1", ...req.body };
    CommentService.prototype.updateCommentFields.mockResolvedValue(updatedComment);

    await commentController.updateCommentFields(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedComment);
  });

  it("devrait retourner une erreur 404 lors de la mise à jour d'un commentaire non trouvé", async () => {
    CommentService.prototype.updateCommentFields.mockResolvedValue(null);

    await commentController.updateCommentFields(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
  });

  it("devrait supprimer un commentaire avec succès", async () => {
    CommentService.prototype.deleteComment.mockResolvedValue(true);

    await commentController.deleteComment(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it("devrait retourner une erreur 404 lors de la suppression d'un commentaire non trouvé", async () => {
    CommentService.prototype.deleteComment.mockResolvedValue(false);

    await commentController.deleteComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Comment not found" });
  });
});
