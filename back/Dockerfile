FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . .  

RUN npm run build

# Installer ts-node et typeorm globalement
RUN npm install -g ts-node@latest typeorm@latest tsconfig-paths@latest

# Exécuter les migrations
RUN npx ts-node --require tsconfig-paths/register run-migrations.ts || true

# Exécuter le seeder
RUN npx ts-node --require tsconfig-paths/register src/seeder/seedRoles.ts || true

EXPOSE 3001

CMD ["npm" ,"run" ,"start"]