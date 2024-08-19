FROM node:20-alpine

ARG TOTO

ENV TOTO=${TOTO}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 

COPY . .  

RUN npm run build

EXPOSE 3001

CMD ["npm" ,"run" ,"start"]