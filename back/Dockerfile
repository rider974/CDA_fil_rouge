FROM node:20-alpine

ENV TOTO=${TOTO}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . .  

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "echo TOTO=$TOTO && npm run start"]
