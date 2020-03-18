FROM node:alpine as builder

ENV STAGING_URL=http://192.168.64.3

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

RUN rm -rf .next

RUN yarn build

EXPOSE 3000/tcp

CMD ["yarn", "start"]
