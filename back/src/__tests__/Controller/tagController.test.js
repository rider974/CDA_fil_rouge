const { TagController } = require('@/controllers/tagController');
const { TagService } = require('@/services/tagService');
const { UniqueConstraintViolationError } = require('@/errors/errors');

// Mock TagService
jest.mock('../services/tagService');

describe('TagController', () => {
  let req;
  let res;
  let tagController;

  beforeEach(() => {
    req = {
      body: {
        tag_title: 'Test Tag',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };

    tagController = new TagController(new TagService());
  });

  it('devrait créer un nouveau tag avec succès', async () => {
    const newTag = { tag_uuid: '123e4567-e89b-12d3-a456-426614174000', tag_title: 'Test Tag' };
    TagService.prototype.createTag.mockResolvedValue(newTag);

    await tagController.createTag(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newTag);
  });

  it('devrait retourner une erreur 400 si la validation échoue', async () => {
    req.body.tag_title = ''; // Titre du tag invalide

    await tagController.createTag(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Tag title is required' });
  });

  it("devrait retourner une erreur 409 si une contrainte d'unicité est violée", async () => {
    TagService.prototype.createTag.mockRejectedValue(new UniqueConstraintViolationError('Tag title must be unique'));

    await tagController.createTag(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Tag title must be unique' });
  });

  it('devrait retourner une erreur 500 en cas de problème interne', async () => {
    TagService.prototype.createTag.mockRejectedValue(new Error('Some error'));

    await tagController.createTag(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});