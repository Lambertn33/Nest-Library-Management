FROM node:18-alpine3.16

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["node", "dist/src/main.js"]