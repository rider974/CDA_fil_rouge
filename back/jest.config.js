// jest.config.js
const nextJest = require("next/jest");

// Fournit le chemin vers le dossier racine de l'application
const createJestConfig = nextJest({
  dir: "./",
});

// Configuration Jest personnalisée
const customJestConfig = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Supporte les alias Next.js
  },
};

module.exports = createJestConfig(customJestConfig);
