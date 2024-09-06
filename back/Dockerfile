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
RUN npm install ts-node typescript tsconfig-paths netcat 

# Compiler le code TypeScript
RUN npm run build

# Exposer le port utilisé par l'application
EXPOSE 3001

# Exécuter la commande pour les migrations et démarrer l'application
CMD ["npm", "run", "start"]
