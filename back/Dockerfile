FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . .  

RUN npm run build

# Exécuter les migrations avant de démarrer l'application
RUN npx ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm migration:run -d src/data-source.ts

# Exécuter le seeder avant de démarrer l'application
RUN ts-node src/seeder/seedRoles.ts

EXPOSE 3001

CMD ["npm" ,"run" ,"start"]