FROM node:alpine as builder

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

RUN rm -rf .next

RUN yarn build

EXPOSE 3000/tcp

CMD ["yarn", "start"]
