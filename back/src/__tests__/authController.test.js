const { AuthController } = require("../controllers/AuthController");
const { AuthService } = require("../services/authService");
const { UserService } = require("../services/userService");

jest.mock("../services/authService"); // Mock AuthService
jest.mock("../services/userService"); // Mock UserService

describe("AuthController", () => {
  let req;
  let res;
  let authController;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    authController = new AuthController();
  });

  it("devrait retourner un utilisateur lorsqu'une connexion est réussie", async () => {
    // Configurer le mock pour que la méthode login retourne un utilisateur simulé
    AuthService.prototype.login.mockResolvedValue({ id: 1, email: "test@example.com" });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: { id: 1, email: "test@example.com" } });
  });

  it("devrait retourner une erreur 400 lorsqu'une exception est levée", async () => {
    // Configurer le mock pour simuler une erreur
    AuthService.prototype.login.mockRejectedValue(new Error("Connexion échouée"));

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Connexion échouée" });
  });

  it("devrait retourner une erreur 500 pour une erreur inconnue", async () => {
    // Configurer le mock pour simuler une erreur inconnue (qui n'est pas une instance d'Error)
    AuthService.prototype.login.mockRejectedValue("Erreur inconnue");

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Une erreur inconnue s'est produite" });
  });
});
