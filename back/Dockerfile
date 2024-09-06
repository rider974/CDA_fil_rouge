FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de configuration npm
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Installer ts-node, typescript et tsconfig-paths
RUN npm install ts-node typescript tsconfig-paths

# Compiler le code TypeScript
RUN npm run build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Exécuter la commande pour les migrations et démarrer l'application
CMD ["sh", "-c", "npx ts-node -r tsconfig-paths/register ./run-migrations.ts && npm start"]
