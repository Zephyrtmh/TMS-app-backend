FROM node:current-alpine3.18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN adduser -D dockerbuilder

USER dockerbuilder

EXPOSE 8080

CMD ["npm", "start"]