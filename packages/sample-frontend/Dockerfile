FROM node:16.9.0-alpine as builder

RUN mkdir /app
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM nginx:1.21.3-alpine
COPY ./packages/sample-frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/packages/sample-frontend/build/ /usr/share/nginx/html/
