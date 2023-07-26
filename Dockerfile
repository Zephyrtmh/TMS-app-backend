FROM node:current-alpine3.18

RUN adduser -D dockerbuilder

USER dockerbuilder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]