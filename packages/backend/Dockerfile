
FROM node:16.9.0-alpine as builder

RUN mkdir /app
WORKDIR /app
COPY . .
RUN yarn install && yarn build

CMD [ "node", "/app/packages/backend/dist/index.js" ]
